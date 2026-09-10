import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";
import path from "node:path";
import { PURPOSES, TASTES } from "@/lib/options";
import { promptProvider, parseDataUrl, GEMINI_TEXT_MODEL } from "@/lib/providers";
import { friendlyError } from "@/lib/errors";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  product: string;
  purposeId: string;
  tasteId: string;
  idea: string;
  referenceImages?: string[]; // data URLs
  mode?: "generate" | "edit";
};

let cachedKnowledge: string | null = null;
async function loadKnowledge(): Promise<string> {
  if (cachedKnowledge) return cachedKnowledge;
  cachedKnowledge = await fs.readFile(path.join(process.cwd(), "knowledge", "brand_knowledge.md"), "utf8");
  return cachedKnowledge;
}

const SYSTEM_INSTRUCTIONS = `
あなたは Pharmesthetic JAPAN 専属のビジュアルディレクター兼プロンプトエンジニアです。
役割: スタッフの入力（商品・用途・イメージ・参照画像）から、画像生成AI用の **英語の連続文プロンプト1本** を作成する。

厳守事項:
1. 下記ナレッジベース（ブランド理念・VI・薬機法・確定プロンプト PR-01〜PR-04・4トーン・チェックリスト）に完全準拠する。矛盾する要望は採用せず、warnings で理由を返す。
2. プロンプトは**分割せず1本の連続した英文段落（改行なし）**。長さは 900〜1,800 文字目安。見出し・箇条書き・番号は入れない。
3. 確定テイスト（PR-01 等）を使う場合は、その定型句（tilted overhead / not a 3D render / grain・muted contrast / sharp square corners / spelled letter by letter など）を落とさず、商品・用途・サイズ分だけ差し替える。
4. 画像内に文字を入れない（唯一の例外は巾着への Pharmesthetic ワードマーク、規定どおり）。ロゴマークは絶対に生成させない。
5. 顔・手・肌・塗布・BA・医療器具・氷雪・（SPF商材では）太陽/海 等の効能暗示要素を入れない。参考ブランド名を書かない。
6. 参照画像が添付された場合: 外観（容器形状・色・印刷・キャップ）を文章で正確に描写し、「参照画像の背景・角丸・箱・カメラアングルは引き継がず、新規撮影として再構成する」旨を明示する。mode=edit の場合は PR-03 の作法（1要素だけ差し替え、他は pixel-faithful に維持）で書く。
7. 用途ごとのサイズ・余白指針を反映する（渡された purpose note を使う）。
8. 未確定事項（銀、navy背景の彩度運用など）に触れる要望は、安全側（規定色4色・無彩背景）に倒し warnings に記載する。

出力形式: 次の JSON のみを返す（前後に説明文・コードフェンスを付けない）。
{
  "prompt": "<英語の連続文プロンプト1本>",
  "tone": "<採用したテイスト名（例: PR-01 標準形）>",
  "notes_ja": "<スタッフ向けの日本語メモ: 何を意図した構図か、生成後に見るべきポイント（3〜6行）>",
  "warnings": ["<規定により変更・除外した点があれば日本語で。なければ空配列>"]
}
`;

function fallbackPrompt(body: Body, purposeNote: string): string {
  return `A real phone photograph, not a 3D render, not a mockup and not a composite, seen from close to overhead but noticeably tilted so the scene is seen slightly obliquely: a white marble surface with soft grey veining, on the left two thirds a cream-colored coarsely woven cotton drawstring pouch with gathers, a twisted cord and natural creases, and resting diagonally on top of the pouch ${body.product} with its printed face toward the camera and its cap closed, packaging printing reproduced faithfully and nothing else written anywhere in the frame; overcast window light from the upper left, soft shadows falling to the lower right, an empty area of plain marble in the upper right, off-center framing with the pouch cut by the left edge; slightly soft focus, mild grain, muted contrast, a faint natural vignette; no people, no hands, no skin, no logos, no text, no labels other than the product's own printing. ${purposeNote} ${body.idea}`;
}

function buildUserText(body: Body, purpose: (typeof PURPOSES)[number], taste: (typeof TASTES)[number]) {
  return [
    `【モード】${body.mode === "edit" ? "既存カットの編集（PR-03方式・1要素差し替え）" : "新規生成"}`,
    `【商品】${body.product}`,
    `【用途】${purpose.label}（出力サイズ ${purpose.size}）`,
    `【用途指針】${purpose.note}`,
    `【テイスト指定】${taste.label}`,
    `【テイスト指針】${taste.hint}`,
    `【作りたいイメージ（スタッフ入力）】${body.idea || "（指定なし）"}`,
    (body.referenceImages?.length ?? 0) > 0
      ? `【参照画像】${body.referenceImages!.length}枚添付。${body.mode === "edit" ? "1枚目が編集元の完成カット。" : "商品の外観把握用。背景・角丸・箱・アングルは引き継がない。"}`
      : "【参照画像】なし",
    "",
    "上記から JSON を返してください。",
  ].join("\n");
}

function parseJson(text: string) {
  const s = text.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  return JSON.parse(s.slice(a, b + 1));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const purpose = PURPOSES.find((p) => p.id === body.purposeId) ?? PURPOSES[0];
  const taste = TASTES.find((t) => t.id === body.tasteId) ?? TASTES[TASTES.length - 1];
  if (!body.product?.trim()) return NextResponse.json({ error: "商品名を入力してください" }, { status: 400 });

  const provider = promptProvider();
  if (provider === "demo") {
    return NextResponse.json({
      demo: true,
      prompt: fallbackPrompt(body, purpose.note),
      tone: "PR-01 標準形（デモ）",
      notes_ja: "GEMINI_API_KEY（または ANTHROPIC_API_KEY）が未設定のためテンプレートを返しています。",
      warnings: [],
    });
  }

  const knowledge = await loadKnowledge();
  const refs = (body.referenceImages ?? []).slice(0, 4).map(parseDataUrl).filter(Boolean) as { mime: string; data: string }[];
  const userText = buildUserText(body, purpose, taste);
  let text = "";

  try {
    if (provider === "gemini") {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const res = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL(),
        contents: [
          {
            role: "user",
            parts: [
              ...refs.map((r) => ({ inlineData: { mimeType: r.mime, data: r.data } })),
              { text: userText },
            ],
          },
        ],
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTIONS}\n\n===== ナレッジベース =====\n${knowledge}`,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });
      text = res.text ?? "";
    } else {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
      const content: Anthropic.Messages.ContentBlockParam[] = [
        ...refs.map((r) => ({
          type: "image" as const,
          source: { type: "base64" as const, media_type: r.mime as "image/jpeg" | "image/png" | "image/webp" | "image/gif", data: r.data },
        })),
        { type: "text", text: userText },
      ];
      const msg = await client.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 2500,
        system: [
          { type: "text", text: SYSTEM_INSTRUCTIONS },
          { type: "text", text: `===== ナレッジベース =====\n${knowledge}`, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content }],
      });
      text = msg.content.filter((c): c is Anthropic.Messages.TextBlock => c.type === "text").map((c) => c.text).join("\n");
    }
  } catch (e: unknown) {
    const { message, status } = friendlyError(e, "プロンプト生成に失敗しました");
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const parsed = parseJson(text);
    return NextResponse.json({
      provider,
      prompt: String(parsed.prompt ?? "").replace(/\s*\n\s*/g, " ").trim(),
      tone: parsed.tone ?? taste.label,
      notes_ja: parsed.notes_ja ?? "",
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    });
  } catch {
    return NextResponse.json({ provider, prompt: text.trim(), tone: taste.label, notes_ja: "", warnings: ["JSON解析に失敗したため生テキストを表示しています"] });
  }
}

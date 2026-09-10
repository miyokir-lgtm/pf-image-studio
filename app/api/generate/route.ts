import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { GoogleGenAI } from "@google/genai";
import type { ImageSize, Quality } from "@/lib/options";
import { imageProvider, parseDataUrl, sizeToAspect, GEMINI_IMAGE_MODEL } from "@/lib/providers";
import { friendlyError } from "@/lib/errors";

export const runtime = "nodejs";
export const maxDuration = 60; // Hobby プラン上限（Fluid Compute 無効時）。Gemini は1枚10〜20秒

type Body = {
  prompt: string;
  size: ImageSize;
  quality: Quality;
  n: number;
  referenceImages?: string[];
};

const ALLOWED_SIZES: ImageSize[] = ["1024x1024", "1024x1536", "1536x1024"];
const ALLOWED_Q: Quality[] = ["low", "medium", "high"];

function placeholder(size: ImageSize, i: number): string {
  const [w, h] = size.split("x").map(Number);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#F4F1EC"/><rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.55}" height="${h * 0.7}" rx="${w * 0.04}" fill="#E8E2D8"/><text x="50%" y="52%" font-family="Georgia,serif" font-size="${Math.round(w * 0.045)}" fill="#222C40" text-anchor="middle">DEMO ${i + 1} — ${size}</text><text x="50%" y="60%" font-family="sans-serif" font-size="${Math.round(w * 0.025)}" fill="#998062" text-anchor="middle">GEMINI_API_KEY を設定すると実画像が生成されます</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ---------- Gemini (Nano Banana) ----------
async function generateGemini(prompt: string, size: ImageSize, refs: { mime: string; data: string }[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const res = await ai.models.generateContent({
    model: GEMINI_IMAGE_MODEL(),
    contents: [
      {
        role: "user",
        parts: [
          ...refs.map((r) => ({ inlineData: { mimeType: r.mime, data: r.data } })),
          { text: prompt },
        ],
      },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: sizeToAspect(size) },
    },
  });
  const parts = res.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img?.inlineData?.data) {
    const reason = res.candidates?.[0]?.finishReason || res.promptFeedback?.blockReason || "画像が返されませんでした";
    throw new Error(`Gemini: ${reason}`);
  }
  return `data:${img.inlineData.mimeType || "image/png"};base64,${img.inlineData.data}`;
}

// ---------- OpenAI (gpt-image-1) ----------
async function generateOpenAI(prompt: string, size: ImageSize, quality: Quality, refs: { mime: string; data: string }[]): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  if (refs.length > 0) {
    const files = await Promise.all(refs.map((r, j) => toFile(Buffer.from(r.data, "base64"), `ref${j}.${r.mime.split("/")[1]}`, { type: r.mime })));
    const res = await client.images.edit({
      model,
      image: files.length === 1 ? files[0] : files,
      prompt,
      size,
      quality,
      n: 1,
      // @ts-expect-error gpt-image-1 固有パラメータ
      output_format: "webp",
      output_compression: 85,
    });
    return `data:image/webp;base64,${res.data![0].b64_json}`;
  }
  const res = await client.images.generate({ model, prompt, size, quality, n: 1, output_format: "webp", output_compression: 85 } as OpenAI.Images.ImageGenerateParams);
  return `data:image/webp;base64,${res.data![0].b64_json}`;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const size = ALLOWED_SIZES.includes(body.size) ? body.size : "1024x1024";
  const quality = ALLOWED_Q.includes(body.quality) ? body.quality : "medium";
  const maxN = Number(process.env.MAX_IMAGES_PER_REQUEST || 3);
  const n = Math.max(1, Math.min(maxN, Number(body.n) || 1));
  const prompt = (body.prompt || "").trim();
  if (!prompt) return NextResponse.json({ error: "プロンプトが空です" }, { status: 400 });

  const provider = imageProvider();
  if (provider === "demo") {
    return NextResponse.json({ demo: true, provider, images: Array.from({ length: n }, (_, i) => placeholder(size, i)) });
  }

  const refs = (body.referenceImages ?? []).slice(0, 4).map(parseDataUrl).filter(Boolean) as { mime: string; data: string }[];

  try {
    const jobs = Array.from({ length: n }, () =>
      provider === "gemini" ? generateGemini(prompt, size, refs) : generateOpenAI(prompt, size, quality, refs),
    );
    // 1枚でも成功すれば返す（無料枠のレート制限で一部失敗しても使えるように）
    const settled = await Promise.allSettled(jobs);
    const images = settled.filter((s): s is PromiseFulfilledResult<string> => s.status === "fulfilled").map((s) => s.value);
    const failures = settled.filter((s): s is PromiseRejectedResult => s.status === "rejected").map((s) => String(s.reason?.message || s.reason));
    if (images.length === 0) throw new Error(failures[0] || "画像生成に失敗しました");
    return NextResponse.json({ images, provider, size, failures });
  } catch (e: unknown) {
    const { message, status } = friendlyError(e, "画像生成に失敗しました");
    return NextResponse.json({ error: message }, { status });
  }
}

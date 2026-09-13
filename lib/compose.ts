// プロンプト組み立て（API不使用・ブラウザ内で即時実行）
// content/*.json のマスタを固定順に連結する。
import tonesData from "@/content/tones.json";
import productsData from "@/content/products.json";
import purposesData from "@/content/purposes.json";
import rulesData from "@/content/rules.json";

export type Tone = (typeof tonesData.tones)[number];
export type Product = (typeof productsData.products)[number];
export type Purpose = (typeof purposesData.purposes)[number];
export type Variant = Purpose["variants"][number];
export type ExtraChip = (typeof rulesData.extras)[number];

export const TONES: Tone[] = tonesData.tones;
export const PRODUCTS: Product[] = productsData.products;
export const PURPOSES: Purpose[] = purposesData.purposes;
export const EXTRAS: ExtraChip[] = rulesData.extras;
export const RULES = rulesData;

export const getTone = (id: string) => TONES.find((t) => t.id === id) ?? TONES[0];
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const getPurpose = (id: string) => PURPOSES.find((p) => p.id === id) ?? PURPOSES[0];
export const getVariant = (purposeId: string, variantId: string): Variant => {
  const p = getPurpose(purposeId);
  return p.variants.find((v) => v.id === variantId) ?? p.variants[0];
};

export const STATUS_LABEL: Record<string, string> = {
  confirmed: "検証済み",
  candidate: "未検証",
  "pending-approval": "本社確認待ち",
};

/** 用途に適したテイストだけを返す（suitablePurposes が空なら全用途で表示） */
export function tonesForPurpose(purposeId: string): Tone[] {
  const hit = TONES.filter(
    (t) => !t.suitablePurposes?.length || t.suitablePurposes.includes(purposeId),
  );
  return hit.length ? hit : TONES;
}

/** バリエーションがテイストの演出を丸ごと置き換えるか（EC無地背景・透過） */
export function isSceneless(v: Variant): boolean {
  const o = (v as { overrides?: Record<string, string> }).overrides;
  return !!o && "ground" in o;
}

type Overrides = Record<string, string> | undefined;

export type ComposeInput = {
  productId: string;
  appearanceOverride?: string;
  purposeId: string;
  variantId: string;
  toneId: string;
  extraIds: string[];
  freeText: string;
  hasReference: boolean;
};

export type ComposeResult = {
  prompt: string;
  size: string;
  transparent: boolean;
  toneLabel: string;
  variantNote: string;
  blocks: { key: string; label: string; source: string; text: string }[];
  notices: string[];
};

const BLOCKS: { key: string; label: string; source: string }[] = [
  { key: "reset", label: "① 参照画像の扱い", source: "テイスト" },
  { key: "brandCore", label: "② ブランドの世界観", source: "共通ルール" },
  { key: "mediumAngle", label: "③ 媒体・アングル", source: "テイスト" },
  { key: "ground", label: "④ 地・背景", source: "テイスト／用途" },
  { key: "props", label: "⑤ 小道具", source: "テイスト／用途" },
  { key: "wordmark", label: "⑥ 巾着のワードマーク", source: "テイスト" },
  { key: "productPlacement", label: "⑦ 商品の配置・外観", source: "テイスト × 商品マスタ" },
  { key: "extras", label: "⑧ 追加要素", source: "チップ＋自由入力" },
  { key: "composition", label: "⑨ 構図・余白", source: "用途マスタ" },
  { key: "light", label: "⑩ 光・影", source: "テイスト／用途" },
  { key: "texture", label: "⑪ 質感", source: "テイスト／用途" },
  { key: "fidelity", label: "⑫ 商品再現の固定", source: "共通ルール" },
  { key: "negatives", label: "⑬ 禁止事項", source: "共通ルール ＋ 商品別" },
  { key: "format", label: "⑭ 書き出し", source: "用途マスタ" },
];

/** 手打ちテキストのNGワード検知（生成はブロックしない） */
export function checkNgWords(text: string): { word: string; reason: string }[] {
  if (!text) return [];
  const hits: { word: string; reason: string }[] = [];
  const seen = new Set<string>();
  for (const ng of RULES.ngWords) {
    if (text.includes(ng.word) && !seen.has(ng.reason)) {
      seen.add(ng.reason);
      hits.push(ng);
    }
  }
  return hits;
}

export function compose(input: ComposeInput): ComposeResult {
  const tone = getTone(input.toneId);
  const product = getProduct(input.productId);
  const variant = getVariant(input.purposeId, input.variantId);
  const ov: Overrides = (variant as { overrides?: Record<string, string> }).overrides;
  const sceneless = isSceneless(variant);
  const notices: string[] = [];

  // 商品の外観英文
  let appearance = (product.appearance || "").trim();
  if (!appearance) {
    appearance = (input.appearanceOverride || "").trim();
    if (!appearance) {
      appearance = "the product shown in the attached reference image";
      notices.push(
        "この商品は外観が未登録です。参照画像を添付するか、外観（例: a white tube with a blue cap）を入力すると再現性が上がります。",
      );
    }
  }
  if (!input.hasReference && !product.appearance && !input.appearanceOverride) {
    notices.push("参照画像も外観の記述もないため、商品の見た目は生成AIの想像になります。");
  }
  if (product.reproductionRisk === "high" && !input.hasReference) {
    notices.push(
      "この商品はパッケージのイラストや細密な絵柄が主役のため、そのままでは崩れやすい商品です。参照画像を添付してください。崩れる場合は「PR-04 背景プレート」で背景だけ作り、商品を切り抜いて合成するのが確実です。",
    );
  }
  if (sceneless) {
    notices.push(
      "この出力は商品単体のため、テイストの演出（巾着・小道具・光の作り込み）は付きません。用途側の指定が優先されます。",
    );
  }

  // ⑧ 追加要素：チップ（英文）＋ 自由入力（日本語可）
  const chipTexts = input.extraIds
    .map((id) => EXTRAS.find((e) => e.id === id)?.text)
    .filter((t): t is string => !!t);
  const free = (input.freeText || "").trim();
  const extrasText = [
    ...(sceneless ? [] : chipTexts),
    free ? `Additional direction from the art director: ${free}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const noProduct = !tone.blocks.productPlacement.trim() && !ov?.productPlacement;
  const negatives = [RULES.negatives, ...(product.extraNegatives || [])].join(" ");
  const fidelity = input.hasReference ? RULES.fidelity : RULES.fidelityNoRef;

  function textFor(key: string): string {
    if (ov && key in ov) return ov[key];
    switch (key) {
      case "reset":
        return input.hasReference ? tone.blocks.reset : "";
      case "brandCore":
        return RULES.brandCore;
      case "extras":
        return extrasText;
      case "composition":
        return variant.composition;
      case "format":
        return variant.format;
      case "fidelity":
        return noProduct ? "" : fidelity;
      case "negatives":
        return negatives;
      default:
        return (tone.blocks as Record<string, string>)[key] ?? "";
    }
  }

  const blocks = BLOCKS.map((b) => {
    let text = textFor(b.key);
    if (b.key === "productPlacement") {
      text = noProduct ? "" : text.replace(/\{\{PRODUCT\}\}/g, appearance);
    }
    return { ...b, text: (text || "").trim() };
  }).filter((b) => b.text);

  return {
    prompt: blocks.map((b) => b.text).join("\n\n"),
    size: variant.size,
    transparent: !!(variant as { transparent?: boolean }).transparent,
    toneLabel: sceneless ? `${getPurpose(input.purposeId).label}／${variant.label}` : tone.label,
    variantNote: (variant as { note?: string }).note ?? "",
    blocks,
    notices,
  };
}

/** PR-03 方式：完成カットの1要素だけ差し替える編集プロンプト */
export function composeEdit(params: {
  removeTarget: string;
  newProductId: string;
  appearanceOverride?: string;
  freeText?: string;
}): string {
  const product = getProduct(params.newProductId);
  const appearance =
    (product.appearance || "").trim() ||
    (params.appearanceOverride || "").trim() ||
    "the product shown in the second attached image";
  const negatives = [RULES.negatives, ...(product.extraNegatives || [])].join(" ");
  const free = (params.freeText || "").trim();

  return [
    "In the FIRST attached image, make one single change and leave everything else completely untouched.",
    `Remove ${params.removeTarget.trim()}. In its place, put ${appearance}. Do not include any carton box — the product only.`,
    "The new item sits roughly where the removed element was, at a relaxed diagonal that leans slightly differently from the existing subject so the two do not look parallel. Its printed face is turned fully toward the camera so its lettering reads clearly. Its cap stays screwed on.",
    "Match the new item perfectly to the existing photograph: the same soft directional daylight arriving from the same side, the same gentle low-contrast quality, a soft contact shadow falling in the same direction as the shadows already in the picture, the same slight softness of focus, the same film grain and the same subtle warmth. It must look as though it was on the table when the original photograph was taken, not pasted in afterwards.",
    "Everything else in the image must remain exactly as it is, pixel for pixel: every other object with all of its printing unchanged, any printed wordmark with its exact spelling, letterforms, size, position and colour, the surface and its texture, the framing, the crop, the camera angle, the colour grade and the overall exposure.",
    free ? `Additional direction from the art director: ${free}` : "",
    "Reproduce the new product exactly as it appears in the second attached image: the same colours and the same lettering in the same sizes, rotations and positions. Do not re-letter, re-typeset, translate, re-colour or restyle any part of it, and do not invent extra wording or symbols.",
    negatives,
    "Deliver the same full-bleed photograph with sharp square corners.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

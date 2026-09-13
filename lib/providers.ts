// 画像生成エンジンの切替（環境変数）
//   IMAGE_PROVIDER = openai | gemini   （未設定時: OpenAIキーがあれば openai、なければ gemini、どちらも無ければ demo）
// プロンプト生成はテンプレート方式（ブラウザ内で組み立て）のため、AIプロバイダは不要。
import type { ImageSize } from "@/lib/options";

export type ImageProvider = "openai" | "gemini" | "demo";

export function imageProvider(): ImageProvider {
  const pref = process.env.IMAGE_PROVIDER;
  // APIキーを設定したままプレビューしたいとき用。画像はプレースホルダになる。
  if (pref === "demo") return "demo";
  if (pref === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (pref === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "demo";
}

export const OPENAI_IMAGE_MODEL = () => process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
export const GEMINI_IMAGE_MODEL = () => process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

/** OpenAI のサイズ表記 → Gemini のアスペクト比 */
export function sizeToAspect(size: ImageSize): string {
  switch (size) {
    case "1024x1536":
      return "2:3";
    case "1536x1024":
      return "3:2";
    default:
      return "1:1";
  }
}

export function parseDataUrl(dataUrl: string): { mime: string; data: string } | null {
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(dataUrl);
  return m ? { mime: m[1], data: m[2] } : null;
}

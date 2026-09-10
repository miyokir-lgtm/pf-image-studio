// エンジン切替（環境変数）
//   PROMPT_PROVIDER = gemini | anthropic   （未設定時: キーがある方を自動選択。両方あれば gemini）
//   IMAGE_PROVIDER  = gemini | openai      （同上）
import type { ImageSize } from "@/lib/options";

export type PromptProvider = "gemini" | "anthropic" | "demo";
export type ImageProvider = "gemini" | "openai" | "demo";

export function promptProvider(): PromptProvider {
  const pref = process.env.PROMPT_PROVIDER;
  if (pref === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (pref === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "demo";
}

export function imageProvider(): ImageProvider {
  const pref = process.env.IMAGE_PROVIDER;
  if (pref === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (pref === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "demo";
}

export const GEMINI_TEXT_MODEL = () => process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
export const GEMINI_IMAGE_MODEL = () => process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

// gpt-image-1 のサイズ → Gemini のアスペクト比
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

import { NextResponse } from "next/server";
import { imageProvider, promptProvider, GEMINI_IMAGE_MODEL, GEMINI_TEXT_MODEL } from "@/lib/providers";

// 画面に「今どのエンジンで動いているか」を返す
export async function GET() {
  const ip = imageProvider();
  const pp = promptProvider();
  return NextResponse.json({
    promptProvider: pp,
    imageProvider: ip,
    promptModel: pp === "gemini" ? GEMINI_TEXT_MODEL() : pp === "anthropic" ? process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5" : "demo",
    imageModel: ip === "gemini" ? GEMINI_IMAGE_MODEL() : ip === "openai" ? process.env.OPENAI_IMAGE_MODEL || "gpt-image-1" : "demo",
    // Gemini は品質パラメータなし（1K固定）。OpenAI は low/medium/high
    supportsQuality: ip === "openai",
    // 無料枠運用の目安表示用
    freeTier: ip === "gemini" && process.env.GEMINI_PAID_TIER !== "1",
  });
}

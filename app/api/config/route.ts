import { NextResponse } from "next/server";
import { imageProvider, OPENAI_IMAGE_MODEL, GEMINI_IMAGE_MODEL } from "@/lib/providers";

// 画面に「今どのエンジンで動いているか」を返す
export async function GET() {
  const ip = imageProvider();
  return NextResponse.json({
    imageProvider: ip,
    imageModel:
      ip === "openai" ? OPENAI_IMAGE_MODEL() : ip === "gemini" ? GEMINI_IMAGE_MODEL() : "demo",
    // OpenAI のみ品質（低/中/高）を選べる
    supportsQuality: ip === "openai",
    maxImages: Number(process.env.MAX_IMAGES_PER_REQUEST || 3),
  });
}

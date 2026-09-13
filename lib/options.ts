// 画質・サイズの型（商品・用途・テイストは content/*.json と lib/compose.ts に移管）

export type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
export type Quality = "low" | "medium" | "high";

export const QUALITIES: { id: Quality; label: string; yen: number }[] = [
  { id: "low", label: "低（ラフ確認用）", yen: 1 },
  { id: "medium", label: "中（標準）", yen: 2.5 },
  { id: "high", label: "高（確定カット用）", yen: 10 },
];

export const isImageSize = (s: string): s is ImageSize =>
  s === "1024x1024" || s === "1024x1536" || s === "1536x1024";

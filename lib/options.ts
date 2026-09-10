// 画面とAPIで共有する選択肢定義

export type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
export type Quality = "low" | "medium" | "high";

export const PURPOSES: {
  id: string;
  label: string;
  size: ImageSize;
  note: string; // Claudeへ渡す用途指針
}[] = [
  {
    id: "ig_post",
    label: "Instagram 投稿（正方形 1:1）",
    size: "1024x1024",
    note: "Instagram feed post, 1:1 square, full-bleed, sharp square corners, off-center composition with quiet negative space in the upper right.",
  },
  {
    id: "ig_story",
    label: "Instagram ストーリー／リール（縦長 9:16）",
    size: "1024x1536",
    note: "Instagram story / reel, vertical portrait. Keep the top ~15% and bottom ~20% free of key subject so UI overlays and later-added text do not collide; subject sits in the middle band.",
  },
  {
    id: "ec_product",
    label: "EC 商品ページ（正方形・余白多め）",
    size: "1024x1024",
    note: "E-commerce product page image, 1:1 square. Product must be clearly legible and centered-ish with generous clean negative space; calmer, fewer props, packaging printing must be readable and faithful.",
  },
  {
    id: "banner",
    label: "バナー／LP メインビジュアル（横長 3:2）",
    size: "1536x1024",
    note: "Landscape hero / banner. Subject on one side (left or right third), the opposite side is clean negative space reserved for headline text added later.",
  },
];

export const TASTES: { id: string; label: string; hint: string }[] = [
  {
    id: "pr01",
    label: "PR-01 標準形：コットン巾着＋白大理石（チューブ系の確定テイスト）",
    hint: "Use PR-01 (cream cotton drawstring pouch on white marble, tilted overhead, phone-snapshot texture) as the base and adapt it to the requested product and purpose.",
  },
  {
    id: "pr02",
    label: "PR-02 クラフト紙＋潰れたチューブ（情報密度型）",
    hint: "Use PR-02 (kraft paper, squeezed tube, dense printed matter as unreadable texture) as the base.",
  },
  {
    id: "toneB",
    label: "トーンB：ボトル／ポンプ容器向け（立ち姿・自然光）",
    hint: "Use Tone B (standing bottle, natural window light, linen/marble ground) — for bottles and pump containers where an overhead flat-lay does not work.",
  },
  {
    id: "toneA",
    label: "トーンA：ミニマル・クリーン（紺／白の静かな面）",
    hint: "Use Tone A (minimal clean surface, brand navy or white ground, restrained, no props).",
  },
  {
    id: "toneC",
    label: "トーンC：情緒・季節感（植物・布など）",
    hint: "Use Tone C (emotional / seasonal styling with plants, fabric or paper props) while keeping all brand prohibitions.",
  },
  {
    id: "auto",
    label: "お任せ（商品と用途からClaudeが選ぶ）",
    hint: "Choose the most suitable confirmed tone yourself based on the product container type and purpose, and state which one you chose.",
  },
];

export const PRODUCTS: string[] = [
  "ビバンクエントマンカ ローション（VQM）30ml",
  "セメンザル ライト 100ml",
  "グリーンボクシン 150ml",
  "グリーンボクシン ストロング 65ml",
  "マホロサ（Mahorosa）クリームミスト 100ml",
  "ファイナルバーム（Final Balm）",
  "ハリ艶セット（VQMローション30ml＋セメンザルライト100ml）",
  "スーパージェクション クリーム",
  "セメンザル ライトフィルム",
  "ルティナー（Rutina）",
  "ミンタビ（MINTAVI）",
  "ブルーブラッド",
  "ニギミボンム",
  "ゲルスターター",
  "セメンスティック",
  "フィニッシュローション",
  "ユニストーン",
  "カルメンシート",
  "ゾロピックス",
  "シーパウダー",
];

export const QUALITIES: { id: Quality; label: string; cost: string }[] = [
  { id: "low", label: "低（ラフ確認用）", cost: "約¥2/枚" },
  { id: "medium", label: "中（標準・推奨）", cost: "約¥6/枚" },
  { id: "high", label: "高（確定カット用）", cost: "約¥25/枚" },
];

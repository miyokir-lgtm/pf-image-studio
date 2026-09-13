import { NextResponse } from "next/server";
import { list, put, del } from "@vercel/blob";
import productsData from "@/content/products.json";
import assetsData from "@/content/assets.json";

export const runtime = "nodejs";
export const maxDuration = 60;

const PREFIX = "assets/";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export type Asset = {
  id: string;
  name: string;
  url: string;
  category: string;
  productId?: string;
  toneId?: string;
  source: "bundled" | "uploaded";
};

function bundled(): Asset[] {
  const out: Asset[] = [];
  for (const p of productsData.products) {
    (p.images ?? []).forEach((src, i) => {
      out.push({
        id: `p:${p.id}:${i}`,
        name: p.label,
        url: src,
        category: "product",
        productId: p.id,
        source: "bundled",
      });
    });
  }
  for (const a of assetsData.assets as {
    id: string;
    name: string;
    path: string;
    category?: string;
    toneId?: string;
  }[]) {
    out.push({
      id: `s:${a.id}`,
      name: a.name,
      url: a.path,
      category: a.category ?? "scene",
      toneId: a.toneId,
      source: "bundled",
    });
  }
  return out;
}

const blobEnabled = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/** アップロード名から表示名とカテゴリを取り出す: assets/<category>/<name>--<ts>.<ext> */
function parsePathname(pathname: string) {
  const rest = pathname.slice(PREFIX.length);
  const [category, file = ""] = rest.split("/");
  const name = decodeURIComponent(file.replace(/--\d+\.[a-z]+$/i, "")) || file;
  return { category: category || "other", name };
}

export async function GET() {
  const items = bundled();
  let uploadedError: string | null = null;
  if (blobEnabled()) {
    try {
      const res = await list({ prefix: PREFIX, limit: 500 });
      for (const b of res.blobs) {
        const { category, name } = parsePathname(b.pathname);
        items.push({
          id: b.pathname,
          name,
          url: b.url,
          category,
          source: "uploaded",
        });
      }
    } catch (e) {
      uploadedError = (e as Error).message;
    }
  }
  return NextResponse.json({ items, canUpload: blobEnabled(), uploadedError });
}

export async function POST(req: Request) {
  if (!blobEnabled()) {
    return NextResponse.json(
      {
        error:
          "素材の保存先が未設定です。Vercel の Storage で Blob ストアを作成してこのプロジェクトに接続してください（Hobbyプランは無料枠内で課金なし）。",
      },
      { status: 501 },
    );
  }
  const { name, category, dataUrl } = (await req.json()) as {
    name?: string;
    category?: string;
    dataUrl?: string;
  };
  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl || "");
  if (!m) return NextResponse.json({ error: "画像はJPEG・PNG・WebPのみです" }, { status: 400 });
  if (!ALLOWED.includes(m[1]))
    return NextResponse.json({ error: "対応していない画像形式です" }, { status: 400 });

  const buf = Buffer.from(m[2], "base64");
  if (buf.byteLength > MAX_BYTES)
    return NextResponse.json({ error: "画像が大きすぎます（8MBまで）" }, { status: 400 });

  const ext = m[1].split("/")[1];
  const cat = (category || "scene").replace(/[^a-z]/gi, "") || "scene";
  const safe = encodeURIComponent((name || "素材").slice(0, 60).replace(/[/\\]/g, "_"));
  try {
    const blob = await put(`${PREFIX}${cat}/${safe}--${Date.now()}.${ext}`, buf, {
      access: "public",
      contentType: m[1],
      addRandomSuffix: false,
    });
    return NextResponse.json({ id: blob.pathname, url: blob.url, name: name || "素材", category: cat });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!blobEnabled()) return NextResponse.json({ error: "保存先が未設定です" }, { status: 501 });
  const { id } = (await req.json()) as { id?: string };
  if (!id || !id.startsWith(PREFIX))
    return NextResponse.json({ error: "同梱素材は画面から削除できません" }, { status: 400 });
  try {
    const res = await list({ prefix: id, limit: 1 });
    const target = res.blobs.find((b) => b.pathname === id);
    if (!target) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
    await del(target.url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

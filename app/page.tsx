"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, PURPOSES, QUALITIES, TASTES, type Quality } from "@/lib/options";

type HistoryItem = {
  id: string;
  at: number;
  product: string;
  purposeId: string;
  prompt: string;
  thumbs: string[];
};

const HISTORY_KEY = "pf-image-studio:history:v1";

// 画像を最大辺 maxPx に縮小して dataURL 化（送信サイズ削減）
async function shrinkImage(file: File | Blob, maxPx: number, mime = "image/jpeg", q = 0.86): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxPx / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  return c.toDataURL(mime, q);
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob();
}

export default function Studio() {
  const router = useRouter();

  // 入力
  const [productSel, setProductSel] = useState(PRODUCTS[0]);
  const [productFree, setProductFree] = useState("");
  const [purposeId, setPurposeId] = useState(PURPOSES[0].id);
  const [tasteId, setTasteId] = useState(TASTES[0].id);
  const [idea, setIdea] = useState("");
  const [refs, setRefs] = useState<string[]>([]);
  const [quality, setQuality] = useState<Quality>("medium");
  const [n, setN] = useState(3);
  const [useRefsForGen, setUseRefsForGen] = useState(true);

  // 出力
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [notes, setNotes] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [busyP, setBusyP] = useState(false);
  const [busyG, setBusyG] = useState(false);
  const [err, setErr] = useState("");
  const [demo, setDemo] = useState(false);

  // 編集モード
  const [editBase, setEditBase] = useState<string | null>(null);
  const [editInstr, setEditInstr] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cfg, setCfg] = useState<{ imageProvider: string; promptProvider: string; imageModel: string; promptModel: string; supportsQuality: boolean; freeTier: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
    fetch("/api/config").then((r) => r.json()).then(setCfg).catch(() => {});
  }, []);

  const product = productSel === "__other__" ? productFree : productSel;
  const purpose = PURPOSES.find((p) => p.id === purposeId)!;
  const qInfo = QUALITIES.find((q) => q.id === quality)!;

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const out: string[] = [];
    for (const f of list.slice(0, 4 - refs.length)) out.push(await shrinkImage(f, 1024));
    setRefs((r) => [...r, ...out].slice(0, 4));
  }

  async function makePrompt() {
    setErr("");
    setBusyP(true);
    setImages([]);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          purposeId,
          tasteId,
          idea: editBase ? `【編集指示】${editInstr}\n${idea}` : idea,
          referenceImages: editBase ? [editBase, ...refs].slice(0, 4) : refs,
          mode: editBase ? "edit" : "generate",
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "プロンプト生成に失敗しました");
      setPrompt(j.prompt);
      setTone(j.tone || "");
      setNotes(j.notes_ja || "");
      setWarnings(j.warnings || []);
      setDemo(!!j.demo);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyP(false);
    }
  }

  async function generate() {
    setErr("");
    setBusyG(true);
    try {
      const referenceImages = editBase ? [editBase] : useRefsForGen ? refs : [];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size: purpose.size, quality, n: editBase ? 1 : n, referenceImages }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "画像生成に失敗しました");
      setImages(j.images);
      setDemo((d) => d || !!j.demo);
      // 履歴保存（サムネイルのみ・ブラウザ内）
      const thumbs = await Promise.all(
        j.images.map((u: string) =>
          dataUrlToBlob(u)
            .then((b) => shrinkImage(b, 256, "image/jpeg", 0.7))
            .catch(() => u), // デモSVG等でデコードできない場合は原寸を保持
        ),
      );
      const item: HistoryItem = { id: crypto.randomUUID(), at: Date.now(), product, purposeId, prompt, thumbs };
      const next = [item, ...history].slice(0, 30);
      setHistory(next);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyG(false);
    }
  }

  function startEdit(img: string) {
    setEditBase(img);
    setEditInstr("");
    setPrompt("");
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restore(h: HistoryItem) {
    setPrompt(h.prompt);
    setPurposeId(h.purposeId);
    if (PRODUCTS.includes(h.product)) setProductSel(h.product);
    else {
      setProductSel("__other__");
      setProductFree(h.product);
    }
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/login");
  }

  const count = editBase ? 1 : n;
  const isGemini = !cfg || cfg.imageProvider !== "openai";
  const estYen = isGemini ? (cfg?.freeTier || cfg?.imageProvider === "demo" ? 0 : 6 * count) : (quality === "low" ? 2 : quality === "medium" ? 6 : 25) * count;
  const engineLabel = cfg
    ? `${cfg.promptProvider === "gemini" ? "Gemini" : cfg.promptProvider === "anthropic" ? "Claude" : "DEMO"} → ${cfg.imageProvider === "gemini" ? "Gemini Image" : cfg.imageProvider === "openai" ? "gpt-image-1" : "DEMO"}${cfg.freeTier ? "（無料枠）" : ""}`
    : "";

  return (
    <>
      <div className="topbar">
        <div>
          <span className="brand">Pharmesthetic</span>
          <span className="sub">IMAGE STUDIO — ブランドGL準拠 画像生成</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {engineLabel && <span className="engine">{engineLabel}</span>}
          <button onClick={logout}>ログアウト</button>
        </div>
      </div>

      <div className="wrap">
        {/* ===== 左: 入力 ===== */}
        <div>
          <div className="card">
            <h2>
              <span className="step">1</span>
              {editBase ? "編集内容を入力" : "作りたい画像を入力"}
            </h2>

            {editBase && (
              <div style={{ marginBottom: 12 }}>
                <div className="tag">編集モード（PR-03方式：1要素だけ差し替え）</div>
                <div className="refs">
                  <div className="thumb">
                    <img src={editBase} alt="編集元" />
                    <button onClick={() => setEditBase(null)} title="編集をやめる">×</button>
                  </div>
                </div>
                <label className="f">差し替える1要素（例: 巾着の上のチューブをセメンザル ライトに差し替え、他は全て維持）</label>
                <textarea value={editInstr} onChange={(e) => setEditInstr(e.target.value)} />
              </div>
            )}

            <label className="f">商品</label>
            <select value={productSel} onChange={(e) => setProductSel(e.target.value)}>
              {PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="__other__">その他（自由入力）</option>
            </select>
            {productSel === "__other__" && (
              <input type="text" placeholder="商品名・容器の特徴（例: 白チューブ＋青キャップ 100ml）" value={productFree} onChange={(e) => setProductFree(e.target.value)} style={{ marginTop: 6 }} />
            )}

            <label className="f">用途・サイズ</label>
            <select value={purposeId} onChange={(e) => setPurposeId(e.target.value)}>
              {PURPOSES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            {!editBase && (
              <>
                <label className="f">テイスト</label>
                <select value={tasteId} onChange={(e) => setTasteId(e.target.value)}>
                  {TASTES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </>
            )}

            <label className="f">作りたいイメージ（日本語でOK）</label>
            <textarea
              placeholder="例: 秋の新作告知用。巾着の横にドライフラワーを1本添えて、少し温かみのある光で。"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <label className="f">参照画像（商品写真・参考カット、最大4枚）</label>
            <div
              className="drop"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              クリックまたはドラッグ＆ドロップ（自動で1024pxに縮小）
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
            {refs.length > 0 && (
              <div className="refs">
                {refs.map((r, i) => (
                  <div className="thumb" key={i}>
                    <img src={r} alt="" />
                    <button onClick={() => setRefs(refs.filter((_, j) => j !== i))}>×</button>
                  </div>
                ))}
              </div>
            )}
            {refs.length > 0 && !editBase && (
              <label className="hint" style={{ display: "block", marginTop: 6 }}>
                <input type="checkbox" checked={useRefsForGen} onChange={(e) => setUseRefsForGen(e.target.checked)} />{" "}
                画像生成時にも参照画像を渡す（商品の外観再現に有効。ただし背景・角度を引き継ぎやすい）
              </label>
            )}

            <button className="btn" onClick={makePrompt} disabled={busyP || !product || (!!editBase && !editInstr)}>
              {busyP ? <><span className="spinner" /> {cfg?.promptProvider === "anthropic" ? "Claude" : "Gemini"} がプロンプト作成中…</> : `プロンプトを生成（${cfg?.promptProvider === "anthropic" ? "Claude" : "Gemini"}）`}
            </button>
          </div>

          {history.length > 0 && (
            <div className="card history" style={{ marginTop: 16 }}>
              <h2>履歴（このブラウザのみ・最新30件）</h2>
              {history.map((h) => (
                <div className="item" key={h.id}>
                  <img src={h.thumbs[0]} alt="" />
                  <div>
                    <div>{h.product}</div>
                    <div className="p">{new Date(h.at).toLocaleString("ja-JP")} — {h.prompt}</div>
                  </div>
                  <button className="btn secondary small" onClick={() => restore(h)}>再利用</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== 右: プロンプト → 生成 ===== */}
        <div>
          <div className="card">
            <h2><span className="step">2</span> プロンプト確認・調整</h2>
            {tone && <div style={{ marginBottom: 8 }}><span className="tag">{tone}</span>{demo && <span className="tag">DEMO</span>}</div>}
            <textarea
              className="prompt-box"
              placeholder="左の入力から「プロンプトを生成」を押すと、ブランドGLに沿った英語プロンプトがここに入ります。手直ししてから生成できます。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {notes && <div className="notes">{notes}</div>}
            {warnings.length > 0 && (
              <div className="warn">
                <strong>規定により調整した点</strong>
                <ul>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
            )}

            <div className="row" style={{ marginTop: 14 }}>
              <div>
                <label className="f">品質</label>
                {cfg?.supportsQuality ? (
                  <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>
                    {QUALITIES.map((q) => (
                      <option key={q.id} value={q.id}>{q.label}（{q.cost}）</option>
                    ))}
                  </select>
                ) : (
                  <select disabled value="std"><option value="std">標準（1K・固定）</option></select>
                )}
              </div>
              <div>
                <label className="f">枚数</label>
                <select value={editBase ? 1 : n} onChange={(e) => setN(Number(e.target.value))} disabled={!!editBase}>
                  {[1, 2, 3].map((v) => <option key={v} value={v}>{v}枚</option>)}
                </select>
              </div>
            </div>
            <div className="cost">出力 {purpose.size} ／ 概算 {estYen === 0 ? "¥0（無料枠）" : `約¥${estYen}`}{cfg?.supportsQuality ? `（${qInfo.label}）` : ""}</div>

            <button className="btn gold" onClick={generate} disabled={busyG || !prompt}>
              {busyG ? <><span className="spinner" /> 生成中（30〜90秒）…</> : editBase ? "この内容で編集する" : `画像を生成する（${n}枚）`}
            </button>
            {err && <div className="error">{err}</div>}
          </div>

          {images.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2><span className="step">3</span> 生成結果 — 気に入った1枚を選ぶ</h2>
              <div className="grid">
                {images.map((img, i) => (
                  <div className="shot" key={i}>
                    <img src={img} alt={`result ${i + 1}`} />
                    <div className="bar">
                      <a href={img} download={`pharmesthetic_${Date.now()}_${i + 1}.webp`}>ダウンロード</a>
                      <button onClick={() => startEdit(img)}>この画像を編集（1要素差し替え）</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="status">※ ロゴマークは規定により生成していません。確定カットには後入れしてください。</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

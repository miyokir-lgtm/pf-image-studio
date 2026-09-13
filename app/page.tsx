"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUALITIES, type ImageSize, type Quality } from "@/lib/options";
import {
  EXTRAS,
  PRODUCTS,
  PURPOSES,
  STATUS_LABEL,
  checkNgWords,
  compose,
  composeEdit,
  getProduct,
  getPurpose,
  getTone,
  getVariant,
  isSceneless,
  tonesForPurpose,
} from "@/lib/compose";

type HistoryItem = {
  id: string;
  at: number;
  product: string;
  prompt: string;
  thumbs: string[];
};

const HISTORY_KEY = "pf-image-studio:history:v3";

async function shrinkImage(file: File | Blob, maxPx: number, mime = "image/jpeg", q = 0.86) {
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

const dataUrlToBlob = async (u: string) => (await fetch(u)).blob();

type Asset = {
  id: string;
  name: string;
  url: string;
  category: string;
  productId?: string;
  toneId?: string;
  source: "bundled" | "uploaded";
};

/** URL の画像を読み込んで dataURL にする（生成APIへは dataURL で渡す） */
async function urlToDataUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("画像を読み込めませんでした");
  return shrinkImage(await res.blob(), 1024);
}

export default function Studio() {
  const router = useRouter();

  // ===== 入力 =====
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [appearanceOverride, setAppearanceOverride] = useState("");
  const [purposeId, setPurposeId] = useState(PURPOSES[0].id);
  const [variantId, setVariantId] = useState(PURPOSES[0].variants[0].id);
  const [toneId, setToneId] = useState(PRODUCTS[0].recommendedTone);
  const [toneTouched, setToneTouched] = useState(false);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [refs, setRefs] = useState<string[]>([]);
  const [useRefsForGen, setUseRefsForGen] = useState(true);

  // ===== 素材ライブラリ =====
  const [useProductImage, setUseProductImage] = useState(true);
  const [productImg, setProductImg] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [canUpload, setCanUpload] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  const [libBusy, setLibBusy] = useState("");
  const assetFileRef = useRef<HTMLInputElement>(null);

  // ===== 出力 =====
  const [prompt, setPrompt] = useState("");
  const [promptEdited, setPromptEdited] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [quality, setQuality] = useState<Quality>("low");
  const [n, setN] = useState(3);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  // ===== 編集モード（PR-03） =====
  const [editBase, setEditBase] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cfg, setCfg] = useState<{
    imageProvider: string;
    imageModel: string;
    supportsQuality: boolean;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
    fetch("/api/config")
      .then((r) => r.json())
      .then(setCfg)
      .catch(() => {});
    fetch("/api/assets")
      .then((r) => r.json())
      .then((j) => {
        setAssets(j.items ?? []);
        setCanUpload(!!j.canUpload);
      })
      .catch(() => {});
  }, []);

  const product = getProduct(productId);
  const purpose = getPurpose(purposeId);
  const variant = getVariant(purposeId, variantId);
  const sceneless = isSceneless(variant);
  const tone = getTone(toneId);
  const needsAppearance = !product.appearance;
  const availableTones = useMemo(() => tonesForPurpose(purposeId), [purposeId]);

  // 用途を変えたらバリエーションを先頭に戻す
  useEffect(() => {
    if (!purpose.variants.some((v) => v.id === variantId)) setVariantId(purpose.variants[0].id);
  }, [purpose, variantId]);

  // 商品の同梱画像を自動で参照画像にする
  useEffect(() => {
    let alive = true;
    const src = useProductImage ? product.images?.[0] : undefined;
    if (!src) {
      setProductImg(null);
      return;
    }
    urlToDataUrl(src)
      .then((d) => {
        if (alive) {
          setProductImg(d);
          setPromptEdited(false);
        }
      })
      .catch(() => alive && setProductImg(null));
    return () => {
      alive = false;
    };
  }, [productId, useProductImage, product.images]);

  // 商品を変えたらテイストを推奨値に自動追従（手動変更後は追従しない）
  useEffect(() => {
    if (!toneTouched) setToneId(product.recommendedTone);
  }, [productId, product.recommendedTone, toneTouched]);

  // 用途を変えて現在のテイストが選べなくなったら先頭に戻す
  useEffect(() => {
    if (!availableTones.some((t) => t.id === toneId)) setToneId(availableTones[0].id);
  }, [availableTones, toneId]);

  const allRefs = useMemo(
    () => [productImg, ...refs].filter((x): x is string => !!x).slice(0, 4),
    [productImg, refs],
  );

  // ===== プロンプトは入力から即時に組み立て（API不使用） =====
  const composed = useMemo(
    () =>
      compose({
        productId,
        appearanceOverride,
        purposeId,
        variantId,
        toneId,
        extraIds,
        freeText,
        hasReference: allRefs.length > 0,
      }),
    [productId, appearanceOverride, purposeId, variantId, toneId, extraIds, freeText, allRefs.length],
  );

  const editPrompt = useMemo(
    () =>
      editBase
        ? composeEdit({
            removeTarget: removeTarget || "the product currently lying in the centre of the frame",
            newProductId: productId,
            appearanceOverride,
            freeText,
          })
        : "",
    [editBase, removeTarget, productId, appearanceOverride, freeText],
  );

  useEffect(() => {
    if (!promptEdited) setPrompt(editBase ? editPrompt : composed.prompt);
  }, [composed.prompt, editPrompt, editBase, promptEdited]);

  const ngHits = useMemo(() => checkNgWords(freeText), [freeText]);
  const size = composed.size as ImageSize;
  const count = editBase ? 1 : n;
  const yen = (QUALITIES.find((q) => q.id === quality)?.yen ?? 2.5) * count;
  const engineLabel = cfg
    ? `テンプレート → ${cfg.imageProvider === "openai" ? cfg.imageModel : cfg.imageProvider === "gemini" ? "Gemini Image" : "DEMO"}`
    : "";

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const out: string[] = [];
    for (const f of list.slice(0, 4 - refs.length)) out.push(await shrinkImage(f, 1024));
    setRefs((r) => [...r, ...out].slice(0, 4));
    setPromptEdited(false);
  }

  /** 素材ライブラリから参照画像に追加 */
  async function pickAsset(a: Asset) {
    setLibBusy("読み込み中…");
    try {
      const d = await urlToDataUrl(a.url);
      setRefs((r) => [...r, d].slice(0, 4));
      setPromptEdited(false);
      setLibBusy("");
    } catch {
      setLibBusy("この素材は読み込めませんでした");
    }
  }

  /** 素材をライブラリに登録（Vercel Blob） */
  async function uploadAssets(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setLibBusy("アップロード中…");
    try {
      for (const f of list) {
        const dataUrl = await shrinkImage(f, 1600, "image/webp", 0.88);
        const res = await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: f.name.replace(/\.[^.]+$/, ""),
            category: "scene",
            dataUrl,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "アップロードに失敗しました");
        setAssets((a) => [
          ...a,
          { id: j.id, name: j.name, url: j.url, category: j.category, source: "uploaded" },
        ]);
      }
      setLibBusy("登録しました");
      setTimeout(() => setLibBusy(""), 1500);
    } catch (e) {
      setLibBusy((e as Error).message);
    }
  }

  async function removeAsset(a: Asset) {
    if (a.source !== "uploaded") return;
    setLibBusy("削除中…");
    const res = await fetch("/api/assets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id }),
    });
    if (res.ok) {
      setAssets((list) => list.filter((x) => x.id !== a.id));
      setLibBusy("");
    } else {
      setLibBusy((await res.json()).error || "削除できませんでした");
    }
  }

  async function generate() {
    setErr("");
    setBusy(true);
    try {
      const referenceImages = editBase
        ? [editBase, ...allRefs].slice(0, 4)
        : useRefsForGen
          ? allRefs
          : [];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size,
          quality,
          n: count,
          transparent: !editBase && composed.transparent,
          referenceImages,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "画像生成に失敗しました");
      setImages(j.images);
      if (j.failures?.length) setErr(`${j.failures.length}枚が失敗しました: ${j.failures[0]}`);
      const thumbs = await Promise.all(
        j.images.map((u: string) =>
          dataUrlToBlob(u)
            .then((b) => shrinkImage(b, 256, "image/jpeg", 0.7))
            .catch(() => u),
        ),
      );
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        at: Date.now(),
        product: product.label,
        prompt,
        thumbs,
      };
      const next = [item, ...history].slice(0, 30);
      setHistory(next);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(img: string) {
    setEditBase(img);
    setRemoveTarget("");
    setPromptEdited(false);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/login");
  }

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
              {editBase ? "差し替える内容を入力" : "作りたい画像を入力"}
            </h2>

            {editBase && (
              <div className="editbox">
                <div className="tag">編集モード（PR-03方式：1要素だけ差し替え）</div>
                <div className="refs">
                  <div className="thumb">
                    <img src={editBase} alt="編集元" />
                  </div>
                </div>
                <label className="f" htmlFor="removeTarget">
                  取り除く要素（英語で／空欄なら中央の商品）
                </label>
                <input
                  id="removeTarget"
                  type="text"
                  placeholder="the orange tube lying on the pouch"
                  value={removeTarget}
                  onChange={(e) => {
                    setRemoveTarget(e.target.value);
                    setPromptEdited(false);
                  }}
                />
                <button
                  className="btn secondary small"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    setEditBase(null);
                    setPromptEdited(false);
                  }}
                >
                  編集をやめて新規生成に戻る
                </button>
              </div>
            )}

            <label className="f" htmlFor="product">
              商品
            </label>
            <select
              id="product"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setPromptEdited(false);
              }}
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            {needsAppearance && (
              <>
                <input
                  type="text"
                  style={{ marginTop: 6 }}
                  placeholder="外観を英語で（例: a white skincare tube with a blue cap）"
                  value={appearanceOverride}
                  onChange={(e) => {
                    setAppearanceOverride(e.target.value);
                    setPromptEdited(false);
                  }}
                />
                <div className="hint">
                  この商品は外観が未登録です。英語で書くか、参照画像を添付してください。
                </div>
              </>
            )}

            <label className="f" htmlFor="purpose">
              用途
            </label>
            <select
              id="purpose"
              value={purposeId}
              onChange={(e) => {
                setPurposeId(e.target.value);
                setVariantId(getPurpose(e.target.value).variants[0].id);
                setPromptEdited(false);
              }}
            >
              {PURPOSES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <label className="f" htmlFor="variant">
              {purpose.variantLabel}
            </label>
            <select
              id="variant"
              value={variantId}
              onChange={(e) => {
                setVariantId(e.target.value);
                setPromptEdited(false);
              }}
            >
              {purpose.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <div className="hint">
              出力 {composed.size}
              {composed.transparent ? "・背景透過" : ""}
              {composed.variantNote ? ` ／ ${composed.variantNote}` : ""}
            </div>

            {!editBase && !sceneless && (
              <>
                <label className="f" htmlFor="tone">
                  テイスト{!toneTouched && <span className="auto">商品から自動選択</span>}
                </label>
                <select
                  id="tone"
                  value={toneId}
                  onChange={(e) => {
                    setToneId(e.target.value);
                    setToneTouched(true);
                    setPromptEdited(false);
                  }}
                >
                  {availableTones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className={`hint status-${tone.status}`}>
                  <strong>{STATUS_LABEL[tone.status] ?? tone.status}</strong> — {tone.note}
                </div>

                <label className="f">追加要素（押すと英文でプロンプトに入ります）</label>
                <div className="chips">
                  {EXTRAS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className={`chip${extraIds.includes(e.id) ? " on" : ""}`}
                      onClick={() => {
                        setExtraIds((ids) =>
                          ids.includes(e.id) ? ids.filter((x) => x !== e.id) : [...ids, e.id],
                        );
                        setPromptEdited(false);
                      }}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <label className="f" htmlFor="free">
              作りたいイメージ（日本語でOK）
            </label>
            <textarea
              id="free"
              placeholder="例: 秋の新作告知用。全体をもう少し落ち着いた色味で。"
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value);
                setPromptEdited(false);
              }}
            />
            {ngHits.length > 0 && (
              <div className="warn">
                <strong>ブランドGL・薬機法の注意</strong>
                <ul>
                  {ngHits.map((h, i) => (
                    <li key={i}>{h.reason}</li>
                  ))}
                </ul>
                <div className="hint">生成は止めていません。判断のうえ進めてください。</div>
              </div>
            )}

            <label className="f">参考画像（最大4枚）</label>

            {product.images?.length > 0 && (
              <label className="hint auto-img">
                <input
                  type="checkbox"
                  checked={useProductImage}
                  onChange={(e) => setUseProductImage(e.target.checked)}
                />{" "}
                この商品の登録画像を使う
              </label>
            )}

            {allRefs.length > 0 && (
              <div className="refs">
                {productImg && (
                  <div className="thumb locked" title="商品の登録画像">
                    <img src={productImg} alt="商品の登録画像" />
                    <span className="badge">商品</span>
                  </div>
                )}
                {refs.map((r, i) => (
                  <div className="thumb" key={i}>
                    <img src={r} alt="" />
                    <button
                      onClick={() => {
                        setRefs(refs.filter((_, j) => j !== i));
                        setPromptEdited(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="tools" style={{ marginTop: 8 }}>
              <button className="btn secondary small" onClick={() => fileRef.current?.click()}>
                この生成だけに使う画像を足す
              </button>
              <button className="btn secondary small" onClick={() => setLibOpen((v) => !v)}>
                {libOpen ? "素材ライブラリを閉じる" : `素材ライブラリ（${assets.length}）`}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />

            {libOpen && (
              <div className="library">
                <div className="lib-head">
                  <span>クリックで参考画像に追加</span>
                  {libBusy && <span className="lib-busy">{libBusy}</span>}
                </div>
                <div className="lib-grid">
                  {assets.map((a) => (
                    <div className="lib-item" key={a.id}>
                      <button className="lib-pick" onClick={() => pickAsset(a)} title={a.name}>
                        <img src={a.url} alt={a.name} loading="lazy" />
                      </button>
                      <div className="lib-name">{a.name}</div>
                      {a.source === "uploaded" && (
                        <button className="lib-del" onClick={() => removeAsset(a)} title="削除">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {canUpload ? (
                  <>
                    <div
                      className="drop"
                      style={{ marginTop: 10 }}
                      onClick={() => assetFileRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        uploadAssets(e.dataTransfer.files);
                      }}
                    >
                      素材をライブラリに登録（全員で共有されます）
                    </div>
                    <input
                      ref={assetFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => e.target.files && uploadAssets(e.target.files)}
                    />
                  </>
                ) : (
                  <div className="hint" style={{ marginTop: 10 }}>
                    画面からの素材登録は、Vercel の Storage で Blob ストアを作成して接続すると使えるようになります（Hobbyプランは無料枠内で課金されません）。
                  </div>
                )}
              </div>
            )}

            <div
              className="drop"
              style={{ marginTop: 8 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
            >
              ここにドラッグ＆ドロップしても追加できます（自動で1024pxに縮小）
            </div>

            {allRefs.length > 0 && !editBase && (
              <label className="hint" style={{ display: "block", marginTop: 6 }}>
                <input
                  type="checkbox"
                  checked={useRefsForGen}
                  onChange={(e) => setUseRefsForGen(e.target.checked)}
                />{" "}
                生成時にも参考画像を渡す（商品の再現に有効）
              </label>
            )}
          </div>

          {history.length > 0 && (
            <div className="card history" style={{ marginTop: 16 }}>
              <h2>履歴（このブラウザのみ・最新30件）</h2>
              {history.map((h) => (
                <div className="item" key={h.id}>
                  <img src={h.thumbs[0]} alt="" />
                  <div>
                    <div>{h.product}</div>
                    <div className="p">
                      {new Date(h.at).toLocaleString("ja-JP")} — {h.prompt}
                    </div>
                  </div>
                  <button
                    className="btn secondary small"
                    onClick={() => {
                      setPrompt(h.prompt);
                      setPromptEdited(true);
                      setImages([]);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    再利用
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== 右: プロンプト → 生成 ===== */}
        <div>
          <div className="card">
            <h2>
              <span className="step">2</span>プロンプト（自動組み立て・編集可）
            </h2>
            <div style={{ marginBottom: 8 }}>
              <span className="tag">{editBase ? "PR-03 編集" : composed.toneLabel}</span>
              {!editBase && !sceneless && (
                <span className={`tag st st-${tone.status}`}>
                  {STATUS_LABEL[tone.status] ?? tone.status}
                </span>
              )}
              {composed.transparent && <span className="tag">背景透過</span>}
              {promptEdited && <span className="tag alt">手動編集中</span>}
            </div>

            {!editBase && composed.notices.length > 0 && (
              <div className="notes">
                {composed.notices.map((nt, i) => (
                  <div key={i}>{nt}</div>
                ))}
              </div>
            )}

            <textarea
              className="prompt-box"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setPromptEdited(true);
              }}
            />
            <div className="tools">
              <button className="btn secondary small" onClick={copyPrompt}>
                {copied ? "コピーしました" : "プロンプトをコピー"}
              </button>
              {promptEdited && (
                <button className="btn secondary small" onClick={() => setPromptEdited(false)}>
                  入力内容から作り直す
                </button>
              )}
              {!editBase && (
                <button className="btn secondary small" onClick={() => setShowBlocks((v) => !v)}>
                  {showBlocks ? "内訳を隠す" : "内訳を見る"}
                </button>
              )}
            </div>

            {showBlocks && !editBase && (
              <div className="blocks">
                {composed.blocks.map((b) => (
                  <div className="blk" key={b.key}>
                    <div className="blk-l">
                      {b.label}
                      <span className="src">{b.source}</span>
                    </div>
                    <div className="blk-t">{b.text}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="row" style={{ marginTop: 14 }}>
              <div>
                <label className="f" htmlFor="q">
                  品質
                </label>
                {cfg?.supportsQuality ? (
                  <select
                    id="q"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as Quality)}
                  >
                    {QUALITIES.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}（約¥{q.yen}/枚）
                      </option>
                    ))}
                  </select>
                ) : (
                  <select id="q" disabled value="std">
                    <option value="std">標準（固定）</option>
                  </select>
                )}
              </div>
              <div>
                <label className="f" htmlFor="n">
                  枚数
                </label>
                <select
                  id="n"
                  value={count}
                  disabled={!!editBase}
                  onChange={(e) => setN(Number(e.target.value))}
                >
                  {[1, 2, 3].map((v) => (
                    <option key={v} value={v}>
                      {v}枚
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cost">
              出力 {size}
              {composed.transparent ? "・透過" : ""} ／ 概算{" "}
              {cfg?.imageProvider === "demo" ? "¥0（デモ）" : `約¥${yen}`}
            </div>

            <button className="btn gold" onClick={generate} disabled={busy || !prompt}>
              {busy ? (
                <>
                  <span className="spinner" /> 生成中（30〜60秒）…
                </>
              ) : editBase ? (
                "この内容で差し替える"
              ) : (
                `画像を生成する（${count}枚）`
              )}
            </button>
            {err && <div className="error">{err}</div>}
          </div>

          {images.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>
                <span className="step">3</span>生成結果 — 気に入った1枚を選ぶ
              </h2>
              <div className="grid">
                {images.map((img, i) => (
                  <div className={`shot${composed.transparent ? " alpha" : ""}`} key={i}>
                    <img src={img} alt={`result ${i + 1}`} />
                    <div className="bar">
                      <a href={img} download={`pharmesthetic_${Date.now()}_${i + 1}.webp`}>
                        ダウンロード
                      </a>
                      <button onClick={() => startEdit(img)}>この画像を編集（1要素差し替え）</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="status">
                ※ ロゴマークは規定により生成していません。確定カットには後入れしてください。
                {composed.variantNote ? ` ${composed.variantNote}` : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

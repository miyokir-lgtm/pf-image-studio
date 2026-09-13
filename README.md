# Pharmesthetic Image Studio v0.3

ブランドガイドライン（VI・薬機法・確定プロンプト PR-01〜04・4トーン）に準拠した社内用の画像生成ツール。

**方式: テンプレート方式。** Claude が事前に作った確定プロンプトを12ブロックに分解して `content/` に持ち、
画面の入力からブラウザ内で即時に組み立てます。**プロンプト生成にAIを呼ばないので、その分の費用は¥0**。
画像生成だけ OpenAI（gpt-image-2）を使います。

## 仕組み

```
商品 ／ 用途 ／ テイスト ／ 追加要素チップ ／ 自由入力 ／ 参照画像
   ↓  lib/compose.ts（ブラウザ内・0秒・¥0）
12ブロックを固定順に連結 → 英語プロンプト1本
   ↓  画面で確認・手直し（内訳も見られる）
   ↓  /api/generate
OpenAI gpt-image-2 ── 1〜3枚を並列生成（参照画像あり＝画像編集）
   ↓
表示・ダウンロード・「1要素だけ差し替え」再編集（PR-03方式）
```

### 組み立て順（12ブロック）

| # | ブロック | 供給元 |
|---|---|---|
| ① | 参照画像の扱い（新規撮影宣言） | テイスト（参照画像がある時だけ） |
| ② | 媒体・アングル | テイスト |
| ③ | 地・背景 | テイスト |
| ④ | 小道具 | テイスト |
| ⑤ | 巾着のワードマーク | テイスト |
| ⑥ | 商品の配置・外観 | テイスト × **商品マスタ** |
| ⑦ | 追加要素 | **チップ＋自由入力** |
| ⑧ | 構図・余白 | **用途マスタ** |
| ⑨ | 光・影 | テイスト |
| ⑩ | 質感（スマホ写真） | テイスト |
| ⑪ | 商品再現の固定 | 共通ルール |
| ⑫ | 禁止事項 | 共通ルール ＋ 商品別 |
| ⑬ | 書き出しフォーマット | 用途マスタ |

自由入力は**⑦の位置**（禁止事項より前）に入ります。末尾に足すより効きが強くなります。

- 認証: 共通パスワード（環境変数 `APP_PASSWORD`）
- 保存: サーバー側に画像は保存しない。履歴はブラウザ内（localStorage）に最新30件のサムネイルのみ
- ロゴマークは規定により生成しない（後入れ）

---

## マスタの編集（GitHub 上で完結・2分）

ブランドルールの改定・新商品の追加は、**GitHub でファイルを開いて直すだけ**です。

1. https://github.com/miyokir-lgtm/pf-image-studio → `content/` を開く
2. 直したいファイル → 右上の鉛筆アイコン
3. 編集 → 下の **Commit changes**
4. Vercel が自動で再デプロイ（1〜2分）

| ファイル | 中身 | 編集頻度 |
|---|---|---|
| `content/products.json` | 商品名・外観英文・推奨テイスト・商品別禁止句 | **中**（新商品ごと） |
| `content/tones.json` | テイスト骨格（PR-01／PR-02／トーンA〜C） | 低 |
| `content/purposes.json` | 用途・サイズ・構図・書き出し | 低 |
| `content/rules.json` | 共通禁止句・追加要素チップ・NGワード辞書 | 低 |

各ファイルの先頭に `_readme` として日本語の注意書きが入っています。

> **書式を壊しても事故りません。** JSON の書式（カンマ・ダブルクォート）が壊れるとビルドが失敗し、
> 本番は**前の正常なバージョンのまま**残ります。Vercel の Deployments で失敗が見えるので、直して再コミットしてください。

### 新商品を足すとき

`content/products.json` の `products` 配列に1件コピーして貼り、書き換えます。

```json
{
  "id": "new_item",                      // 他と重複しない英数字
  "label": "新商品 50ml",                 // 画面のプルダウンに出る名前
  "container": "tube",                   // tube / bottle / pump / jar / sheet
  "recommendedTone": "pr01",             // 商品を選ぶと自動で選ばれるテイスト
  "appearance": "a white skincare tube with a navy cap",  // ★最重要・英語の名詞句
  "extraNegatives": []                   // その商品だけの禁止事項（英語）
}
```

`appearance` は「文頭を大文字にしない・末尾にピリオドを打たない」名詞句で書きます。
外観は既存の商品写真を見ながら、色・素材・キャップ・印刷の特徴を具体的に書くほど再現性が上がります。

---

## デプロイ（初回のみ）

### 1. OpenAI のセットアップ

| # | 操作 |
|---|---|
| 1 | https://platform.openai.com/ にログイン |
| 2 | Settings › Organization › General → **Verify Organization**（画像モデルの利用に必須） |
| 3 | Settings › Billing → カード登録 → **Add to credit balance: $5**（Auto recharge は OFF） |
| 4 | Settings › Limits → **Monthly budget $10**（暴走防止） |
| 5 | API keys → **Create new secret key** → `sk-…` をコピー |

### 2. Vercel の環境変数

| Key | 値 |
|---|---|
| `APP_PASSWORD` | 社内共通パスワード |
| `OPENAI_API_KEY` | `sk-…` |
| `IMAGE_PROVIDER` | `openai` |
| `OPENAI_IMAGE_MODEL` | `gpt-image-2` |

追加したら **Deployments → 一番上 → ⋯ → Redeploy**（環境変数は再デプロイしないと反映されません）。

画面右上が **「テンプレート → gpt-image-2」** になれば設定完了です。

### 3. コードを更新するとき

```bash
cd ~/Desktop/work-md/Pharmesthetic-ops/image-gen-platform/pf-image-studio
git add . && git commit -m "update" && git push
```

---

## 費用

固定費なし。前払いした残高が使った分だけ減ります（自動課金なし）。

| 項目 | 金額 |
|---|---|
| 初期（OpenAI 前払い） | $5（約¥750） |
| 画像生成 低品質 | 約¥1/枚 |
| 画像生成 中品質 | 約¥2.5/枚 |
| 画像生成 高品質 | 約¥10/枚 |
| プロンプト生成 | **¥0**（テンプレート方式） |
| Vercel / ドメイン / 保存 | ¥0 |

**推奨運用**: 下書きは「低」で3枚 → 気に入った1枚だけ「中」か「高」で再生成。
この運用なら月50回で **約¥275〜400**、$5 で約4ヶ月もちます。

> 単価は OpenAI 公式のトークン単価からの試算です。初回生成後に Settings › Usage の実額で確認してください。

---

## ローカルで動かす場合

```bash
npm install
cp .env.example .env.local   # 値を埋める
npm run dev                  # http://localhost:3000
```

`OPENAI_API_KEY` 未設定でも **デモモード**で画面の動作確認ができます（画像はプレースホルダ）。

---

## ファイル構成

```
content/products.json     商品マスタ（外観英文・推奨テイスト・商品別禁止句）
content/tones.json        テイスト骨格（PR-01/PR-02/トーンA・B・C）
content/purposes.json     用途・サイズ・構図・書き出し
content/rules.json        共通禁止句・追加要素チップ・NGワード辞書
lib/compose.ts            プロンプト組み立て（12ブロック連結・NGワード検知）
lib/options.ts            画質・サイズの型
lib/providers.ts          画像エンジン切替（openai / gemini）
lib/errors.ts             エラー文言の整形
app/page.tsx              メイン画面
app/login/page.tsx        ログイン画面
app/api/generate/route.ts 画像生成／編集
app/api/config/route.ts   稼働中エンジンの表示用
middleware.ts             パスワード認証
knowledge/brand_knowledge.md  ブランドGL全文（人が参照する原典。アプリは読みません）
```

## 運用ルール（ブランドGL v2.0 準拠・アプリに組込済）

- 1プロンプト＝1リクエスト（毎回独立呼出）
- プロンプトは分割せず1本の連続文
- 各3枚生成して選ぶ（下書きは「低」品質で）
- 商品追加は「完成カットの1要素差し替え」（編集機能）を第一選択
- ロゴマークは生成せず後入れ／画像内に文字を入れない（巾着のワードマークのみ例外）
- 銀は規定カラー外（navy #222C40／gold #998062／白／黒）。本社確認が下りるまで使わない

## 未確定事項

| 項目 | 状態 |
|---|---|
| 銀の使用可否 | 本社確認待ち。NGワード辞書で警告が出る設定 |
| navy背景・彩度は商品のみ、の解釈 | 確認待ち。テンプレートは安全側（無彩背景）で固定 |

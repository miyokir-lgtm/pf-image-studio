# Pharmesthetic Image Studio

ブランドガイドライン（VI・薬機法・確定プロンプト PR-01〜04・4トーン）に準拠した社内用の画像生成ツール。
**費用ゼロ構成**: Vercel Hobby（無料）＋ Gemini API 無料枠（プロンプト生成＋画像生成）。カード登録不要。
精度を上げたくなったら OpenAI gpt-image-1 / Claude を環境変数の追加だけで切替可能。

## 仕組み

```
スタッフ入力（商品・用途・イメージ・参照画像）
   ↓  /api/prompt
Gemini 2.5 Flash ── knowledge/brand_knowledge.md（ブランドGL全体）を参照して英語プロンプト1本を生成
   ↓  画面でプロンプト確認・手直し
   ↓  /api/generate
Gemini 2.5 Flash Image（Nano Banana）── 1〜3枚を並列生成（参照画像あり＝画像編集）
   ↓
画面に表示・ダウンロード・「1要素だけ差し替え」再編集（PR-03方式）
```

- 認証: 共通パスワード（環境変数 `APP_PASSWORD`）
- 保存: サーバー側に画像は保存しない。履歴はブラウザ内（localStorage）に最新30件のサムネイルのみ
- ロゴマークは規定により生成しない（後入れ）
- エンジン切替: `PROMPT_PROVIDER` / `IMAGE_PROVIDER`（`.env.example` 参照）

---

## デプロイ手順（GitHub ＋ Vercel、所要 約15分）

### 0. Gemini API キーを発行（無料・カード不要・3分）

1. Google Workspace のアカウントで https://aistudio.google.com/ を開く
2. 左下 **Get API key → Create API key** → キーをコピー（`AIza…`）
3. 開けない場合: Workspace 管理コンソール → アプリ → その他の Google サービス → **Google AI Studio** を ON

> 無料枠の規約上、入力・出力は Google のサービス改善に利用されます。**未公開商品・機密資料は参照画像に入れない**運用にしてください（公開済み商品写真・GLは問題なし）。有料枠（最低 $5 前払い）に切替えると学習利用されません。

### 1. GitHub にプッシュ

```bash
cd pf-image-studio
git init
git add .
git commit -m "Pharmesthetic Image Studio v0.2"
# GitHub で空のプライベートリポジトリ pf-image-studio を作成してから
git remote add origin https://github.com/<あなたのID>/pf-image-studio.git
git branch -M main
git push -u origin main
```

### 2. Vercel でインポート

1. https://vercel.com/ に GitHub でサインアップ（Hobby＝無料）
2. **Add New… → Project** → `pf-image-studio` を **Import**（Framework は自動で Next.js）
3. **Environment Variables** に2つ追加

| Key | 値 |
|---|---|
| `APP_PASSWORD` | 社内共通パスワード |
| `GEMINI_API_KEY` | `AIza…` |

4. **Deploy** → 1〜2分で `https://pf-image-studio-xxxx.vercel.app` が発行される
5. Project → Settings → Functions で **Fluid Compute** が ON であることを確認（新規プロジェクトは既定でON）

### 3. 動作確認

1. 発行URLを開く → 共通パスワードでログイン（画面右上に「Gemini → Gemini Image（無料枠）」と出ればOK）
2. 商品・用途・イメージを入力 → **プロンプトを生成**
3. プロンプトを確認 → 3枚で **画像を生成する**
4. 1枚選んで **ダウンロード**、必要なら **この画像を編集** で1要素差し替え

以後、コードを修正して `git push` すれば自動で再デプロイされます。

### 精度を上げたくなったら（任意・従量課金）

| 追加する環境変数 | 効果 | 費用 |
|---|---|---|
| `OPENAI_API_KEY` ＋ `IMAGE_PROVIDER=openai` | 画像生成を gpt-image-1 に切替（品質 低/中/高が選べる） | 約¥6〜25/枚（最低 $5 前払い） |
| `ANTHROPIC_API_KEY` ＋ `PROMPT_PROVIDER=anthropic` | プロンプト生成を Claude に切替 | 約¥3/回（最低 $5 前払い） |

---

## ローカルで動かす場合

```bash
npm install
cp .env.example .env.local   # 値を埋める
npm run dev                  # http://localhost:3000
```

`GEMINI_API_KEY` 未設定でも **デモモード**で画面の動作確認ができます（プロンプトはテンプレート、画像はプレースホルダ）。

---

## 費用（月50回・1回3枚の場合）

| 構成 | 月額 |
|---|---|
| **Gemini 無料枠（既定）** | **¥0**（1日あたりのリクエスト上限あり。月50回なら十分） |
| Gemini 有料枠に切替 | 約¥6/枚 → 約¥900 |
| OpenAI gpt-image-1 に切替 | 約¥6〜25/枚 → 約¥900〜3,800 |
| Vercel Hobby / ドメイン / 保存 | ¥0 |

---

## ブランドルールの更新

`knowledge/brand_knowledge.md` がAI（Gemini／Claude）の唯一の参照元です。
GLの改定・未確定事項の確定（銀の使用可否、navy背景の彩度運用 等）・新商品の追加は、このファイルを編集して `git push` するだけで反映されます。
商品プルダウンは `lib/options.ts` の `PRODUCTS`、用途・サイズは同ファイルの `PURPOSES` を編集してください。

## ファイル構成

```
app/page.tsx             メイン画面
app/login/page.tsx       ログイン画面
app/api/prompt/route.ts  プロンプト生成（Gemini / Claude）
app/api/generate/route.ts 画像生成／編集（Gemini / OpenAI）
app/api/config/route.ts  稼働中エンジンの表示用
lib/providers.ts         エンジン切替ロジック
lib/errors.ts            エラー文言の整形
middleware.ts            パスワード認証
lib/options.ts           商品・用途・テイスト・品質の選択肢
lib/auth.ts              Cookieトークン
knowledge/brand_knowledge.md  ブランドGLナレッジ（AIのシステムプロンプト）
```

## 運用ルール（ブランドGL v2.0 準拠・アプリに組込済）

- 1プロンプト＝1リクエスト（同一チャットでの再生成はしない → 本ツールは毎回独立呼出）
- プロンプトは分割せず1本の連続文
- 各3枚生成して選ぶ
- 商品追加は「完成カットの1要素差し替え」（編集機能）を第一選択
- ロゴマークは生成せず後入れ／画像内に文字を入れない

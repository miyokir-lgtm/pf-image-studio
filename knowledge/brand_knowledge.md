# Pharmesthetic JAPAN 画像生成ナレッジベース（gpt-image-1 用プロンプト作成の前提知識）

> 出典: ①韓国ブランド定義資料受領メモ(2026-06)／②ブランドGL草案(2026-06)／③ロゴ・カラー・書体・薬機法ルール(2026-06)／商品画像フラットレイ確定版プロンプト集 v2.0(2026-09-10)／4トーンプロンプト集 v1.1(2026-09-09)／トーンD実践ガイド(2026-09-09)／MV画像プロンプト(2026-08-20)／ストーリー画像プロンプト(2026-07-14)／VI定義書 v1.0(2026-07)／デザインGL詳細版 v0.9(2026-07)／韓国本社 Brand Experience Design Guidelines v1.0 日本語訳(2025-09)
> 凡例: ★＝韓国本社確認待ちの暫定値／(推定)＝本書作成者の推論（資料に明記なし）

---

## 1. ブランド概要・理念・世界観

### 1-1. 基本情報
- ブランド名: **Pharmesthetic®（ファーメステティック）** ＝ Pharmacy（薬局）＋ Aesthetic（美容）の造語。「専門性を語源に持つこと」が最大の差別化資産。
- 正式名称表記: PHARMESTHETIC／欧文ロゴを基本、和文「ファーメステティック」は補助併記。
- 位置づけ: **エステ専門家（マスター）を基盤としたハイエンド・キュレーション・プラットフォーム**。「肌の悩みに"正しいソリューション"を届ける」。
- Brand Essence: 「あなたと、あなたの周りのすべての人が、健やかな肌を取り戻せるように。」（Helping You And Everyone Around You Regain Healthy Skin.）
- Brand Slogan: 「毎日5,000のエステティックで、20万人の肌に触れる Pharmesthetic。」
- Core Value: Liberation（解放）／Social Contribution（社会貢献）／Personalization（個人化）
- Design Principle: Balance（均衡）／Liberation（解放）／Customization（個人化）— 色・質感・書体は「調和」を強化する方向で選ぶ。
- タグライン案★: 「肌に、処方を。」／「Curated by professionals.」
- ブランドプロミス: 「最安ではなく、最適を。専門家が選び抜いた肌の正解を処方する」

### 1-2. 最上位原則（不可侵）
- **「量産＝安売り化の防止」**が全規定の上位思想。価格で説得しない／理由なき割引をしない／有名人・インフルエンサーに依存しない／SKUを無秩序に広げない／トレンドを追わない／ブランド価値を毀損しない。
- 3つの絶対OKライン: ①価格訴求の禁止 ②マスター（事業者）中心 ③専門家コンサル経由の購買。
- 「ショッピングモールではない」— オープンマーケット型・最安値訴求は不採用。

### 1-3. ムードキーワード（確定要素・facts）
| キーワード | 意味 | 表現での出方 |
|---|---|---|
| ハイエンド | 静謐・上質・余白 | 余白多め／navy基調／過剰装飾しない |
| キュレーション | 厳選・編集された信頼 | 「選び抜いた」文脈／専門家の視点 |
| ユニーク | 唯一性・量産でない | 横並びでない構図・コピー |

### 1-4. トーン＆マナー
- 原則: **「断定しすぎず、根拠で語る／煽らず、選び抜く」**。迷う表現は「言わない（安全側）」に倒す。
- 人格化: 「知識豊富で誠実な専門家。声を荒げず、根拠で語る。流行に流されず、あなたの肌だけを見る。」
- OK: 落ち着き・根拠提示／専門家・伴走者／ミニマル・上質・余白
- NG: 煽り・誇張・絵文字過多／売り子・値引き屋／賑やか・チープ・情報過密
- ビジュアルトーン: navy主体＋gold差し色＋白黒で締める／余白を広く取る／写真は質感・肌の透明感重視／加工過多・煽りバナー禁止。
- フォトディレクション OK: 自然光・柔らかい陰影／余白のある構図・**被写体1点主義**／navy・gold・白に馴染む色温度／工程・こだわりを静かに見せる／モデルの視線・所作は落ち着いた品位。
- フォトディレクション NG: 過度なレタッチ・美肌加工／赤黄ベタ・爆発フキダシ／文字を敷き詰めたバナー／他社誌面・第三者画像の転載／BAの効果保証的な見せ方★。

### 1-5. 参考ブランド・参照
- 既存MV: SHIRO MEMBERSHIP 集合ビジュアルの構図思想（生素材×余白×自然光）を navy基調に翻訳。
- トーンD参照ビジュアル: 著名ブランドの「印刷紙の上に真俯瞰・使いかけ」系統（ブランド名は資料に非記載）。**プロンプトに参照ブランド名を書かないこと**（意匠・商標リスク）。差別化点（自製の紺インク印刷紙／`Pharmesthetic` 刷り込み巾着）を必ず1つ入れる。
- 韓国本国サイト pharmesthetic.com は臨床・信頼寄り＝日本側は「専門家が処方する情緒」を上乗せする。

---

## 2. VI規定

### 2-1. ロゴ（★本社データ受領まで暫定）
- **画像生成AIにロゴを生成させない。ロゴ（ワードマーク／ロゴマーク）は本社の正規データ（AI/SVG）を後入れ**（③規定：ロゴ改変禁止）。ロゴマーク（頭部シルエット＋歯車）は「確実に崩れる」ため生成不可。
- 例外運用: 巾着への `Pharmesthetic` **ワードマーク（文字のみ）の刷り込み**は、綴り検証（13文字・大文字はPのみ）を条件に生成を許容（v2.0）。
- クリアスペース: ロゴ高さX の **0.5X以上**を四方に確保★。
- 最小サイズ: 資料により差異あり → ③規定「横デジタル40px／印刷10mm」★、デザインGL詳細版「デジタル高さ24px／正方版24×24px／印刷10mm／大判15mm以上／刻印8mm」★、韓国本社GL「3mm / 16px」。
- 背景: navy／白／黒の単色背景。複雑な写真上は白 or 金の単色版を使用。
- 禁止6類型: 色変更／縦横比変更・変形・回転／影・グラデ・縁取り等の装飾付加／余白侵害／低解像度・かすれ・再トレース／他ロゴとの並置で主従が崩れる配置。（韓国本社版: 専用カラー以外の使用／字間変形／意図しない線処理／任意効果付加／非正比例拡縮／背景色規定違反）
- ロゴ後入れ用グラデ（P2案・未確定）: 銀 `#F2F2F2→#9A9A9A→#E8E8E8`／gold `#C7B49A→#998062→#D6C7AE`、角度15°。

### 2-2. カラー（確定要素）
| 役割 | 名称 | HEX | RGB / Pantone | 用途 |
|---|---|---|---|---|
| メイン | **Pharme Navy** | **#222C40** | R34 G44 B64／PANTONE 289C | 背景・基調・タイトル |
| アクセント | **Pharme Gold** | **#998062** | R153 G128 B98／PANTONE 4256C（デザインGL詳細版では4525C表記） | 罫線・強調・上質感の差し色 |
| サブ | White | #FFFFFF | — | 余白・抜き文字 |
| サブ | Black | #000000（③規定・デザインGL）／#010101（VI定義書・韓国本社GL） | — | 本文・締め |

- 使用比率目安★: navy（＋白）70%／white 20%／gold 8%／black 2%。**goldは面積過多で安っぽくなる→罫線・見出し・差し色に限定**。
- コントラスト: 白×navy 14.0:1（AAA）／gold×navy 3.74:1（大字のみ・本文NG）／gold×白 3.74:1（見出しのみ）／黒×白 21.0:1。
- IGフィードテンプレA背景: navyグラデ `#1A2336→#222C40→#2E3A58`。
- カラーNG: 原色・蛍光色の追加／goldの面積過多／navy×black等の低コントラスト／**セール感の出る赤・黄ベタ塗り**。
- 画像生成時の運用解釈（★9/12承認待ち）: **「背景＝navy／無彩（オフホワイト・石・紙・リネン）で構成し、彩度は商品パッケージのみが担う」**。GL比率は背景・グラフィック要素に適用し、商品実物の色（橙・緑・青）は比率対象外とする。プロンプト定型: `The ONLY saturated colors in the frame come from the product packaging itself.`
- navy背景×ネイビー系パッケージは沈む→明るい台座（コンクリ／木／大理石）側に置く。

### 2-3. 書体（★本社指定受領まで暫定）
- 日本側暫定: 欧文見出し **Cormorant**（Medium/SemiBold）／Noto Serif、欧文本文 Noto Sans、和文見出し **Noto Serif JP**（SemiBold 600）、和文本文 **Noto Sans JP**、ハングルは本社指定書体。
- 韓国本社GL指定: 欧文 **Minion Variable Concept**、和文・ハングル **KoPubWorld バタン体**。
- 1画面3書体まで。NG: 極太ポップ体・手書き風／煽りフォント／低可読サイズ／goldの本文使用。
- 画像内でワードマークを刷り込む場合の指定: `a fine classical serif with generous letter spacing`（後入れ時は Cormorant または Noto Serif、#222C40、不透明度85%・乗算）。

### 2-4. 余白・レイアウト（デザインGL B5）
- 外周マージン: **短辺の8%**（1080pxで約86px）。ブロック間余白0.5モジュール以上。
- 文字の版面占有: 1画面最大55%。1投稿の要素数: **主役1＋補助情報 最大3**。
- 生成画像: ロゴ・コピー用の余白を**1辺に20%以上**（フラットレイは上または右の大理石側／立ち構図は上部1/3）。

---

## 3. 薬機法・表現ルール（画像内テキスト・小物への注意）

### 3-1. 大原則
- 全製品を**化粧品**として最も安全側で運用（区分Q4は未確定）。言えるのは化粧品の効能効果**56項目の範囲内**のみ（肌を清潔にする／うるおいを与える／乾燥を防ぐ／肌を整える／キメを整える／ハリ・ツヤを与える／なめらかにする／すこやかに保つ／メイクアップ効果で明るく見せる）。
- 成分は「配合」の事実表記のみOK。成分効果の断定はNG。
- **迷ったらNG側に倒す（言わない）**。事実（配合・使用方法・使用感）に限定。
- 景表法・ステマ規制: 利益が発生する投稿は **#PR / #広告 必須**（画像左上＋キャプション冒頭）。「最安」「No.1」等の根拠なき最大級は不可。他社誌面の画像転載NG（「○○誌に掲載」と文章で事実のみOK）。
- BA（ビフォーアフター）: 原則慎重（★Q5）。使用時は「個人の感想であり効果には個人差があります」必須／同条件撮影／レタッチ誇張禁止／「治った」併記NG。

### 3-2. NG→OK言い換え表（全製品共通）
| NG | OK言い換え |
|---|---|
| シミが消える／消える | メイクアップ効果で明るい印象に／うるおいでくすみ感をケア |
| シワを改善・なくす | 乾燥による小じわを目立たなくする（要効能確認） |
| 美白する（医薬部外品承認語） | 透明感のある印象へ／メイクで明るく |
| 肌が再生／ターンオーバー正常化 | 健やかな肌印象をサポート |
| エクソソーム・幹細胞が細胞を活性化 | ○○成分を配合 |
| アンチエイジング／若返り | エイジングケア（年齢に応じた手入れ） |
| 痩せる／脂肪燃焼 | 化粧品では訴求しない |
| 医療レベル／クリニック級 | サロン専用設計／専門家監修 |
| 副作用がない／安全 | 保証表現は避ける |
| 100%／完全に／必ず効く／最安／No.1 | 個人差があります／使用しない |

### 3-3. 画像生成での薬機法・法務ルール（プロンプトに反映すべきもの）
- **生成画像内の文字はゼロが原則**（キャッチ・効能・ロゴ・ラベル・バッジ・シール・価格タグ・％・透かし全て禁止）。文字は全て後入れし、後入れ文字も56項目内に限定。唯一の例外は巾着の `Pharmesthetic` ワードマーク（PR-01）。
- 背景の印刷物（処方箋紙・薬局紙・自製印刷紙）は**「読めない文字のテクスチャ」**として指定する（`no legible words, no sentences, no numbers, no headlines`）。読める単語が出たら不可。
- 引き出しの札・器具・紙は全て **EMPTY／unlabelled／blank**。
- 効能暗示要素の禁止: 顔・手・肌のアップ／BA比較／**商品を肌に塗るカット**／注射器・針・錠剤・医療機器・実験室のハザード記号／白衣／処方箋文字／薬瓶ラベル／**氷・雪（冷却＝鎮静効果の暗示）**。水滴で「浸透」暗示は可読文言なしなら可（MV資料）。
- **SPF商材（Final Balm 等）**: 日焼け・海・太陽・ビーチ・タンニングを写さない。
- 「使いかけ」表現: 潰れ・皺はOK。**汚れ・液だれ・指紋・破損はNG**（不潔＝ブランド毀損）。
- 製品名の由来（Strong／ジェクション／Pharbject 等）を効能として語らない・画で示さない。
- 赤・蛍光色・セール感の色面禁止（商品自体の朱赤・橙・緑は可）。
- 「1950年代欧州薬局」等の舞台は架空様式とし、実在ブランド・実在薬局の意匠は再現しない。

---

## 4. 商品一覧（画像生成に必要な外観情報）

### 4-1. ライン構成（実在SKU）
- **aXENDA（アクセンダ）**: ブルーブラッド／マホロサ／ルティナー／ニギミボンム
- **CONAPIDIL（コナピディル）**: グリーンボクシン／グリーンボクシン ストロング／ゲルスターター／セメンザル／セメンザル ライト／セメンスティック／ファイナルバーム／フィニッシュローション／ユニストーン／カルメンシート
- **その他**: Pharbject（Pharmeroom）／スーパージェクション／ゾロピックス／ビバンクエントマンカ（VQM）／シーパウダー

### 4-2. 外観が資料で確認できる商品
| 商品 | 容器・容量 | 配色・意匠 | プロンプト内の定型英文 | 備考 |
|---|---|---|---|---|
| ビバンクエントマンカ ローション（VIBANQM LOTION／VQM）30ml | アルミ調スクイーズチューブ（小型・細身） | 橙（サフラン）ボディ×深緑のショルダー＆スクリューキャップ。白い文字。極太コンデンス書体・90°回転組、`VPS-2561`／`FOR EXTERNAL USE ONLY` | `a small skincare tube with a saffron-orange body, a deep forest-green shoulder and a deep forest-green screw cap` | 欧州の軟膏チューブ風。トーンD第1選択 |
| セメンザル ライト 100ml | 白チューブ＋青キャップ | 白×コバルト青印刷、`High Potency Cream 100` | `a white tube with cobalt-blue printing and a blue cap` | 紺の紙に沈む→リネン＋大理石の地を使う |
| グリーンボクシン 150ml | 半透明ボトル（自立型・大型） | 淡ミントのジェル、生成りラベル×緑インクの細密全成分テキスト、樹アイコン、`For Use In Skin Only` | `the cream label with dense green printed text and the small green tree mark` | ボトル系→トーンB第1選択。俯瞰は間延び |
| グリーンボクシン ストロング 65ml | 半透明スクイーズボトル（小型） | 淡緑ジェル、緑の細密ラベル、樹アイコン、**深緑のフリップキャップ** | `a small translucent squeeze bottle with a cream label densely printed in green, and a dark green flip cap` | 氷・雪の演出は日本側NG |
| マホロサ（Mahorosa／aXENDA）100ml クリームミスト | フロストPETポンプボトル | 淡ヌード×朱赤×グレージュキャップ。銅版画調の薔薇イラスト＋朱赤の雫、`Cream Mist`。中身は半透明ヌードピンク | `the small engraved rose illustration and the orange-red droplet on the bottle must remain pixel-faithful` | 19世紀薬草書風。唯一の情緒枠。ボトル系→トーンB |
| ファイナルバーム（Final Balm） | チューブ | ラベルに `S.P.U Multi Balm`（ピリオド付き）、`SPF50+ PA+++` | — | **SPF商材**。確定カット（Final Balm＋VQM）がPR-03の入力元 |
| スーパージェクション クリーム | ジャー（推定：7/15ストーリー用プロンプトが `cream jar` と記載） | — | — | 外観詳細は資料に記載なし |
| セメンザル ライトフィルム | 「film/serum product」（7/25ストーリー用） | — | — | 外観詳細は資料に記載なし |

- パッケージ表記の照合ポイント: `S.P.U Multi Balm` のピリオド／`SPF50+ PA+++` のプラス数／`CONAPIDIL` の ®／`AMISCARE(N)` の括弧。
- 商品画像（添付参照）は多くが**正面立ち姿の3Dモックアップ・クリーム背景・角丸・箱付き**。生成時は「箱を出さない・背景と角丸を破棄・新規撮影」を明示する必要がある。
- 上記以外の商品（ブルーブラッド／ルティナー／ニギミボンム／ゲルスターター／セメンスティック／フィニッシュローション／ユニストーン／カルメンシート／Pharbject／ゾロピックス／シーパウダー）の容器形状・色は**資料に記載なし** → 添付参照画像の記述をスタッフ入力から起こす。

---

## 5. 確定ビジュアル方針（トーンD）と4トーン定義

### 5-1. 確定テイスト「コットン巾着＋白大理石＋スマホスナップ調フラットレイ」（v2.0・2026-09-10）
- チューブ系全商品の**標準ビジュアルとして固定**。2026-09-09の実制作で狙いどおりの1枚が出た確定形。
- 決め手は3つの引き算: ①大理石の作り込み・銀・エディトリアル照明をやめる ②真俯瞰90°をやめて**少し斜めに傾いた俯瞰**にする ③スタジオ品質をやめて**スマホの粒子・低コントラスト・軽いビネット**を指定する。「きれいに撮る」指定を外すと生っぽさが出る。
- 構成要素: 白大理石（soft grey veining）／左2/3にクリーム色の粗織りコットン巾着（ギャザー・ねじれた紐・皺）／巾着上部に `Pharmesthetic` を紺のスクリーン印刷（細いクラシカルセリフ・広い字間・巾着幅の約半分）／商品チューブは巾着の上に斜め・印刷面を正面・キャップ閉／右上に無地の大理石の余白／左上からの曇天窓光・影は右下／オフセンター・巾着を左端で切る／フルブリード正方形・角丸なし。
- 効いた定型句（再利用）:
  - 生っぽさ: `close to overhead but noticeably tilted, so the scene is seen slightly obliquely`
  - CG臭除去: `must look like a real phone photograph, not a 3D render, not a mockup and not a composite`
  - 質感: `slightly soft focus, mild grain, muted contrast, a faint natural vignette`
  - 角丸除去: `full-bleed square photograph with sharp square corners — no border, no frame, no rounded corners`
  - 綴り固定: `spelled letter by letter as P, h, a, r, m, e, s, t, h, e, t, i, c`
  - 暴走停止: `If it cannot be reproduced accurately, show the scene without the product rather than an approximation.`
- 失敗原因（v1.1時点）: カメラアングルは変換できない（正面立ち姿の添付は何度回しても俯瞰にならない）／添付＝編集タスクと解釈されクリーム背景・角丸が残る／同一チャット再生成でコピーになる／長文分割で後半が無視される／「高級・エディトリアル・medium format」指定でCG臭いカタログ写真になる。
- 前提: チューブは平面ラベルの円筒なので正面図の90°回転が俯瞰の近似として成立（**ボトル・ポンプ容器では成立しない**）。

### 5-2. 4トーンの定義（v1.1）
| トーン | 一言 | 背景・地 | gold | 主用途 | 判定 |
|---|---|---|---|---|---|
| **A: Quiet Apothecary** 静謐ハイエンド | 既存MV路線。navy壁＋ダークストーン台座＋真鍮リム＋ダークガラス。立ち構図 | navy #222C40 主体（70/20/8） | 罫線・縁 8%以内 | ストーリー背景・配布ベース素材（量産用） | ○ 安全牌。GL適合5/5 |
| **B: Prescription Counter** レトロ調剤台 | 1950–60年代欧州調剤室。濃色ステイン木の引き出し（札は空白）＋navy壁、オフホワイトの薬局紙、真鍮天秤・空のビーカー・白磁皿。立ち構図 | navy＋生成り紙／濃緑フェルト | 真鍮器具として8%以内 | IGフィード・商品ページ・配布素材。**ボトル系の第1選択** | ◎ 本命（v1.1）。GL適合4/5。小物3点以内 |
| **C: Editorial Pop** 色面・スケール操作 | 商品由来の単色ベタ（ミント・サフラン・ダスティローズ）＋幾何学ポディウム＋巨大ぼかし図形 | 商品由来の脱彩度ベタ | ほぼ不使用 | IG単発／プロモ告知のみ。**本社/村山さん承認時のみ・月1本上限** | △ GL適合2/5 |
| **D: Editorial Flat-lay** 俯瞰・使用の痕跡 | 印刷紙・布・石の上に寝かせる。使いかけの生々しさが主役。大胆なトリミング | 紺インク自製印刷紙(G1)／リネン＋大理石(G2)／紺の無地巾着＋テラゾー(G3)／紙＋石半々(G4)。**v2.0で「クリーム色コットン巾着＋白大理石」に確定** | — | **チューブ系・小型スクイーズ・2点セットの第1選択** | ◎ チューブ系の本命。GL適合4/5 |

- 商材別使い分け: チューブ（VQM／セメンザルライト／Final Balm）→D／ハリ艶セット（VQM＋セメンザルライト）→D／ボトル（グリーンボクシン150ml／マホロサ）→B／ストロング65ml→B（D可）／ストーリー背景→A。
- トーンD「使用の痕跡」パーツ: U1 潰れ（新品1本＋根元を潰した使いかけ1本、最も効く）／U2 キャップ外し／U3 中身少量（白磁スプーンに少量・**肌に塗らない**）／U4 なし（配布素材の基本形）。
- トーンDの色の調停: 橙チューブ→紺印刷の紙（補色）／白青チューブ→淡い大理石（無彩の上でのみ輪郭が立つ）／2本の間は空の帯＋リネンで分離（直接隣接させない）。
- 生成方式の優先順位: 方式0 添付画像を90°回転→生成背景に合成（文字100%・15分）／方式1 背景のみ生成＋後合成（本命）／方式2 一発生成（文字40–60%・検証用）／方式3 実写（実物があれば最良）。2商品セットは必ず背景のみ生成＋後合成。
- 影の作り方（合成時）: 光源左上→影は右下で全オブジェクト統一／距離はチューブ太さの1/4／ぼかし強め／不透明度20–30%／色は黒でなく紺 #222C40 を薄く。

---

## 6. 確定プロンプト PR-01〜PR-04（全文・原文どおり）

> 共通の運用: **1プロンプト＝1新規チャット／出力サイズは「正方形」と口頭指定／各3回生成して選ぶ。**

### PR-01｜★標準形：コットン巾着＋大理石（Pharmesthetic 刷り込み入り）
**添付**: 商品画像1枚（複数商品なら2枚）

```
Create a completely new photograph. Do not reuse the attached images as compositions — discard their backgrounds, their rounded corners, their studio lighting, their camera angles and their carton boxes entirely. The carton boxes must not appear. The attached images are only locked references for the products themselves.

The photograph looks like a casual, unstyled snapshot taken on a smartphone from above a table — honest and a little imperfect, not a professional studio shot. The camera looks down from a high angle that is close to overhead but noticeably tilted, so the scene is seen slightly obliquely rather than perfectly square to the surface.

The surface is a white marble slab with soft grey veining. Filling the left two thirds of the frame is a crumpled cream-coloured cotton drawstring pouch of coarse plain weave, its gathered top, twisted cord and soft folds clearly visible.

Printed across the upper area of the pouch is a single line of text reading Pharmesthetic — spelled letter by letter as P, h, a, r, m, e, s, t, h, e, t, i, c, one capital P followed by twelve lowercase letters, thirteen letters in total and no other characters. It is set in a fine classical serif with generous letter spacing, spanning roughly half the width of the pouch, sitting on a flat well-lit area of cloth so it stays fully legible, screen-printed in soft dark navy ink that sinks into the weave. Do not add a second line, a tagline, a web address, a registered trademark symbol or any border around it. If you cannot spell it exactly, leave the pouch blank.

Lying diagonally on the pouch, below the printed word, is the main product tube from the attached reference, its printed face turned toward the camera, sinking very slightly into the soft cloth, its cap screwed on. Nothing else is in the frame — no boxes, no cards, no other products, no plants, no props.

The composition is casual and slightly off-centre, with the pouch cut by the left edge of the frame and a quiet area of bare marble in the upper right.

The light is soft, cool indoor daylight coming from the upper left, as if from a window on an overcast day, producing gentle low-contrast shadows toward the lower right under the tube and along the folds of the cloth. No hard flash, no rim light, no studio lighting.

The image must look like a real phone photograph, not a 3D render, not a mockup and not a composite: slightly soft focus, mild grain, muted contrast, a faint natural vignette, and the small imperfections of an unedited snapshot.

Reproduce the product exactly as it appears in the attached reference and do not alter it: the same body colour, the same printed lettering in the same sizes, weights, rotations and positions, the same shoulder, the same silhouette and proportions, and the same cap. Do not re-letter, re-typeset, translate, re-colour or restyle any part of the packaging, and do not invent extra wording or symbols. If it cannot be reproduced accurately, show the scene without the product rather than an approximation.

Do not add any other text, captions, labels, badges, seals, logos or watermarks anywhere. Do not show faces, hands, skin, medical equipment, or any suggestion of sunbathing, beaches or tanning.

Deliver a full-bleed square photograph with sharp square corners, edge to edge — no border, no frame, no rounded corners.
```

**商品を2点にする場合**は「Lying diagonally on the pouch...」の段落を以下に差し替える。

```
Lying diagonally on the pouch, below the printed word, is the larger product tube from the first attached image, its printed face turned toward the camera, sinking very slightly into the soft cloth, its cap screwed on. To its right, lying flat on the bare marble at a slightly different angle so the two are not parallel, is the smaller tube from the second attached image, cap screwed on, about two thirds the length of the first tube and set a little toward the right edge of the frame, so the larger tube stays the main subject. The smaller tube looks gently used: the lower third of its body is softly creased with a few natural wrinkles and a slight flattening toward the sealed base, catching the light along those folds, while all of its printing stays intact and legible. It looks lived-in, never damaged, dirty or leaking. Nothing else is in the frame — no boxes, no cards, no other products, no plants, no props.
```

### PR-02｜クラフト紙＋潰れたチューブ（情報密度を見せる型）
Greenboxin など**ラベルの文字密度が資産**の商材向き。青×クラフト茶、橙×クラフト茶ともに補色で映える。**添付**: 商品画像1枚

```
Create a completely new photograph. Do not edit or reuse the attached image as a composition — discard its background, its rounded corners, its clean studio lighting, its camera angle and its carton box entirely. The carton box must not appear. The attached image is only a locked reference for the product itself.

The photograph looks like a casual, unstyled snapshot taken on a smartphone from above a table at home — honest and a little imperfect, not a professional studio shot. The camera looks down at the surface from a high angle that is close to overhead but noticeably tilted, so the scene is seen slightly obliquely rather than perfectly square to the table.

Lying on a plain white table is a large sheet of brown recycled kraft paper, softly wrinkled, its torn ragged edge running across the lower right of the frame so that a corner of the bare white table shows through at the top left. The kraft paper is printed all over in black ink with dense, fine, small-set text arranged in narrow columns with thin horizontal rules — the printing must read purely as a texture of tiny illegible marks, with no readable words, no headlines, no names and no numbers anywhere.

Two identical product tubes lie on the kraft paper at a loose diagonal, roughly parallel to each other but slightly askew, one a little higher in the frame than the other, their printed faces turned toward the camera. The first tube is full and smooth, still holding its clean tapered shape. The second, identical tube is heavily used: its body is visibly crushed, wrinkled and twisted near the bottom, the material creased into soft folds that catch the light, while its printed lettering remains intact and readable across the wrinkles. Both caps stay on. The tubes overlap the printed paper so the black text runs behind and around them. Nothing else is in the frame — no box, no other products, no plants, no props.

The composition is casual and slightly off — the tubes are not centred, and the lower tube is cut by the bottom edge of the frame.

The light is soft, warm indoor daylight coming from one side, as if from a window on a bright day, producing gentle low-contrast shadows and a faintly warm cast across the paper. No hard flash, no rim light, no studio lighting.

The image must look like a real phone photograph, not a 3D render, not a mockup and not a composite: slightly soft focus, mild grain, muted contrast, a faint natural vignette in the corners, and the small imperfections of an unedited snapshot.

Reproduce the product exactly as it appears in the attached reference and do not alter it: the same body colour, the same printed lettering in the same sizes, weights, rotations and positions, the same shoulder, the same silhouette and proportions, and the same cap. Do not re-letter, re-typeset, translate, re-colour or restyle any part of the packaging, and do not invent extra wording, symbols or marks. If it cannot be reproduced accurately, show the scene without the product rather than an approximation.

Do not add any text, captions, labels, badges, seals, price tags, logos or watermarks of your own anywhere in the image. Do not show faces, hands, skin, medical equipment, or any suggestion of sunbathing, beaches or tanning.

Deliver a full-bleed square photograph with sharp square corners, edge to edge — no border, no frame, no rounded corners.
```

### PR-03｜編集：完成カットの1要素だけ差し替える（商品追加の標準手段）
既に良い1枚が取れている場合、**ゼロから作り直さない**（綴りと構図の当たりを引き直すことになるため）。**添付**: ①完成済みの画像 ②差し替えたい商品の画像

```
In the FIRST attached image, make one single change and leave everything else completely untouched.

Remove [差し替える対象。例: the plain dark navy rectangular card lying flat on the bare white marble on the right side of the frame]. In its place, put the product shown in the SECOND attached image: [商品の外観を1文で。例: a small skincare tube with a saffron-orange body, a deep forest-green shoulder and a deep forest-green screw cap]. Do not include the carton box from the second image — the tube only.

The new tube lies flat directly on the bare marble, roughly where the removed element was, at a relaxed diagonal that leans slightly differently from the existing tube so the two do not look parallel. Its printed face is turned fully toward the camera so its lettering reads clearly. Its cap stays screwed on. It is noticeably smaller and shorter than the existing tube — about two thirds of its length and slightly narrower — and it sits a little further toward the right edge of the frame so that the existing tube remains the main subject and the new one reads as a quiet second element.

The new tube looks gently used: the lower third of its body is softly creased, with a few natural wrinkles and a slight flattening toward the sealed base, the surface catching the light along those folds. It looks lived-in and real, not damaged, not dirty, not leaking and not deformed — all of its printing remains completely intact, sharp and legible across the creases.

Match the new tube perfectly to the existing photograph: the same soft directional daylight arriving from the upper left, the same gentle low-contrast quality, a soft contact shadow falling toward the lower right exactly like the shadows already in the picture, the same slight softness of focus, the same film grain and the same subtle warmth. It must look as though it was on the table when the original photograph was taken, not pasted in afterwards.

Everything else in the image must remain exactly as it is, pixel for pixel: the cream cotton drawstring pouch with its weave, folds and drawstring cord; the word Pharmesthetic printed on the pouch, with its exact spelling, its exact serif letterforms, its exact size, position and navy colour; the existing product tube with every element of its printing unchanged, and its shoulder, cap and position; the white marble surface and its grey veining; the framing, the crop, the camera angle, the colour grade and the overall exposure.

Reproduce the new product exactly as it appears in the second attached image: the same colours and the same white lettering in the same sizes, rotations and positions. Do not re-letter, re-typeset, translate, re-colour or restyle any part of it, and do not invent extra wording or symbols.

Do not add any other text, captions, labels, badges, logos or watermarks anywhere. Do not show faces, hands or skin. Deliver the same full-bleed square photograph with sharp square corners.
```

### PR-04｜背景プレートのみ（商品の文字が崩れるときの最終手段）
商品を生成させないため**改変リスクはゼロ**。生成後、商品画像を切り抜いて90°回転させて載せる。

```
Create a photorealistic top-down photograph of an empty surface, intended as a background plate for later product compositing, so the scene must be completely empty of products: no tubes, no bottles, no jars, no packaging and no cosmetics of any kind anywhere in the frame.

The photograph looks like a casual, unstyled snapshot taken on a smartphone from above a table. The camera looks down from a high angle that is close to overhead but noticeably tilted, so the surface is seen slightly obliquely rather than perfectly square.

The surface is a white marble slab with soft grey veining. Filling the left two thirds of the frame is a crumpled cream-coloured cotton drawstring pouch of coarse plain weave, its gathered top, twisted cord and soft folds clearly visible, completely unprinted and unbranded — no logo and no lettering of any kind on the fabric. A quiet, uncluttered area of bare marble occupies the upper right of the frame. Leave a clear, well-lit, relatively flat area on the pouch in the centre of the image where a product will be placed later.

The light is soft, cool indoor daylight coming from the upper left, as if from a window on an overcast day, producing gentle low-contrast shadows toward the lower right along the folds of the cloth. No hard flash, no rim light, no studio lighting.

The image must look like a real phone photograph, not a 3D render, not a mockup and not a composite: slightly soft focus, mild grain, muted contrast, a faint natural vignette, and the small imperfections of an unedited snapshot.

Do not add any text, letters, numbers, captions, labels, badges, seals, logos or watermarks anywhere in the image. Do not include people, hands, skin, plants, tools or medical equipment.

Deliver a full-bleed square photograph with sharp square corners, edge to edge — no border, no frame, no rounded corners.
```

**PR-04 合成手順（要点）**: 3回生成して選ぶ→チューブのみ切り抜き（箱は捨てる）・90°回転＋15〜25°傾け→巾着の平面に配置（中央を外し下端を切る）→布に沿ってワープ→右下に楕円シャドウ（紺 #222C40・不透明度25%・ぼかし強め）→`Pharmesthetic` を Cormorant／Noto Serif・#222C40・不透明度85%乗算で刷り込み→ノイズ3〜5%→1:1（1080×1080）／4:5（1080×1350）書き出し。

### 使用ルール（v2.0 ④運用ルール）
1. **1プロンプト＝1新規チャット**（同一スレッドは前画像を引き継ぐ）
2. プロンプトは**分割せず1本の連続文**で貼る（分割するとシーン記述が無視される）
3. 商品追加は**PR-03の編集を第1選択**（良い1枚を引き直さない）
4. **各3回生成して選ぶ**（1発目はまず当たらない）
5. ロゴマークは生成させない（必要時は後入れ）
6. 銀の使用は要確認（規定色は navy／gold #998062／白／黒の4色。承認が下りなければ gold #998062 に置換）
7. 完成カットは ops 配下に元データ・生成プロンプトごと保管（次商品のPR-03入力になる）
- 補足: 実践ガイドの「150語以内」指針と確定版PR-01〜04（長文1本）が併存するが、**確定形はv2.0のPR-01〜04を優先**。

---

## 7. 用途別の構図・余白・テキストスペース指針

### 7-1. Instagram 投稿（正方形 1:1／フィード 4:5）
- 生成: 正方形（1024×1024）→ 1:1（1080×1080）または 4:5（1080×1350）にトリミング。縦長生成（1024×1536）→4:5トリミングも可。主要素は中央60%に収める。
- 余白: 外周マージン短辺8%（約86px）。**ロゴ・コピー用余白を1辺に20%以上**（フラットレイは上または右の大理石側／立ち構図は上部1/3）。
- テンプレA（製品キュレーション）: navyグラデ背景、gold 1px 35%フレーム（マージン位置）、製品名 Noto Serif JP 58px 字間.1em＋gold罫56×2px、説明24px（56項目内）、#PRは画像左上、文字版面占有最大55%、主役1＋補助3。
- 9枚グリッド: 1列目製品(navy)／2列目教育(白)／3列目世界観・専門家(navy/gold)で暗・明・暗のリズム。goldの強い面は9枚中1〜2枚まで。
- 構図: 被写体1点主義／横並びでない・オフセンター／画面端で切る。

### 7-2. ストーリー（縦長 9:16・1080×1920）
- 生成: 縦長（1024×1536）→上下に背景を延長して 1080×1920。**文字が主役なので背景は静か（トーンA）／背景のみ生成→文字後入れ**。
- セーフゾーン: 上部0–250px 空ける（UIに隠れる）／上部帯250–650px ロゴ＋メインコピー／中央650–1250px 商品（透過を後合成）／下部帯1250–1570px 商品名・日付・注記／下部1570–1920px CTA（リンクスタンプ）用に空ける。（7/14資料では上250px・下350pxの安全マージン）
- リール: 上220px／下420px／右140pxはUIゾーン配置禁止。中央1:1トリムに主役を収める。
- 文字は使用シーン・使用手順・発売/在庫情報に限定し効能に触れない。利益発生投稿は #PR。

### 7-3. EC商品ページ／MV／バナー
- ヒーローMV PC: 1920×800px（コンテンツ幅1280px中央）、見出し Noto Serif JP 54px 白 最大2行、写真使用時は navy 50%→0 の左グラデで可読性担保。生成は横長（1536×1024）→2:1トリミング。上部1/3にロゴ用余白。
- ヒーローMV SP: 750×1100px、左右マージン60px。生成は縦長→9:16トリミング。
- 商品カード: 360px幅、サムネ**5:6**、navy面と白面を交互配置。製品名＋使用感（56項目内）。価格は主役化しない。
- キャンペーンバナー／OGP: 1200×628px（OGPは1200×630px）、gold 1px 35%フレーム、ロゴは下端から66px、中央600pxに主要素。セール色を作らない。
- **EC商品ページ単体の生成画像の構図規定は資料に記載なし**（商品カードのサムネ比率5:6・navy/白交互のみ）。

---

## 8. 未確定事項（★確認待ち）
| # | 項目 | 状況 |
|---|---|---|
| Q1 | ロゴ正式データ（AI/SVG）・余白・最小サイズ・誤用例 | 本社確認待ち。最小サイズは資料間で 16px／24px／40px と不一致 |
| Q2 | 指定書体（和文・欧文・ハングル）と代替フォント | 日本側暫定 Cormorant／Noto 系。韓国本社GLは Minion Variable Concept／KoPubWorld バタン体 |
| Q3 | navy/goldの使用比率・背景反転・アクセシビリティ基準 | 70/20/8/2 は暫定 |
| Q4 | 製品別の薬機法区分（化粧品／医薬部外品／雑貨） | 全製品を化粧品として安全側で運用中 |
| Q5 | ビフォーアフター写真の使用可否・条件 | 原則慎重・個人差注記必須 |
| — | **銀色の使用可否**（巾着刷り込み・ロゴ後入れ用グラデ） | 規定外の色。9/12 EC定例で承認取得予定。不可なら gold #998062 に置換 |
| — | **「背景navy／彩度は商品のみ」の色運用解釈** | 9/12 EC定例で村山さん承認予定。未承認なら橙・緑の商品は撮影不可に近い |
| — | トーンC（Editorial Pop）の使用 | 本社/村山さん承認が出るまで公開しない |
| — | 巾着の実物制作（実写化で綴りリスクをゼロに） | 見積検討中（9/17） |
| — | Black の HEX | #000000（③規定・デザインGL）と #010101（VI定義書・韓国本社GL）が併存 |
| — | Gold の Pantone | 4256C（VI定義書・韓国本社GL）と 4525C（デザインGL詳細版）が併存 |
| — | タグライン「肌に、処方を。」／価格帯／日本独自プロモの承認ライン | 要本社確認 |

---

## 9. プロンプト作成時のチェックリスト（Claude が最終プロンプトを出す前に確認）

**A. 入力の確認**
1. 商品は**チューブ系**（→PR-01/02/03/04・トーンD）か、**ボトル・ポンプ系**（→トーンB立ち構図／90°回転合成は不成立）か判定したか。
2. 既に完成カットがある商品追加なら、新規生成でなく **PR-03（1要素差し替え）**を第1選択にしたか。
3. 添付参照が「正面立ち姿・クリーム背景・角丸・箱付き」なら、冒頭で「新規撮影／背景・角丸・箱の破棄／添付は商品のロック参照のみ」を明示したか。
4. 2商品以上なら PR-01 の2点差し替え段落を使うか、背景のみ生成（PR-04）＋後合成を提案したか。

**B. プロンプトの形式**
5. **1本の連続した英文**（見出し・箇条書き・分割なし）になっているか。
6. 用途に応じた出力形状を明示したか（IG投稿・配布素材＝正方形／ストーリー・フィード4:5＝縦長／MV PC＝横長）。フルブリード・角丸なし・枠なしを末尾に置いたか。
7. 「real phone photograph, not a 3D render, not a mockup」「mild grain, muted contrast, faint natural vignette」「close to overhead but noticeably tilted」の確定定型句を含めたか（トーンD時）。
8. 「高級・エディトリアル・medium format・f/8」のスタジオ品質指定を**トーンDでは使っていない**か（CG臭の原因）。

**C. ブランド・VI**
9. ロゴマーク（頭部シルエット＋歯車）や `PHARMESTHETIC` ロゴを画像内に生成させていないか。巾着ワードマークを使う場合のみ「P, h, a, r, m, e, s, t, h, e, t, i, c／13文字／大文字はPのみ／®・www・2行目禁止／綴れなければ無地」を入れたか。
10. 参照ブランド名（SHIRO 等）を**プロンプトに書いていない**か。
11. 背景は navy #222C40／オフホワイト／白大理石／リネン／紙などの無彩・低彩度で構成し、`The ONLY saturated colors come from the product packaging itself` を入れたか。赤・蛍光・原色の色面、goldの面積過多（8%超）、銀（未承認）を指定していないか。
12. 光源は**左上の曇天窓光／影は右下／ハードフラッシュ・リムライト・スタジオ照明なし**で統一したか。
13. ロゴ・コピー用の余白（1辺20%以上、または上部1/3）を確保する記述があるか。
14. 構図はオフセンター・被写体1点主義・端で切る（横並び・中央配置のカタログ然としない）か。

**D. 商品の忠実再現**
15. 商品の外観（ボディ色・ショルダー・キャップ・文字色）を添付参照どおりに1文で記述し、「re-letter／re-typeset／translate／re-colour／restyle 禁止」「箱は出さない」「再現できなければ商品なしで出す」を入れたか。
16. パッケージ表記の照合ポイント（`S.P.U Multi Balm` のピリオド／`SPF50+ PA+++`／`CONAPIDIL®`／`AMISCARE(N)`）を意識し、高密度ラベル（Greenboxin・VQM）は崩れたらPR-04＋合成へ切替える旨をスタッフに案内できるか。

**E. 薬機法・法務**
17. 画像内に**一切の追加文字・キャプション・ラベル・バッジ・シール・価格タグ・％・透かし**を生成させない記述があるか。背景の印刷物は「読めないテクスチャ」指定か。
18. 顔・手・肌・肌への塗布・BA比較・注射器・針・錠剤・医療機器・白衣・処方箋文字・ハザード記号・氷雪を除外したか。
19. SPF商材（Final Balm 等）で日焼け・海・太陽・ビーチ・タンニングを除外したか。
20. 「使いかけ」表現は根元の潰れ・皺のみで、汚れ・液だれ・指紋・破損を禁止したか。
21. 製品名由来の効能（Strong＝強力、ジェクション＝注入 等）を画で示す小物を入れていないか。
22. スタッフのアイデアに効能訴求・セール訴求・有名人・トレンド演出が含まれていれば、GLに沿って**言わない側に修正**し、後入れ文字は56項目内・#PR必須である旨を注記したか。

**F. 運用の案内**
23. 出力時に「1プロンプト＝1新規チャット／3回生成して選ぶ／完成カットは元データごと保管」を添えたか。
24. 未承認事項（銀・彩度運用・トーンC）に触れる指定は、承認待ちである旨を明記したか。

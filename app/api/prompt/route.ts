import { NextResponse } from "next/server";

// v0.3 でプロンプト生成はテンプレート方式（lib/compose.ts・ブラウザ内で組み立て）に移行しました。
// このエンドポイントは使われていません。古いタブからの呼び出しに備えて残しています。
export async function POST() {
  return NextResponse.json(
    { error: "このエンドポイントは廃止されました。ページを再読み込みしてください。" },
    { status: 410 },
  );
}

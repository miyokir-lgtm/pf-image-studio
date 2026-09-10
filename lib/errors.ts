// SDK が返すエラーを人が読める1文にする
export function friendlyError(e: unknown, fallback: string): { message: string; status: number } {
  const err = e as { status?: number; message?: string; error?: { message?: string } };
  let message = err?.error?.message || err?.message || fallback;
  // Gemini SDK は JSON 文字列をそのまま message に入れることがある
  try {
    const j = JSON.parse(message);
    message = j?.error?.message || message;
  } catch {}
  let status = err?.status && err.status >= 400 ? err.status : 500;
  if (/API key not valid|API_KEY_INVALID|Incorrect API key|invalid_api_key|401/i.test(message)) {
    message = "APIキーが無効です。Vercel の環境変数を確認してください。";
    status = 401;
  } else if (/429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(message)) {
    message = "無料枠のレート制限に達しました。1分ほど待つか、枚数を1枚にして再実行してください。";
    status = 429;
  } else if (/SAFETY|blocked|content_policy|moderation/i.test(message)) {
    message = "安全性フィルタでブロックされました。プロンプトの表現（肌・医療・効能に関する語）を見直してください。";
    status = 400;
  }
  return { message, status };
}

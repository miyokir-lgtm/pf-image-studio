// 共通パスワード認証（Cookie に HMAC トークンを保存）
// Edge Runtime（middleware）でも動くよう Web Crypto のみ使用

export const AUTH_COOKIE = "pf_auth";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeToken(password: string): Promise<string> {
  return sha256Hex(`pf-image-studio::${password}::v1`);
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  const pw = process.env.APP_PASSWORD;
  if (!pw || !token) return false;
  const expected = await makeToken(pw);
  return token === expected;
}

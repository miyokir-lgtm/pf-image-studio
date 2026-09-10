"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) router.push("/");
    else setErr((await res.json()).error ?? "ログインに失敗しました");
  }

  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <div className="brand">Pharmesthetic</div>
        <p>Image Studio — 社内用</p>
        <input
          type="password"
          placeholder="共通パスワード"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
        />
        {err && <div className="error">{err}</div>}
        <button className="btn" disabled={busy || !pw}>
          {busy ? <span className="spinner" /> : "ログイン"}
        </button>
      </form>
    </div>
  );
}

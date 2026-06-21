"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const FIELD = "w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors";
const fieldStyle = { background: "#ffffff", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" } as const;

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [sent, setSent]     = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4"
            style={{ background: "rgba(94,184,154,0.14)", border: "1px solid rgba(94,184,154,0.3)" }}>
            <Check size={24} color="#3e8f72" />
          </div>
          <h2 className="font-bold mb-2" style={{ fontSize: 22, color: "#23221f", letterSpacing: "-0.3px" }}>Check your email</h2>
          <p className="text-sm" style={{ color: "#4d4b44" }}>
            We sent a password reset link to{" "}
            <span style={{ color: "#23221f", fontWeight: 600 }}>{email}</span>.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-colors hover:text-[#8a6530]"
            style={{ color: "#a07840" }}>
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  const disabled = loading || !email;

  return (
    <AuthShell>
      <Link href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 transition-colors hover:text-[#8a6530]"
        style={{ color: "#4d4b44" }}>
        <ArrowLeft size={12} /> Back to sign in
      </Link>
      <h1 className="font-bold mb-1" style={{ fontSize: 26, color: "#23221f", letterSpacing: "-0.5px" }}>
        Reset your password
      </h1>
      <p className="text-sm mb-6" style={{ color: "#4d4b44" }}>
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.3)", color: "#bd463d" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required
            className={FIELD} style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
          />
        </div>

        <button
          type="submit" disabled={disabled}
          className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: disabled ? "#e4e1d8" : "#a07840",
            color:      disabled ? "#9b988e" : "#fdfbf6",
            cursor:     disabled ? "not-allowed" : "pointer",
            boxShadow:  disabled ? "none" : "0 8px 20px -8px rgba(160,120,64,0.55)",
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Check } from "lucide-react";

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0c0c0e" }}>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={120} height={40} style={{ height: "auto" }} />
        </div>

        <div className="rounded-2xl p-8" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          {sent ? (
            <div className="text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4"
                style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.3)" }}>
                <Check size={24} color="#5eb89a" />
              </div>
              <h2 className="font-bold mb-2" style={{ fontSize: 20, color: "#f5f3ee" }}>Check your email</h2>
              <p className="text-sm" style={{ color: "#8a8a94" }}>
                We sent a password reset link to{" "}
                <span style={{ color: "#f5f3ee" }}>{email}</span>.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-colors hover:text-[#c49a5a]"
                style={{ color: "#a07840" }}>
                <ArrowLeft size={13} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 transition-colors hover:text-[#c49a5a]"
                style={{ color: "#8a8a94" }}>
                <ArrowLeft size={12} /> Back to sign in
              </Link>
              <h1 className="font-bold mb-1" style={{ fontSize: 22, color: "#f5f3ee", letterSpacing: "-0.3px" }}>
                Reset your password
              </h1>
              <p className="text-sm mb-6" style={{ color: "#8a8a94" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                  style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: loading || !email ? "#2a2a33" : "#a07840",
                    color:      loading || !email ? "#5c5c64"  : "#f5f3ee",
                    cursor:     loading || !email ? "not-allowed" : "pointer",
                  }}
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

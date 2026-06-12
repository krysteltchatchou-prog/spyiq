"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Chrome, Check } from "lucide-react";

const PERKS = [
  "5-day full Pro trial — no credit card",
  "12,000+ winning products tracked daily",
  "AI-powered store & ad analysis",
];

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  }

  async function handleGoogle() {
    setOauthLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (err) {
      setError("Google sign-in isn't configured yet. Please use email and password.");
      setOauthLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0c0c0e" }}>
        <div className="w-full max-w-[400px] text-center">
          <div className="flex justify-center mb-8">
            <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={120} height={40} style={{ height: "auto" }} />
          </div>
          <div className="rounded-2xl p-8" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4"
              style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.3)" }}>
              <Check size={24} color="#5eb89a" />
            </div>
            <h2 className="font-bold mb-2" style={{ fontSize: 20, color: "#f5f3ee" }}>Check your email</h2>
            <p className="text-sm" style={{ color: "#8a8a94" }}>
              We sent a confirmation link to <span style={{ color: "#f5f3ee" }}>{email}</span>.
              Click it to activate your account and start your free trial.
            </p>
            <Link href="/login"
              className="inline-block mt-6 text-sm font-semibold transition-colors hover:text-[#c49a5a]"
              style={{ color: "#a07840" }}>
              Back to sign in →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#0c0c0e" }}>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={120} height={40} style={{ height: "auto" }} />
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <div className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.25)", color: "#5eb89a" }}>
            5-day free Pro trial
          </div>
          <h1 className="font-bold mb-1 mt-2" style={{ fontSize: 22, color: "#f5f3ee", letterSpacing: "-0.3px" }}>
            Create your account
          </h1>
          <p className="text-sm mb-4" style={{ color: "#8a8a94" }}>
            No credit card required
          </p>

          {/* Perks */}
          <div className="space-y-1.5 mb-5">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-2">
                <Check size={12} color="#5eb89a" />
                <span className="text-xs" style={{ color: "#8a8a94" }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm font-semibold transition-all mb-4"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}
          >
            {oauthLoading ? <Loader2 size={16} className="animate-spin" /> : <Chrome size={16} color="#8a8a94" />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "#2a2a33" }} />
            <span className="text-xs" style={{ color: "#5c5c64" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#2a2a33" }} />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
              />
            </div>
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
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm pr-10 transition-colors"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#5c5c64" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="flex gap-1 mt-1.5">
                  {[8, 12, 16].map((len) => (
                    <div key={len} className="flex-1 rounded-full h-1 transition-colors"
                      style={{ background: password.length >= len ? "#5eb89a" : "#2a2a33" }} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || password.length < 8}
              className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: loading || !name || !email || password.length < 8 ? "#2a2a33" : "#a07840",
                color:      loading || !name || !email || password.length < 8 ? "#5c5c64"  : "#f5f3ee",
                cursor:     loading || !name || !email || password.length < 8 ? "not-allowed" : "pointer",
              }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Creating account…" : "Start free trial"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "#5c5c64" }}>
            By signing up you agree to our{" "}
            <Link href="#" className="underline hover:text-[#8a8a94] transition-colors">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline hover:text-[#8a8a94] transition-colors">Privacy Policy</Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-5" style={{ color: "#8a8a94" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold transition-colors hover:text-[#c49a5a]" style={{ color: "#a07840" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

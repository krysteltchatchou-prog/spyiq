"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Chrome, Check, Link2 } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const PLAN_LABELS: Record<string, string> = {
  free:    "Free plan",
  starter: "Starter plan — $29/mo",
  pro:     "Pro plan — $79/mo",
  agency:  "Agency plan",
};

const FIELD = "w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors";
const fieldStyle = { background: "#ffffff", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" } as const;

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#f4f2ec" }} />}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const plan = (searchParams.get("plan") || "pro").toLowerCase();
  const planLabel = PLAN_LABELS[plan] ?? PLAN_LABELS.pro;
  const productUrl = searchParams.get("url") || "";
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
      options: { data: { full_name: name, selected_plan: plan, pending_product_url: productUrl } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  }

  async function handleGoogle() {
    setOauthLoading(true);
    setError("");
    const supabase = createClient();
    const next = productUrl ? `/store-builder?url=${encodeURIComponent(productUrl)}` : "/dashboard";
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) {
      setError("Google sign-in isn't configured yet. Please use email and password.");
      setOauthLoading(false);
    }
  }

  if (success) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4"
            style={{ background: "rgba(94,184,154,0.14)", border: "1px solid rgba(94,184,154,0.3)" }}>
            <Check size={24} color="#3e8f72" />
          </div>
          <h2 className="font-bold mb-2" style={{ fontSize: 22, color: "#23221f", letterSpacing: "-0.3px" }}>Check your email</h2>
          <p className="text-sm" style={{ color: "#4d4b44" }}>
            We sent a confirmation link to <span style={{ color: "#23221f", fontWeight: 600 }}>{email}</span>.
            Click it to activate your account and start your free trial.
          </p>
          <Link href="/login"
            className="inline-block mt-6 text-sm font-semibold transition-colors hover:text-[#8a6530]"
            style={{ color: "#a07840" }}>
            Back to sign in →
          </Link>
        </div>
      </AuthShell>
    );
  }

  const disabled = loading || !name || !email || password.length < 8;

  return (
    <AuthShell>
      <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.28)", color: "#8a6530" }}>
        {planLabel} · 5-day free trial
      </div>
      <h1 className="font-bold mb-1" style={{ fontSize: 26, color: "#23221f", letterSpacing: "-0.5px" }}>
        Create your account
      </h1>
      <p className="text-sm mb-5" style={{ color: "#4d4b44" }}>
        No credit card required
      </p>

      {/* Product URL continuity from the landing CTA */}
      {productUrl && (
        <div className="flex items-start gap-2 rounded-xl px-3.5 py-2.5 mb-5"
          style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <Link2 size={14} color="#a07840" className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold" style={{ color: "#8a6530" }}>Ready to build from</p>
            <p className="text-xs truncate" style={{ color: "#4d4b44" }}>{productUrl}</p>
          </div>
        </div>
      )}

      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        disabled={oauthLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm font-semibold transition-all mb-4"
        style={{ background: "#ffffff", border: "1px solid #e4e1d8", color: "#23221f" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#cfcabd")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e4e1d8")}
      >
        {oauthLoading ? <Loader2 size={16} className="animate-spin" /> : <Chrome size={16} color="#4d4b44" />}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: "#e4e1d8" }} />
        <span className="text-xs" style={{ color: "#73716a" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "#e4e1d8" }} />
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.3)", color: "#bd463d" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Full name</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name" required
            className={FIELD} style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
          />
        </div>
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
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters" required minLength={8}
              className={`${FIELD} pr-10`} style={fieldStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9b988e" }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {password && (
            <div className="flex gap-1 mt-1.5">
              {[8, 12, 16].map((len) => (
                <div key={len} className="flex-1 rounded-full h-1 transition-colors"
                  style={{ background: password.length >= len ? "#3e8f72" : "#e4e1d8" }} />
              ))}
            </div>
          )}
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
          {loading ? "Creating account…" : "Start free trial"}
        </button>
      </form>

      <p className="text-center text-xs mt-4" style={{ color: "#73716a" }}>
        By signing up you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[#4d4b44] transition-colors">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-[#4d4b44] transition-colors">Privacy Policy</Link>
      </p>

      <p className="text-center text-sm mt-5" style={{ color: "#4d4b44" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold transition-colors hover:text-[#8a6530]" style={{ color: "#a07840" }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

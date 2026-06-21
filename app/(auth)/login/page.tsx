"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Chrome } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const FIELD = "w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors";
const fieldStyle = { background: "#ffffff", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" } as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      if (err.message.includes("Invalid login credentials")) {
        setError("Email or password is incorrect. Double-check them and try again, or create an account if you don't have one yet.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Please check your inbox and click the confirmation link before signing in.");
      } else {
        setError(err.message);
      }
      return;
    }
    router.push("/dashboard");
    router.refresh();
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

  const disabled = loading || !email || !password;

  return (
    <AuthShell>
      <h1 className="font-bold mb-1" style={{ fontSize: 26, color: "#23221f", letterSpacing: "-0.5px" }}>
        Welcome back
      </h1>
      <p className="text-sm mb-6" style={{ color: "#4d4b44" }}>
        Sign in to your SpyIQ account
      </p>

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
        <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.3)", color: "#bd463d" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={FIELD}
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: "#4d4b44" }}>Password</label>
            <Link href="/forgot-password" className="text-xs transition-colors hover:text-[#8a6530]" style={{ color: "#a07840" }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`${FIELD} pr-10`}
              style={fieldStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9b988e" }}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: disabled ? "#e4e1d8" : "#a07840",
            color:      disabled ? "#9b988e" : "#fdfbf6",
            cursor:     disabled ? "not-allowed" : "pointer",
            boxShadow:  disabled ? "none" : "0 8px 20px -8px rgba(160,120,64,0.55)",
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "#4d4b44" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold transition-colors hover:text-[#8a6530]" style={{ color: "#a07840" }}>
          Start free trial
        </Link>
      </p>
    </AuthShell>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Chrome } from "lucide-react";

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
        setError("Email or password is incorrect. Make sure you've confirmed your email after signing up.");
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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0c0c0e" }}
    >
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={120} height={40} style={{ height: "auto" }} />
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: "#f5f3ee", letterSpacing: "-0.3px" }}>
            Welcome back
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8a8a94" }}>
            Sign in to your SpyIQ account
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm font-semibold transition-all mb-4"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}
          >
            {oauthLoading
              ? <Loader2 size={16} className="animate-spin" />
              : <Chrome size={16} color="#8a8a94" />}
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
            <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: "#8a8a94" }}>Password</label>
                <Link href="/forgot-password" className="text-xs transition-colors hover:text-[#c49a5a]" style={{ color: "#a07840" }}>
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
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm pr-10 transition-colors"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#5c5c64" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: loading || !email || !password ? "#2a2a33" : "#a07840",
                color:      loading || !email || !password ? "#5c5c64"  : "#f5f3ee",
                cursor:     loading || !email || !password ? "not-allowed" : "pointer",
              }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-5" style={{ color: "#8a8a94" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold transition-colors hover:text-[#c49a5a]" style={{ color: "#a07840" }}>
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}

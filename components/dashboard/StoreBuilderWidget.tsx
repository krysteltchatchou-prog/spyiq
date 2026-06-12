"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, Check, Loader2, Globe, Palette, Megaphone, ShoppingBag } from "lucide-react";

const STEPS = [
  "Fetching product data",
  "Retrieving images",
  "Generating brand identity",
  "Writing copy",
  "Building home page",
  "Creating ad hooks",
  "Packaging for Shopify",
];

const FEATURES = [
  { icon: Palette,     label: "Brand Identity" },
  { icon: Globe,       label: "Full Copywriting" },
  { icon: Megaphone,   label: "Ad Hooks" },
  { icon: ShoppingBag, label: "Shopify Import" },
];

export function StoreBuilderWidget() {
  const [url, setUrl]         = useState("");
  const [phase, setPhase]     = useState<"idle" | "generating" | "done">("idle");
  const [step, setStep]       = useState(0);

  function handleGenerate() {
    if (!url.trim()) return;
    setPhase("generating");
    setStep(0);
    // Simulate step progression
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i + 1);
        if (i === STEPS.length - 1) setTimeout(() => setPhase("done"), 600);
      }, i * 700 + 400);
    });
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #15151a 0%, #1a1712 100%)",
        border: "1px solid rgba(160,120,64,0.35)",
        boxShadow: "0 0 40px rgba(160,120,64,0.06)",
      }}
    >
      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: "#a07840" }}>
                <Zap size={13} color="#f5f3ee" fill="#f5f3ee" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a07840", letterSpacing: "0.8px" }}>
                AI Store Builder
              </span>
            </div>
            <h3 className="font-bold leading-snug" style={{ fontSize: 17, color: "#f5f3ee", letterSpacing: "-0.3px" }}>
              From any link to a store ready to sell —<br />
              <span style={{ color: "#c49a5a" }}>in 60 seconds</span>
            </h3>
          </div>
          <Link
            href="/store-builder"
            className="shrink-0 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
            style={{ background: "rgba(160,120,64,0.15)", color: "#c49a5a", border: "1px solid rgba(160,120,64,0.25)" }}
          >
            Full builder →
          </Link>
        </div>

        <p className="text-[12px] leading-relaxed mb-5" style={{ color: "#8a8a94" }}>
          Paste an AliExpress, Amazon or Shopify product link. SpyIQ&apos;s AI retrieves the images, writes all the copy,
          builds conversion-optimised blocks, and generates a complete store. Personalise, import to Shopify — and start your first sales.
        </p>

        {/* URL input + CTA */}
        {phase === "idle" && (
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Paste AliExpress, Amazon or Shopify product URL…"
              className="flex-1 rounded-lg px-3 py-2.5 text-sm transition-colors"
              style={{
                background: "#1d1d24",
                border: "1px solid #2a2a33",
                color: "#f5f3ee",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}
            />
            <button
              onClick={handleGenerate}
              disabled={!url.trim()}
              className="shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: url.trim() ? "#a07840" : "#2a2a33",
                color: url.trim() ? "#f5f3ee" : "#5c5c64",
                cursor: url.trim() ? "pointer" : "not-allowed",
              }}
            >
              <Zap size={13} fill={url.trim() ? "#f5f3ee" : "#5c5c64"} />
              Generate Store
            </button>
          </div>
        )}

        {/* Progress screen */}
        {(phase === "generating" || phase === "done") && (
          <div className="rounded-lg p-4" style={{ background: "#0c0c0e", border: "1px solid #2a2a33" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#8a8a94" }}>
              {phase === "done" ? "✅ Store ready!" : "⚡ Generating your store…"}
            </p>
            <div className="space-y-2">
              {STEPS.map((s, i) => {
                const done    = i < step;
                const current = i === step - 1 && phase === "generating";
                return (
                  <div key={s} className="flex items-center gap-2.5">
                    <div className="shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: 16, height: 16, background: done ? "rgba(94,184,154,0.15)" : "#1d1d24", border: `1px solid ${done ? "rgba(94,184,154,0.4)" : "#2a2a33"}` }}>
                      {done
                        ? <Check size={9} color="#5eb89a" />
                        : current
                        ? <Loader2 size={9} color="#a07840" className="animate-spin" />
                        : null}
                    </div>
                    <span className="text-[12px]" style={{ color: done ? "#5eb89a" : current ? "#f5f3ee" : "#3a3a42" }}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
            {phase === "done" && (
              <div className="flex gap-2 mt-4">
                <Link href="/store-builder"
                  className="flex-1 text-center rounded-lg py-2 text-xs font-semibold transition-colors"
                  style={{ background: "#a07840", color: "#f5f3ee" }}>
                  Review & Export
                </Link>
                <button
                  onClick={() => { setPhase("idle"); setUrl(""); setStep(0); }}
                  className="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                  New
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feature mini-cards */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-lg py-3 px-2 text-center"
              style={{ background: "rgba(160,120,64,0.07)", border: "1px solid rgba(160,120,64,0.15)" }}>
              <Icon size={14} color="#a07840" />
              <span className="text-[10px] font-medium leading-tight" style={{ color: "#8a8a94" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

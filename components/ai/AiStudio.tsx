"use client";
import { useState } from "react";
import { NICHES } from "@/lib/constants";

const GENERATORS = [
  { id: "tiktok_hook", label: "TikTok Hook", emoji: "🎵" },
  { id: "facebook_ad", label: "Facebook Ad Copy", emoji: "📘" },
  { id: "product_description", label: "Product Description", emoji: "📝" },
  { id: "store_headline", label: "Store Headline", emoji: "🏷️" },
  { id: "email_subjects", label: "Email Subject Lines", emoji: "✉️" },
  { id: "landing_hero", label: "Landing Page Hero", emoji: "🦸" },
];

const TONES = ["Urgent", "Friendly", "Premium", "Funny", "Bold"];

interface Credits { used: number; limit: number }

export default function AiStudio() {
  const [type, setType] = useState("tiktok_hook");
  const [tone, setTone] = useState("Bold");
  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState(NICHES[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<Credits | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!productName.trim()) { setError("Enter a product or store name first."); return; }
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, productName, niche, tone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); if (data.credits) setCredits(data.credits); }
      else { setOutput(data.output); if (data.credits) setCredits(data.credits); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const card = { background: "#ffffff", border: "1px solid #e4e1d8" } as const;
  const inputStyle = { background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" } as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Controls */}
      <div className="lg:col-span-2 space-y-5">
        {/* Generator type */}
        <div className="rounded-2xl p-5" style={card}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4d4b44" }}>Generator</p>
          <div className="grid grid-cols-2 gap-2">
            {GENERATORS.map((g) => (
              <button key={g.id} onClick={() => setType(g.id)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all"
                style={{
                  background: type === g.id ? "rgba(160,120,64,0.12)" : "#f3f1ea",
                  border: `1px solid ${type === g.id ? "#a07840" : "#e4e1d8"}`,
                  color: type === g.id ? "#8a6530" : "#4d4b44",
                }}>
                <span>{g.emoji}</span>{g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl p-5 space-y-4" style={card}>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Product / store name</label>
            <input value={productName} onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Hydro-Boost Face Serum"
              className="w-full rounded-xl px-3 py-2.5 text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm" style={inputStyle}>
              {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button key={t} onClick={() => setTone(t)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: tone === t ? "#a07840" : "#f3f1ea",
                    border: `1px solid ${tone === t ? "#a07840" : "#e4e1d8"}`,
                    color: tone === t ? "#fdfbf6" : "#4d4b44",
                  }}>{t}</button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-bold transition-all"
            style={{ background: loading ? "#e4e1d8" : "#a07840", color: loading ? "#5d5b54" : "#fdfbf6" }}>
            {loading ? "Generating…" : "✨ Generate"}
          </button>

          {credits && (
            <p className="text-xs text-center" style={{ color: "#5d5b54" }}>
              AI credits: <span style={{ color: "#8a6530" }}>{Math.max(0, credits.limit - credits.used)}</span> of {credits.limit} remaining
            </p>
          )}
        </div>
      </div>

      {/* Output */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl p-6 min-h-[400px] flex flex-col" style={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: "#23221f" }}>
              {GENERATORS.find((g) => g.id === type)?.label} · <span style={{ color: "#4d4b44" }}>{tone}</span>
            </h3>
            {output && (
              <div className="flex gap-2">
                <button onClick={copyOutput}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: copied ? "rgba(94,184,154,0.15)" : "#f3f1ea", border: "1px solid #e4e1d8", color: copied ? "#3e8f72" : "#8a6530" }}>
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
                <button onClick={generate} disabled={loading}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                  🔄 Regenerate
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: "#4d4b44" }}>✨ Writing with market context…</p>
            </div>
          ) : output ? (
            <pre className="text-sm leading-relaxed whitespace-pre-wrap flex-1 font-sans" style={{ color: "#23221f" }}>{output}</pre>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-sm max-w-[280px]" style={{ color: "#5d5b54" }}>
                Pick a generator, enter your product, choose a tone, and hit Generate. SpyIQ pulls the
                top hooks &amp; viral captions in your niche for sharper copy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Search, Zap, Check, ChevronRight, Copy, Download, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "minimalist", emoji: "⬜", label: "Minimalist" },
  { id: "luxury",     emoji: "✨", label: "Luxury"     },
  { id: "bold",       emoji: "🎨", label: "Bold & Colorful" },
  { id: "fitness",    emoji: "💪", label: "Fitness"    },
  { id: "tech",       emoji: "🔵", label: "Tech"       },
  { id: "eco",        emoji: "🌿", label: "Natural/Eco" },
  { id: "pet",        emoji: "🐾", label: "Pet-Friendly" },
  { id: "kids",       emoji: "🧸", label: "Kids"       },
];

const LANGUAGES = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Dutch", "Arabic", "Chinese", "Japanese", "Korean", "Russian"];

const GENERATION_STEPS = [
  "Fetching product data",
  "Generating brand identity",
  "Writing product copy",
  "Building home page",
  "Creating ad hooks",
  "Packaging for Shopify",
];

const FEATURE_CARDS = [
  { emoji: "🎨", label: "Brand Identity",  desc: "Name, tagline, colors, typography" },
  { emoji: "✍️", label: "Full Copywriting", desc: "Product pages, home, FAQ & policies" },
  { emoji: "📣", label: "Ad Hooks",         desc: "Facebook, TikTok & email copy" },
  { emoji: "📦", label: "Shopify Import",   desc: "One-click export to your store" },
];

type Step = 1 | 2 | 3 | 4;

interface GeneratedStore {
  brand: { store_name: string; tagline: string; color_palette: string[]; font_display: string; font_body: string; brand_voice: string };
  product_page: { seo_title: string; meta_description: string; headline: string; description_p1: string; description_p2: string; description_p3: string; bullets: string[]; faq: { q: string; a: string }[] };
  home_page: { hero_headline: string; hero_sub: string; features: { icon: string; title: string; body: string }[]; social_proof: string; cta_primary: string; cta_secondary: string };
  ads: { facebook: string[]; tiktok: string[]; email_subjects: string[] };
  policies: { shipping_blurb: string; returns_blurb: string; trust_badges: string[] };
}

export default function StoreBuilderPage() {
  const [step, setStep] = useState<Step>(1);
  const [productInput, setProductInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("minimalist");
  const [storeName, setStoreName] = useState("");
  const [language, setLanguage] = useState("English");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<GeneratedStore | null>(null);
  const [activeResultTab, setActiveResultTab] = useState("Brand");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  function copyText(key: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function downloadTxt() {
    if (!result) return;
    const content = [
      `STORE: ${result.brand.store_name}`,
      `TAGLINE: ${result.brand.tagline}`,
      `BRAND VOICE: ${result.brand.brand_voice}`,
      `\n--- PRODUCT PAGE ---`,
      `SEO Title: ${result.product_page.seo_title}`,
      `Meta Description: ${result.product_page.meta_description}`,
      `Headline: ${result.product_page.headline}`,
      `\n${result.product_page.description_p1}`,
      `\n${result.product_page.description_p2}`,
      `\n${result.product_page.description_p3}`,
      `\nBullets:\n${result.product_page.bullets.map((b) => `• ${b}`).join("\n")}`,
      `\n--- ADS ---`,
      `Facebook:\n${result.ads.facebook.join("\n\n")}`,
      `TikTok:\n${result.ads.tiktok.join("\n\n")}`,
      `Email Subjects:\n${result.ads.email_subjects.join("\n")}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${result.brand.store_name}-store-copy.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  async function startGeneration() {
    setStep(3);
    setError("");
    setCompletedSteps([]);
    setCurrentStep(0);

    try {
      const res = await fetch("/api/ai/store-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productInput, style: selectedStyle, storeName, language }),
      });

      if (!res.ok) throw new Error("API request failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let stepIndex = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          if (raw === "[DONE]") break;
          try {
            const msg = JSON.parse(raw);
            if (msg.type === "step") {
              setCompletedSteps((prev) => [...prev, stepIndex - 1].filter((n) => n >= 0));
              setCurrentStep(stepIndex);
              stepIndex++;
            } else if (msg.type === "result") {
              setCompletedSteps(GENERATION_STEPS.map((_, i) => i));
              setResult(msg.data);
              setStep(4);
            } else if (msg.type === "error") {
              throw new Error(msg.message);
            }
          } catch (parseErr) {
            // skip non-JSON lines
          }
        }
      }
    } catch (err) {
      setError("Generation failed. Please try again.");
      toast.error("Store generation failed. Please try again.");
      setStep(2);
      setCompletedSteps([]);
    }
  }

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>AI Store Builder</h1>
        <p className="text-sm" style={{ color: "#8a8a94" }}>From any product to a launch-ready Shopify store — powered by Claude Sonnet 4.6.</p>
      </div>

      {/* Hero card (steps 1–2 only) */}
      {step <= 2 && (
        <div className="rounded-2xl p-8 mb-8" style={{
          background: "linear-gradient(135deg, #15151a 0%, #1d1d24 100%)",
          border: "1px solid #a07840",
        }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(160,120,64,0.15)", border: "1px solid rgba(160,120,64,0.3)" }}>
              ⚡
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1" style={{ color: "#f5f3ee" }}>
                From any link to a store ready to sell — in 60 seconds
              </h2>
              <p className="text-sm" style={{ color: "#8a8a94" }}>
                Paste any product link or type a product name. SpyIQ AI retrieves data, writes all the copy, builds conversion-optimised pages, and generates a complete store.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEATURE_CARDS.map((f) => (
              <div key={f.label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(160,120,64,0.06)", border: "1px solid rgba(160,120,64,0.15)" }}>
                <div className="text-xl mb-1">{f.emoji}</div>
                <p className="text-xs font-semibold" style={{ color: "#f5f3ee" }}>{f.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#8a8a94" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step progress */}
      {step < 3 && (
        <div className="flex items-center gap-2 mb-6">
          {([1, 2] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: step >= s ? "#a07840" : "#2a2a33", color: step >= s ? "#f5f3ee" : "#5c5c64" }}>
                {s}
              </div>
              <span className="text-xs font-medium" style={{ color: step === s ? "#f5f3ee" : "#5c5c64" }}>
                {s === 1 ? "Pick Product" : "Store Style"}
              </span>
              {s < 2 && <ChevronRight size={14} color="#3a3a42" />}
            </div>
          ))}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Step 1 — Pick Product */}
      {step === 1 && (
        <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Step 1 — Pick Your Product</h2>
          <div className="flex gap-3 mb-5">
            <div className="flex-1 relative">
              <Search size={15} color="#5c5c64" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && productInput.trim() && setStep(2)}
                placeholder="Paste AliExpress/Amazon link, or type a product name"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
              />
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: "#5c5c64" }}>Or pick a popular product:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { emoji: "🧴", name: "Hydro-Boost Face Serum",  niche: "Beauty",  score: 94 },
              { emoji: "💡", name: "LED Sunset Lamp",          niche: "Home",    score: 88 },
              { emoji: "🦮", name: "Auto Pet Feeder Pro",      niche: "Pets",    score: 91 },
            ].map((p) => (
              <button key={p.name}
                onClick={() => setProductInput(p.name)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: productInput === p.name ? "rgba(160,120,64,0.12)" : "#1d1d24",
                  border: `1px solid ${productInput === p.name ? "#a07840" : "#2a2a33"}`,
                }}>
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#f5f3ee" }}>{p.name}</p>
                  <p className="text-[10px]" style={{ color: "#5c5c64" }}>{p.niche} · IQ {p.score}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!productInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: productInput.trim() ? "#a07840" : "#2a2a33",
                color:      productInput.trim() ? "#f5f3ee" : "#5c5c64",
                cursor:     productInput.trim() ? "pointer" : "not-allowed",
              }}>
              Next: Choose Style <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Store Style */}
      {step === 2 && (
        <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <h2 className="font-semibold mb-5" style={{ color: "#f5f3ee" }}>Step 2 — Choose Your Store Style</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#8a8a94" }}>Store Name <span style={{ color: "#5c5c64" }}>(optional — AI will generate one)</span></label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder='e.g. "GlowDrop" — leave blank for AI suggestion'
                className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#8a8a94" }}>Visual Style</label>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map((s) => (
                  <button key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all"
                    style={{
                      background: selectedStyle === s.id ? "rgba(160,120,64,0.12)" : "#1d1d24",
                      border: `1px solid ${selectedStyle === s.id ? "#a07840" : "#2a2a33"}`,
                    }}>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-[10px] font-medium text-center"
                      style={{ color: selectedStyle === s.id ? "#c49a5a" : "#8a8a94" }}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#8a8a94" }}>Language</label>
              <div className="flex gap-2 flex-wrap">
                {LANGUAGES.map((l) => (
                  <button key={l}
                    onClick={() => setLanguage(l)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: language === l ? "rgba(160,120,64,0.15)" : "#1d1d24",
                      border: `1px solid ${language === l ? "#a07840" : "#2a2a33"}`,
                      color: language === l ? "#c49a5a" : "#8a8a94",
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setStep(1)}
              className="text-sm font-medium transition-colors hover:text-[#c49a5a]"
              style={{ color: "#8a8a94" }}>
              ← Back
            </button>
            <button
              onClick={startGeneration}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#a07840", color: "#f5f3ee" }}>
              <Zap size={15} /> Generate Store with AI
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Generation progress */}
      {step === 3 && (
        <div className="rounded-2xl p-8 text-center" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: "rgba(160,120,64,0.15)", border: "1px solid rgba(160,120,64,0.3)" }}>
            ⚡
          </div>
          <h2 className="font-bold text-lg mb-1" style={{ color: "#f5f3ee" }}>Building your store with AI…</h2>
          <p className="text-sm mb-8" style={{ color: "#8a8a94" }}>Claude Sonnet 4.6 is generating your complete store. Usually takes 30–60 seconds.</p>
          <div className="max-w-[360px] mx-auto space-y-3 text-left">
            {GENERATION_STEPS.map((label, i) => {
              const done = completedSteps.includes(i);
              const active = currentStep === i && !done;
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: done ? "#5eb89a" : active ? "rgba(160,120,64,0.2)" : "#2a2a33",
                      border: `1px solid ${done ? "#5eb89a" : active ? "#a07840" : "#2a2a33"}`,
                    }}>
                    {done   ? <Check size={11} color="#fff" />
                    : active ? <Loader2 size={10} color="#a07840" className="animate-spin" />
                    : null}
                  </div>
                  <span className="text-sm" style={{ color: done ? "#f5f3ee" : active ? "#c49a5a" : "#5c5c64" }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4 — Results */}
      {step === 4 && result && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-xl" style={{ color: "#f5f3ee" }}>{result.brand.store_name} is ready!</h2>
              <p className="text-sm" style={{ color: "#8a8a94" }}>Your complete store copy, branding, and ads — generated by Claude.</p>
            </div>
            <button
              onClick={() => { setStep(1); setResult(null); setProductInput(""); setStoreName(""); }}
              className="text-xs font-semibold hover:text-[#c49a5a] transition-colors"
              style={{ color: "#a07840" }}>
              ← Build Another
            </button>
          </div>

          {/* Result tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl flex-wrap"
            style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
            {["Brand", "Product Page", "Home Page", "Ads", "Export"].map((t) => (
              <button key={t}
                onClick={() => setActiveResultTab(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeResultTab === t ? "#a07840" : "transparent",
                  color:      activeResultTab === t ? "#f5f3ee" : "#8a8a94",
                }}>
                {t}
              </button>
            ))}
          </div>

          {activeResultTab === "Brand" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-2xl" style={{ color: "#f5f3ee" }}>{result.brand.store_name}</h2>
                    <p className="text-sm italic mt-1" style={{ color: "#8a8a94" }}>&ldquo;{result.brand.tagline}&rdquo;</p>
                  </div>
                  <button onClick={() => copyText("brand", `${result.brand.store_name}\n"${result.brand.tagline}"`)}
                    className="p-2 rounded-lg" style={{ color: copiedKey === "brand" ? "#5eb89a" : "#5c5c64" }}>
                    {copiedKey === "brand" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {result.brand.color_palette.map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg" title={c}
                      style={{ background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                  ))}
                  <span className="text-xs ml-2" style={{ color: "#5c5c64" }}>Brand palette</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                    <p className="text-xs" style={{ color: "#5c5c64" }}>Display Font</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "#f5f3ee" }}>{result.brand.font_display}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                    <p className="text-xs" style={{ color: "#5c5c64" }}>Body Font</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "#f5f3ee" }}>{result.brand.font_body}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                  <p className="text-xs mb-1" style={{ color: "#5c5c64" }}>Brand Voice</p>
                  <p className="text-sm" style={{ color: "#f5f3ee" }}>{result.brand.brand_voice}</p>
                </div>
              </div>
            </div>
          )}

          {activeResultTab === "Product Page" && (
            <div className="space-y-4">
              {[
                { label: "SEO Title",        key: "seo",  text: result.product_page.seo_title },
                { label: "Meta Description", key: "meta", text: result.product_page.meta_description },
                { label: "Headline",         key: "hl",   text: result.product_page.headline },
                { label: "Description (p1)", key: "d1",   text: result.product_page.description_p1 },
                { label: "Description (p2)", key: "d2",   text: result.product_page.description_p2 },
                { label: "Description (p3)", key: "d3",   text: result.product_page.description_p3 },
              ].map((item) => (
                <div key={item.key} className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5c5c64" }}>{item.label}</p>
                    <button onClick={() => copyText(item.key, item.text)}
                      className="p-1.5 rounded-lg" style={{ color: copiedKey === item.key ? "#5eb89a" : "#5c5c64" }}>
                      {copiedKey === item.key ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#f5f3ee" }}>{item.text}</p>
                </div>
              ))}
              <div className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5c5c64" }}>Bullet Points</p>
                  <button onClick={() => copyText("bullets", result.product_page.bullets.map((b) => `• ${b}`).join("\n"))}
                    className="p-1.5 rounded-lg" style={{ color: copiedKey === "bullets" ? "#5eb89a" : "#5c5c64" }}>
                    {copiedKey === "bullets" ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <ul className="space-y-2">
                  {result.product_page.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#f5f3ee" }}>
                      <span style={{ color: "#5eb89a" }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5c5c64" }}>FAQ (5 Q&As)</p>
                <div className="space-y-3">
                  {result.product_page.faq.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#c49a5a" }}>Q: {item.q}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#8a8a94" }}>A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeResultTab === "Home Page" && (
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              {[
                { label: "Hero Headline",    key: "hh",   text: result.home_page.hero_headline },
                { label: "Hero Sub",         key: "hs",   text: result.home_page.hero_sub },
                { label: "Social Proof",     key: "sp",   text: result.home_page.social_proof },
                { label: "Primary CTA",      key: "cta1", text: result.home_page.cta_primary },
                { label: "Secondary CTA",    key: "cta2", text: result.home_page.cta_secondary },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-3 p-3 rounded-xl"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#5c5c64" }}>{item.label}</p>
                    <p className="text-sm" style={{ color: "#f5f3ee" }}>{item.text}</p>
                  </div>
                  <button onClick={() => copyText(item.key, item.text)}
                    className="p-1.5 flex-shrink-0" style={{ color: copiedKey === item.key ? "#5eb89a" : "#5c5c64" }}>
                    {copiedKey === item.key ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5c5c64" }}>Feature Blocks</p>
                {result.home_page.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl mb-2"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{f.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8a8a94" }}>{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeResultTab === "Ads" && (
            <div className="space-y-5">
              {[
                { platform: "Facebook Hooks", key: "fb", hooks: result.ads.facebook },
                { platform: "TikTok Hooks",   key: "tt", hooks: result.ads.tiktok },
                { platform: "Email Subjects",  key: "em", hooks: result.ads.email_subjects },
              ].map((section) => (
                <div key={section.key} className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5c5c64" }}>{section.platform}</p>
                  <div className="space-y-2">
                    {section.hooks.map((hook, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                        <p className="text-sm flex-1 leading-relaxed" style={{ color: "#f5f3ee" }}>&ldquo;{hook}&rdquo;</p>
                        <button onClick={() => copyText(`${section.key}-${i}`, hook)}
                          className="p-1.5 flex-shrink-0" style={{ color: copiedKey === `${section.key}-${i}` ? "#5eb89a" : "#5c5c64" }}>
                          {copiedKey === `${section.key}-${i}` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeResultTab === "Export" && (
            <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Export Your Store</h2>
              <div className="space-y-3">
                {[
                  { emoji: "📋", label: "Copy All Copy",        desc: "Copy everything to clipboard",          action: "copy"    },
                  { emoji: "📄", label: "Download as .txt",     desc: "All copy in a plain text file",         action: "txt"     },
                  { emoji: "🔗", label: "Push to Shopify",      desc: "Connect your store in Settings first",  action: "shopify", disabled: true },
                ].map((opt) => (
                  <div key={opt.label} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", opacity: opt.disabled ? 0.5 : 1 }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{opt.label}</p>
                        <p className="text-xs" style={{ color: "#5c5c64" }}>{opt.desc}</p>
                      </div>
                    </div>
                    <button
                      disabled={opt.disabled}
                      onClick={() => {
                        if (opt.action === "copy") {
                          copyText("all", JSON.stringify(result, null, 2));
                        } else if (opt.action === "txt") {
                          downloadTxt();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: opt.disabled ? "#2a2a33" : "#a07840",
                        color:      opt.disabled ? "#5c5c64"  : "#f5f3ee",
                        cursor:     opt.disabled ? "not-allowed" : "pointer",
                      }}>
                      {opt.action === "copy" && copiedKey === "all" ? <Check size={12} /> : <Download size={12} />}
                      {opt.action === "copy" ? (copiedKey === "all" ? "Copied!" : "Copy All") : opt.action === "txt" ? "Download" : "Connect Store"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

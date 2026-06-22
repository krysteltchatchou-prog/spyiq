"use client";
import { useState, useEffect, type FocusEvent, type ReactNode } from "react";
import { Search, Zap, Check, ChevronRight, Copy, Download, Loader2, AlertCircle, Store } from "lucide-react";
import { toast } from "sonner";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

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
  product_page: { seo_title: string; meta_description: string; headline: string; description_p1: string; description_p2: string; description_p3: string; bullets: string[]; faq: { q: string; a: string }[]; price?: string; compare_price?: string; images?: string[] };
  home_page: { hero_headline: string; hero_sub: string; features: { icon: string; title: string; body: string }[]; social_proof: string; cta_primary: string; cta_secondary: string; announcement?: string; rating?: string; review_count?: string; reviews?: { name: string; text: string }[]; steps?: { title: string; body: string }[]; comparison?: string[]; stats?: { value: string; label: string }[]; hero_image?: string };
  ads: { facebook: string[]; tiktok: string[]; email_subjects: string[] };
  policies: { shipping_blurb: string; returns_blurb: string; trust_badges: string[] };
}

// Default content for the extra storefront sections (Reviews, How It Works,
// Comparison, Statistics). The AI doesn't generate these yet, so we seed them
// with editable placeholders when a store is created.
const DEFAULT_REVIEWS = [
  { name: "Sarah M.", text: "Absolutely love it — exceeded my expectations. Worth every penny!" },
  { name: "James T.", text: "Fast shipping and the quality is fantastic. Highly recommend." },
  { name: "Lena K.", text: "Best purchase I've made this year. Will order again." },
];
const DEFAULT_STEPS = [
  { title: "Order today", body: "Choose your options and check out in seconds." },
  { title: "We ship fast", body: "Dispatched within 24 hours with full tracking." },
  { title: "Enjoy", body: "Loved by thousands of happy customers worldwide." },
];
const DEFAULT_COMPARISON = ["Premium quality", "Fast worldwide shipping", "30-day money-back", "24/7 customer support", "Secure checkout"];
const DEFAULT_STATS = [
  { value: "50,000+", label: "Happy customers" },
  { value: "4.8★", label: "Average rating" },
  { value: "30-Day", label: "Money-back guarantee" },
];

// A small labelled input used throughout the visual editor's left panel.
function EditField({ label, value, onChange, textarea, rows }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  const cls = "w-full rounded-lg px-3 py-2 text-sm";
  const style = { background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" };
  const onFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "#a07840"; };
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "#2a2a33"; };
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#5c5c64" }}>{label}</span>
      {textarea ? (
        <textarea rows={rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} style={style} onFocus={onFocus} onBlur={onBlur} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} style={style} onFocus={onFocus} onBlur={onBlur} />
      )}
    </label>
  );
}

// A collapsible section card for grouping related fields in the editor.
function EditSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="rounded-xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold select-none list-none" style={{ color: "#f5f3ee" }}>
        {title}
      </summary>
      <div className="px-4 pb-4 space-y-3">{children}</div>
    </details>
  );
}

// Reads a chosen image file into a data URL so it can be stored and previewed
// without uploading anywhere yet.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lets the user upload images (e.g. ones made on Creative Fabrica) and shows
// removable thumbnails. `max` caps how many can be added.
function ImageUploader({ images, onChange, max }: {
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  const canAdd = !max || images.length < max;
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((src, i) => (
        <div key={i} className="relative" style={{ width: 56, height: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover rounded-md" style={{ border: "1px solid #2a2a33" }} />
          <button onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: "#d4685f", color: "#fff" }}>×</button>
        </div>
      ))}
      {canAdd && (
        <label className="flex items-center justify-center cursor-pointer rounded-md text-lg"
          style={{ width: 56, height: 56, border: "1px dashed #3a3a42", color: "#8a8a94" }}>
          +
          <input type="file" accept="image/*" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.currentTarget.value = "";
              if (f) onChange([...images, await fileToDataUrl(f)]);
            }} />
        </label>
      )}
    </div>
  );
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
  const [activeResultTab, setActiveResultTab] = useState("Editor");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activePage, setActivePage] = useState<"home" | "product">("home");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pushing, setPushing] = useState(false);
  const [publishingStore, setPublishingStore] = useState(false);

  // Pre-fill the product link when arriving from the landing CTA / signup
  // (e.g. /store-builder?url=…), so a new user's first store builds from the
  // product they pasted on the marketing page.
  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("url");
    if (u) setProductInput(u);
  }, []);

  // Publishes the whole store: creates the product AND writes the generated
  // homepage into the connected Shopify store's live theme.
  async function publishFullStore() {
    if (!result || publishingStore) return;
    setPublishingStore(true);
    try {
      const res = await fetch("/api/shopify/publish-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store: result }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Store published! Opening your live storefront…");
        if (data.storeUrl) window.open(data.storeUrl, "_blank");
      } else if (data.needsReconnect) {
        toast.error("Reconnect Shopify in Settings → Integrations to allow theme publishing.");
      } else if (res.status === 409 || data.needsConnection) {
        toast.error("Connect your Shopify store in Settings → Integrations first.");
      } else {
        toast.error(data.error || "Publishing the store failed.");
      }
    } catch {
      toast.error("Publishing the store failed. Please try again.");
    } finally {
      setPublishingStore(false);
    }
  }

  async function pushToShopify() {
    if (!result || pushing) return;
    setPushing(true);
    try {
      const res = await fetch("/api/shopify/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store: result }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Pushed to Shopify as a draft product!");
        if (data.productUrl) window.open(data.productUrl, "_blank");
      } else if (res.status === 409 || data.needsConnection) {
        toast.error("Connect your Shopify store in Settings → Integrations first.");
      } else {
        toast.error(data.error || "Push to Shopify failed.");
      }
    } catch {
      toast.error("Push to Shopify failed. Please try again.");
    } finally {
      setPushing(false);
    }
  }

  // Edits a copy of the generated store so the live preview updates instantly.
  function updateResult(mutate: (draft: GeneratedStore) => void) {
    setResult((prev) => {
      if (!prev) return prev;
      const next: GeneratedStore = structuredClone(prev);
      mutate(next);
      return next;
    });
  }

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
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Accumulate across network chunks: a single SSE event (especially the
        // large final result) can be split across reads. Events are separated
        // by a blank line; keep the trailing, possibly-incomplete event buffered.
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const dataLine = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!dataLine) continue;
          const raw = dataLine.slice(6);
          if (raw === "[DONE]") continue;
          try {
            const msg = JSON.parse(raw);
            if (msg.type === "step") {
              setCompletedSteps((prev) => [...prev, stepIndex - 1].filter((n) => n >= 0));
              setCurrentStep(stepIndex);
              stepIndex++;
            } else if (msg.type === "result") {
              setCompletedSteps(GENERATION_STEPS.map((_, i) => i));
              const data: GeneratedStore = msg.data;
              // Seed the extra storefront sections so they're editable right away.
              data.home_page.announcement ??= "Free shipping on orders over $50 · Fast worldwide delivery";
              data.home_page.rating ??= "4.8";
              data.home_page.review_count ??= "12,480";
              data.home_page.reviews ??= structuredClone(DEFAULT_REVIEWS);
              data.home_page.steps ??= structuredClone(DEFAULT_STEPS);
              data.home_page.comparison ??= [...DEFAULT_COMPARISON];
              data.home_page.stats ??= structuredClone(DEFAULT_STATS);
              data.product_page.price ??= "39.99";
              data.product_page.compare_price ??= "59.99";
              setResult(data);
              setStep(4);
            } else if (msg.type === "error") {
              // Surface the failure instead of hanging on the progress screen.
              setError("Store generation failed — please try again.");
              toast.error("Store generation failed. Please try again.");
              setStep(2);
              setCompletedSteps([]);
              return;
            }
          } catch {
            // skip non-JSON lines
          }
        }
      }
    } catch {
      setError("Generation failed. Please try again.");
      toast.error("Store generation failed. Please try again.");
      setStep(2);
      setCompletedSteps([]);
    }
  }

  return (
    <div className={step === 4 ? "max-w-[1200px]" : "max-w-[900px]"}>
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

          <AiEstimateBadge variant="banner" className="mb-5" />

          {/* Result tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl flex-wrap"
            style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
            {["Editor", "Brand", "Product Page", "Home Page", "Ads", "Export"].map((t) => (
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

          {activeResultTab === "Editor" && (() => {
            const palette = result.brand.color_palette ?? [];
            const accent = palette[0] || "#a07840";
            const accent2 = palette[1] || accent;
            const features = result.home_page.features ?? [];
            const bullets = result.product_page.bullets ?? [];
            const faqs = result.product_page.faq ?? [];
            const badges = result.policies?.trust_badges ?? [];
            const displayFont = `${result.brand.font_display}, Georgia, serif`;
            const bodyFont = `${result.brand.font_body}, system-ui, sans-serif`;
            const slug = result.brand.store_name.toLowerCase().replace(/[^a-z0-9]+/g, "");
            const price = result.product_page.price ?? "39.99";
            const comparePrice = result.product_page.compare_price ?? "";
            const priceNum = parseFloat(price);
            const compNum = parseFloat(comparePrice);
            const savePct = comparePrice && compNum > priceNum ? Math.round((1 - priceNum / compNum) * 100) : 0;
            return (
              <div>
                {/* Page switcher — edit the Home page or the Product page */}
                <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
                  {([["home", "🏠 Home Page"], ["product", "🛍️ Product Page"]] as const).map(([id, label]) => (
                    <button key={id}
                      onClick={() => setActivePage(id)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: activePage === id ? "#a07840" : "transparent",
                        color:      activePage === id ? "#f5f3ee" : "#8a8a94",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

              <div className="flex flex-col lg:flex-row gap-5">
                {/* LEFT — live editor panel */}
                <div className="lg:w-[330px] lg:flex-shrink-0 space-y-3 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-1">
                  <EditSection title="📢 Announcement Bar">
                    <EditField label="Top banner text (leave blank to hide)" value={result.home_page.announcement ?? "Free shipping on orders over $50 · Fast worldwide delivery"} onChange={(v) => updateResult((d) => { d.home_page.announcement = v; })} />
                  </EditSection>

                  <EditSection title="🏷️ Brand">
                    <EditField label="Store name" value={result.brand.store_name} onChange={(v) => updateResult((d) => { d.brand.store_name = v; })} />
                    <EditField label="Tagline" value={result.brand.tagline} onChange={(v) => updateResult((d) => { d.brand.tagline = v; })} />
                  </EditSection>

                  {activePage === "home" && (
                  <>
                  <EditSection title="🎯 Hero">
                    <EditField label="Headline" textarea rows={2} value={result.home_page.hero_headline} onChange={(v) => updateResult((d) => { d.home_page.hero_headline = v; })} />
                    <EditField label="Sub-text" textarea value={result.home_page.hero_sub} onChange={(v) => updateResult((d) => { d.home_page.hero_sub = v; })} />
                    <EditField label="Primary button" value={result.home_page.cta_primary} onChange={(v) => updateResult((d) => { d.home_page.cta_primary = v; })} />
                    <EditField label="Secondary button" value={result.home_page.cta_secondary} onChange={(v) => updateResult((d) => { d.home_page.cta_secondary = v; })} />
                    <EditField label="Social proof bar" value={result.home_page.social_proof} onChange={(v) => updateResult((d) => { d.home_page.social_proof = v; })} />
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#5c5c64" }}>Hero image (optional)</span>
                      <ImageUploader max={1} images={result.home_page.hero_image ? [result.home_page.hero_image] : []} onChange={(next) => updateResult((d) => { d.home_page.hero_image = next[0]; })} />
                    </div>
                  </EditSection>

                  <EditSection title="⭐ Reviews">
                    <div className="flex gap-3">
                      <div className="flex-1"><EditField label="Rating" value={result.home_page.rating ?? "4.8"} onChange={(v) => updateResult((d) => { d.home_page.rating = v; })} /></div>
                      <div className="flex-1"><EditField label="# of reviews" value={result.home_page.review_count ?? ""} onChange={(v) => updateResult((d) => { d.home_page.review_count = v; })} /></div>
                    </div>
                    {(result.home_page.reviews ?? []).map((r, i) => (
                      <div key={i} className="space-y-2 pb-3" style={{ borderBottom: i < (result.home_page.reviews?.length ?? 0) - 1 ? "1px solid #2a2a33" : "none" }}>
                        <EditField label={`Review ${i + 1} — name`} value={r.name} onChange={(v) => updateResult((d) => { if (d.home_page.reviews) d.home_page.reviews[i].name = v; })} />
                        <EditField label="Text" textarea value={r.text} onChange={(v) => updateResult((d) => { if (d.home_page.reviews) d.home_page.reviews[i].text = v; })} />
                      </div>
                    ))}
                  </EditSection>

                  <EditSection title="🔧 How It Works">
                    {(result.home_page.steps ?? []).map((s, i) => (
                      <div key={i} className="space-y-2 pb-3" style={{ borderBottom: i < (result.home_page.steps?.length ?? 0) - 1 ? "1px solid #2a2a33" : "none" }}>
                        <EditField label={`Step ${i + 1} — title`} value={s.title} onChange={(v) => updateResult((d) => { if (d.home_page.steps) d.home_page.steps[i].title = v; })} />
                        <EditField label="Body" textarea value={s.body} onChange={(v) => updateResult((d) => { if (d.home_page.steps) d.home_page.steps[i].body = v; })} />
                      </div>
                    ))}
                  </EditSection>

                  <EditSection title="✨ Features">
                    {result.home_page.features.map((f, i) => (
                      <div key={i} className="space-y-2 pb-3" style={{ borderBottom: i < result.home_page.features.length - 1 ? "1px solid #2a2a33" : "none" }}>
                        <EditField label={`Feature ${i + 1} — icon (emoji)`} value={f.icon} onChange={(v) => updateResult((d) => { d.home_page.features[i].icon = v; })} />
                        <EditField label="Title" value={f.title} onChange={(v) => updateResult((d) => { d.home_page.features[i].title = v; })} />
                        <EditField label="Body" textarea value={f.body} onChange={(v) => updateResult((d) => { d.home_page.features[i].body = v; })} />
                      </div>
                    ))}
                  </EditSection>

                  <EditSection title="📊 Comparison Table">
                    {(result.home_page.comparison ?? []).map((c, i) => (
                      <EditField key={i} label={`Row ${i + 1}`} value={c} onChange={(v) => updateResult((d) => { if (d.home_page.comparison) d.home_page.comparison[i] = v; })} />
                    ))}
                  </EditSection>

                  <EditSection title="📈 Statistics">
                    {(result.home_page.stats ?? []).map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-1"><EditField label={`Stat ${i + 1} — value`} value={s.value} onChange={(v) => updateResult((d) => { if (d.home_page.stats) d.home_page.stats[i].value = v; })} /></div>
                        <div className="flex-1"><EditField label="Label" value={s.label} onChange={(v) => updateResult((d) => { if (d.home_page.stats) d.home_page.stats[i].label = v; })} /></div>
                      </div>
                    ))}
                  </EditSection>
                  </>
                  )}

                  {activePage === "product" && (
                  <>
                  <EditSection title="🛍️ Product">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#5c5c64" }}>Product images (upload from Creative Fabrica)</span>
                      <ImageUploader images={result.product_page.images ?? []} onChange={(next) => updateResult((d) => { d.product_page.images = next; })} />
                    </div>
                    <EditField label="Headline" value={result.product_page.headline} onChange={(v) => updateResult((d) => { d.product_page.headline = v; })} />
                    <div className="flex gap-3">
                      <div className="flex-1"><EditField label="Sale price ($)" value={price} onChange={(v) => updateResult((d) => { d.product_page.price = v; })} /></div>
                      <div className="flex-1"><EditField label="Compare-at ($)" value={comparePrice} onChange={(v) => updateResult((d) => { d.product_page.compare_price = v; })} /></div>
                    </div>
                    <EditField label="Description" textarea rows={4} value={result.product_page.description_p1} onChange={(v) => updateResult((d) => { d.product_page.description_p1 = v; })} />
                    {result.product_page.bullets.map((b, i) => (
                      <EditField key={i} label={`Bullet ${i + 1}`} value={b} onChange={(v) => updateResult((d) => { d.product_page.bullets[i] = v; })} />
                    ))}
                  </EditSection>

                  <EditSection title="❓ FAQ">
                    {result.product_page.faq.map((item, i) => (
                      <div key={i} className="space-y-2 pb-3" style={{ borderBottom: i < result.product_page.faq.length - 1 ? "1px solid #2a2a33" : "none" }}>
                        <EditField label={`Question ${i + 1}`} value={item.q} onChange={(v) => updateResult((d) => { d.product_page.faq[i].q = v; })} />
                        <EditField label="Answer" textarea value={item.a} onChange={(v) => updateResult((d) => { d.product_page.faq[i].a = v; })} />
                      </div>
                    ))}
                  </EditSection>
                  </>
                  )}
                </div>

                {/* RIGHT — live preview */}
                <div className="flex-1 min-w-0">
                <p className="text-xs mb-3" style={{ color: "#5c5c64" }}>
                  Edit any field on the left — the preview updates live. This is a preview inside SpyIQ; use the <strong style={{ color: "#8a8a94" }}>Export</strong> tab to put it on a real Shopify site.
                </p>
                {/* Device toggle — switch the preview between desktop and phone width */}
                <div className="flex items-center gap-1 mb-3 p-1 rounded-lg" style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button key={d}
                      onClick={() => setPreviewDevice(d)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all"
                      style={{
                        background: previewDevice === d ? "#a07840" : "transparent",
                        color:      previewDevice === d ? "#f5f3ee" : "#8a8a94",
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
                {/* Browser-window mockup */}
                <div className="rounded-2xl overflow-hidden mx-auto transition-all" style={{ border: "1px solid #2a2a33", background: "#ffffff", maxWidth: previewDevice === "mobile" ? 390 : "100%" }}>
                  {/* Fake browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#e9e9ee", borderBottom: "1px solid #d4d4dc" }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                    <div className="flex-1 mx-3 px-3 py-1 rounded-md text-xs text-center" style={{ background: "#ffffff", color: "#8a8a94" }}>
                      www.{slug}.com
                    </div>
                  </div>

                  {/* Storefront body (light theme) */}
                  <div style={{ background: "#ffffff", color: "#1a1a1a", fontFamily: bodyFont }}>
                    {/* Announcement bar */}
                    {(result.home_page.announcement ?? "Free shipping on orders over $50 · Fast worldwide delivery") && (
                      <div className="px-4 py-2 text-center font-medium" style={{ background: accent, color: "#fff", fontSize: 12 }}>
                        {result.home_page.announcement ?? "Free shipping on orders over $50 · Fast worldwide delivery"}
                      </div>
                    )}
                    {/* Nav */}
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #eee" }}>
                      <span className="font-bold text-lg" style={{ color: accent, fontFamily: displayFont, letterSpacing: "-0.3px" }}>
                        {result.brand.store_name}
                      </span>
                      <div className="hidden sm:flex items-center gap-5 text-sm" style={{ color: "#555" }}>
                        <span>Shop</span><span>About</span><span>Contact</span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: accent, color: "#fff" }}>Cart (0)</span>
                      </div>
                    </div>

                    {activePage === "home" && (
                    <>
                    {/* Hero */}
                    <div className="px-6 py-12 text-center" style={{ background: "#faf9f7" }}>
                      <h1 className="font-bold mb-3 mx-auto max-w-[640px]" style={{ fontSize: 34, lineHeight: 1.15, color: "#161616", fontFamily: displayFont, letterSpacing: "-0.5px" }}>
                        {result.home_page.hero_headline}
                      </h1>
                      <p className="mx-auto max-w-[520px] mb-6" style={{ fontSize: 16, color: "#555", lineHeight: 1.6 }}>
                        {result.home_page.hero_sub}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: accent, color: "#fff" }}>{result.home_page.cta_primary}</span>
                        <span className="px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: "transparent", color: accent, border: `1.5px solid ${accent}` }}>{result.home_page.cta_secondary}</span>
                      </div>
                      {result.home_page.hero_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.home_page.hero_image} alt="" className="mx-auto mt-8 rounded-2xl object-cover" style={{ maxWidth: 560, width: "100%", maxHeight: 340 }} />
                      )}
                    </div>

                    {/* Social proof */}
                    {result.home_page.social_proof && (
                      <div className="px-6 py-4 text-center text-sm" style={{ background: accent2, color: "#fff" }}>
                        ★★★★★ &nbsp;{result.home_page.social_proof}
                      </div>
                    )}

                    {/* Reviews */}
                    {(result.home_page.reviews?.length ?? 0) > 0 && (
                      <div className="px-6 py-10 max-w-[900px] mx-auto" style={{ borderTop: "1px solid #eee" }}>
                        <div className="text-center mb-6">
                          <div style={{ color: "#f5a623", fontSize: 18 }}>★★★★★</div>
                          <p className="text-sm mt-1" style={{ color: "#555" }}>
                            Rated {result.home_page.rating ?? "4.8"} by {result.home_page.review_count ?? ""} happy customers
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {result.home_page.reviews!.map((r, i) => (
                            <div key={i} className="rounded-xl p-4" style={{ background: "#faf9f7", border: "1px solid #eee" }}>
                              <div style={{ color: "#f5a623" }}>★★★★★</div>
                              <p className="text-sm my-2" style={{ color: "#444", lineHeight: 1.6 }}>&ldquo;{r.text}&rdquo;</p>
                              <p className="text-xs font-semibold" style={{ color: "#161616" }}>— {r.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* How It Works */}
                    {(result.home_page.steps?.length ?? 0) > 0 && (
                      <div className="px-6 py-10 max-w-[900px] mx-auto text-center" style={{ borderTop: "1px solid #eee" }}>
                        <h2 className="font-bold mb-6" style={{ fontSize: 22, color: "#161616", fontFamily: displayFont }}>How it works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {result.home_page.steps!.map((s, i) => (
                            <div key={i}>
                              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold" style={{ background: accent, color: "#fff" }}>{i + 1}</div>
                              <p className="font-semibold mb-1" style={{ color: "#161616" }}>{s.title}</p>
                              <p className="text-sm" style={{ color: "#666", lineHeight: 1.6 }}>{s.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[840px] mx-auto">
                        {features.map((f, i) => (
                          <div key={i} className="text-center">
                            <div className="text-3xl mb-2">{f.icon}</div>
                            <p className="font-semibold mb-1" style={{ color: "#161616" }}>{f.title}</p>
                            <p className="text-sm" style={{ color: "#666", lineHeight: 1.6 }}>{f.body}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comparison table */}
                    {(result.home_page.comparison?.length ?? 0) > 0 && (
                      <div className="px-6 py-10 max-w-[680px] mx-auto" style={{ borderTop: "1px solid #eee" }}>
                        <h2 className="font-bold mb-6 text-center" style={{ fontSize: 22, color: "#161616", fontFamily: displayFont }}>Why choose {result.brand.store_name}</h2>
                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #eee" }}>
                          <div className="grid grid-cols-3 text-sm font-semibold" style={{ background: "#faf9f7" }}>
                            <div className="px-4 py-3" style={{ color: "#161616" }}>Feature</div>
                            <div className="px-4 py-3 text-center" style={{ color: accent }}>{result.brand.store_name}</div>
                            <div className="px-4 py-3 text-center" style={{ color: "#999" }}>Others</div>
                          </div>
                          {result.home_page.comparison!.map((c, i) => (
                            <div key={i} className="grid grid-cols-3 text-sm" style={{ borderTop: "1px solid #eee" }}>
                              <div className="px-4 py-3" style={{ color: "#444" }}>{c}</div>
                              <div className="px-4 py-3 text-center font-bold" style={{ color: "#3a9d7a" }}>✓</div>
                              <div className="px-4 py-3 text-center font-bold" style={{ color: "#d4685f" }}>✕</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Statistics */}
                    {(result.home_page.stats?.length ?? 0) > 0 && (
                      <div className="px-6 py-10" style={{ borderTop: "1px solid #eee", background: "#faf9f7" }}>
                        <div className="grid grid-cols-3 gap-4 max-w-[700px] mx-auto text-center">
                          {result.home_page.stats!.map((s, i) => (
                            <div key={i}>
                              <p className="font-bold" style={{ fontSize: 26, color: accent }}>{s.value}</p>
                              <p className="text-xs mt-1" style={{ color: "#666" }}>{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </>
                    )}

                    {activePage === "product" && (
                    <>
                    {/* Product detail page */}
                    <div className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[960px] mx-auto" style={{ borderTop: "1px solid #eee" }}>
                      <div>
                        <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "1/1", background: `linear-gradient(135deg, ${accent}22, ${accent2}33)` }}>
                          {(result.product_page.images?.length ?? 0) > 0
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={result.product_page.images![0]} alt="" className="w-full h-full object-cover" />
                            : <span className="text-7xl">🛍️</span>}
                        </div>
                        {(result.product_page.images?.length ?? 0) > 1 && (
                          <div className="flex gap-2 mt-2">
                            {result.product_page.images!.slice(0, 5).map((src, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={src} alt="" className="rounded-md object-cover" style={{ width: 48, height: 48, border: "1px solid #eee" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="mb-2" style={{ color: "#f5a623", fontSize: 15 }}>★★★★★ <span style={{ color: "#777", fontSize: 13 }}>Rated {result.home_page.rating ?? "4.8"} ({result.home_page.review_count ?? ""})</span></div>
                        <h1 className="font-bold mb-3" style={{ fontSize: 28, color: "#161616", fontFamily: displayFont, letterSpacing: "-0.4px" }}>
                          {result.product_page.headline}
                        </h1>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-bold" style={{ fontSize: 26, color: "#161616" }}>${price}</span>
                          {comparePrice && (<span className="line-through" style={{ fontSize: 16, color: "#999" }}>${comparePrice}</span>)}
                          {savePct > 0 && (<span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#d4685f", color: "#fff" }}>SAVE {savePct}%</span>)}
                        </div>
                        <ul className="space-y-2 mb-5">
                          {bullets.slice(0, 5).map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#333" }}>
                              <span style={{ color: accent }}>✓</span> {b}
                            </li>
                          ))}
                        </ul>
                        <span className="inline-block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold mb-4" style={{ background: accent, color: "#fff" }}>Add to cart</span>
                        <p className="text-sm" style={{ color: "#555", lineHeight: 1.7 }}>{result.product_page.description_p1}</p>
                      </div>
                    </div>

                    {/* FAQ */}
                    {faqs.length > 0 && (
                      <div className="px-6 py-10 max-w-[680px] mx-auto" style={{ borderTop: "1px solid #eee" }}>
                        <h2 className="font-bold mb-5 text-center" style={{ fontSize: 22, color: "#161616", fontFamily: displayFont }}>Frequently asked questions</h2>
                        <div className="space-y-3">
                          {faqs.map((item, i) => (
                            <div key={i} className="rounded-xl p-4" style={{ background: "#faf9f7", border: "1px solid #eee" }}>
                              <p className="font-semibold text-sm mb-1" style={{ color: "#161616" }}>{item.q}</p>
                              <p className="text-sm" style={{ color: "#666", lineHeight: 1.6 }}>{item.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    </>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-8 text-center" style={{ background: "#161616", color: "#cfcfcf" }}>
                      <p className="font-bold mb-1" style={{ color: "#fff", fontFamily: displayFont, fontSize: 18 }}>{result.brand.store_name}</p>
                      <p className="text-sm mb-4" style={{ color: "#9a9a9a" }}>{result.brand.tagline}</p>
                      {badges.length > 0 && (
                        <div className="flex items-center justify-center gap-4 flex-wrap text-xs mb-4" style={{ color: "#bbb" }}>
                          {badges.map((b, i) => <span key={i}>✓ {b}</span>)}
                        </div>
                      )}
                      <p className="text-xs" style={{ color: "#777" }}>© 2026 {result.brand.store_name}. All rights reserved.</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              </div>
            );
          })()}

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

              {/* Full-store publish — writes the homepage into the live Shopify theme */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(160,120,64,0.12), rgba(160,120,64,0.04))", border: "1px solid #a07840" }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#f5f3ee" }}>🚀 Publish full store to Shopify</p>
                    <p className="text-xs mt-0.5" style={{ color: "#8a8a94" }}>Creates the product AND makes your live storefront homepage become this design.</p>
                  </div>
                  <button
                    disabled={publishingStore}
                    onClick={publishFullStore}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold flex-shrink-0"
                    style={{ background: "#a07840", color: "#f5f3ee", cursor: publishingStore ? "wait" : "pointer", opacity: publishingStore ? 0.7 : 1 }}>
                    {publishingStore ? <Loader2 size={13} className="animate-spin" /> : <Store size={13} />}
                    {publishingStore ? "Publishing…" : "Publish store"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {([
                  { emoji: "📋", label: "Copy All Copy",    desc: "Copy everything to clipboard",                action: "copy" as const },
                  { emoji: "📄", label: "Download as .txt", desc: "All copy in a plain text file",               action: "txt" as const },
                  { emoji: "🛍️", label: "Push to Shopify",  desc: "Create this product in your connected store",  action: "shopify" as const },
                ]).map((opt) => {
                  const isPush = opt.action === "shopify";
                  const busy = isPush && pushing;
                  return (
                    <div key={opt.label} className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{opt.label}</p>
                          <p className="text-xs" style={{ color: "#5c5c64" }}>{opt.desc}</p>
                        </div>
                      </div>
                      <button
                        disabled={busy}
                        onClick={() => {
                          if (opt.action === "copy") copyText("all", JSON.stringify(result, null, 2));
                          else if (opt.action === "txt") downloadTxt();
                          else if (opt.action === "shopify") pushToShopify();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: "#a07840", color: "#f5f3ee", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
                        {busy ? <Loader2 size={12} className="animate-spin" />
                          : opt.action === "copy" && copiedKey === "all" ? <Check size={12} />
                          : isPush ? <Store size={12} />
                          : <Download size={12} />}
                        {opt.action === "copy" ? (copiedKey === "all" ? "Copied!" : "Copy All")
                          : opt.action === "txt" ? "Download"
                          : busy ? "Pushing…" : "Push to Shopify"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

interface ScanProduct { title: string; price: number; image: string | null; handle: string }
interface DetectedApp { name: string; category: string; emoji: string }
interface ScanResult {
  store_name: string; store_url: string; niche: string; product_count: number;
  avg_product_price: number; monthly_traffic_est: number; monthly_revenue_est: number;
  monthly_ad_spend_est: number; top_products: ScanProduct[]; installed_apps: DetectedApp[];
  theme_name: string | null; social_links: Record<string, string>; store_age_days: number | null;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString();

const EXAMPLES = ["allbirds.com", "gymshark.com", "kith.com"];

export default function StoreSpyClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  async function analyze(target?: string) {
    const q = (target ?? url).trim();
    if (!q) return;
    setUrl(q);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/store-spy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: q }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); }
      else { setResult(data.result); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const card = { background: "#ffffff", border: "1px solid #e4e1d8" } as const;

  return (
    <div>
      {/* Search */}
      <div className="rounded-2xl p-5 mb-6" style={card}>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Enter any Shopify store URL — e.g. brand.com"
            className="flex-1 rounded-xl px-4 py-3 text-sm"
            style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
          />
          <button
            onClick={() => analyze()}
            disabled={loading || !url.trim()}
            className="rounded-xl px-6 py-3 text-sm font-bold transition-all whitespace-nowrap"
            style={{ background: loading || !url.trim() ? "#e4e1d8" : "#a07840", color: loading || !url.trim() ? "#5d5b54" : "#fdfbf6" }}
          >
            {loading ? "Analyzing…" : "🕵️ Analyze Store"}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs" style={{ color: "#5d5b54" }}>Try:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => analyze(ex)}
              className="text-xs rounded-full px-2.5 py-1 transition-colors"
              style={{ background: "#f3f1ea", color: "#4d4b44", border: "1px solid #e4e1d8" }}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm"
          style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.25)", color: "#d4685f" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl p-12 text-center" style={card}>
          <p className="text-sm" style={{ color: "#4d4b44" }}>⏳ Fetching products & detecting apps…</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Header */}
          <div className="rounded-2xl p-6" style={card}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold" style={{ fontSize: 22, color: "#23221f" }}>{result.store_name}</h2>
                <p className="text-sm" style={{ color: "#4d4b44" }}>
                  {result.store_url.replace("https://", "")} · <span style={{ color: "#8a6530" }}>{result.niche}</span>
                  {result.theme_name && <> · Theme: {result.theme_name}</>}
                </p>
              </div>
              {Object.entries(result.social_links).length > 0 && (
                <div className="flex gap-2">
                  {Object.entries(result.social_links).map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                      className="text-xs rounded-full px-2.5 py-1" style={{ background: "#f3f1ea", color: "#4d4b44" }}>{k}</a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estimate stats */}
          <AiEstimateBadge variant="banner" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Est. monthly revenue", value: money(result.monthly_revenue_est), accent: "#3e8f72" },
              { label: "Est. monthly traffic", value: result.monthly_traffic_est.toLocaleString(), accent: "#8a6530" },
              { label: "Est. ad spend / mo", value: money(result.monthly_ad_spend_est), accent: "#c08a2a" },
              { label: "Products", value: result.product_count.toLocaleString(), accent: "#23221f" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5" style={card}>
                <p className="font-black" style={{ fontSize: 24, color: s.accent, letterSpacing: "-0.5px" }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: "#4d4b44" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#5d5b54" }}>
            Revenue = est. visits × 2% conversion × avg price ({money(result.avg_product_price)}).
            {result.store_age_days != null && <> Store age ≈ {result.store_age_days.toLocaleString()} days.</>}
          </p>

          {/* Top products */}
          {result.top_products.length > 0 && (
            <div className="rounded-2xl p-6" style={card}>
              <h3 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>Top products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {result.top_products.map((p) => (
                  <div key={p.handle} className="rounded-xl overflow-hidden" style={{ background: "#f3f1ea" }}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center text-2xl">🛍️</div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-medium truncate" style={{ color: "#23221f" }}>{p.title}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: "#3e8f72" }}>{money(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Installed apps */}
          <div className="rounded-2xl p-6" style={card}>
            <h3 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>
              Installed apps {result.installed_apps.length > 0 && `(${result.installed_apps.length})`}
            </h3>
            {result.installed_apps.length === 0 ? (
              <p className="text-sm" style={{ color: "#4d4b44" }}>No known apps detected on the homepage.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.installed_apps.map((a) => (
                  <span key={a.name} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f" }}>
                    <span>{a.emoji}</span>{a.name}
                    <span style={{ color: "#5d5b54" }}>· {a.category}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

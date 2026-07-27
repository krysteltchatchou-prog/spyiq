"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, ExternalLink, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

interface Props {
  params: { domain: string };
}

// Mirrors lib/scanStore.ts → ScanResult (the shape returned by /api/store-spy).
interface ScanProduct { title: string; price: number; image: string | null; handle: string; }
interface DetectedApp { name: string; category: string; emoji: string; }
interface ScanResult {
  store_id: string;
  store_url: string;
  store_name: string;
  niche: string;
  country: string;
  product_count: number;
  avg_product_price: number;
  monthly_traffic_est: number;
  monthly_revenue_est: number;
  monthly_ad_spend_est: number;
  top_products: ScanProduct[];
  installed_apps: DetectedApp[];
  theme_name: string | null;
  social_links: Record<string, string>;
  store_age_days: number | null;
  scanned_at: string;
  is_shopify: boolean;
}

const TABS = ["Overview", "Products", "Apps", "Traffic", "AI Verdict"] as const;
type Tab = typeof TABS[number];

function fmt(n: number) { return n.toLocaleString(); }
function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}
function fmtPrice(n: number) { return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function ageLabel(days: number | null): string {
  if (!days || days <= 0) return "Unknown";
  if (days < 365) return `${days} days`;
  const years = (days / 365).toFixed(1);
  return `${years} yrs`;
}
function foundedYear(days: number | null): string {
  if (!days || days <= 0) return "—";
  return String(new Date(Date.now() - days * 86_400_000).getFullYear());
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", youtube: "YouTube", twitter: "X / Twitter",
};

export default function StoreDetailPage({ params }: Props) {
  const { domain } = params;
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [saved, setSaved] = useState(false);

  const [store, setStore] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/store-spy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong scanning this store.");
        setStore(null);
      } else {
        setStore(data.result as ScanResult);
      }
    } catch {
      setError("Couldn't reach the scan service. Check your connection and try again.");
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => { runScan(); }, [runScan]);

  // ── Breadcrumb (shared across all states) ──
  const breadcrumb = (
    <div className="flex items-center gap-2 mb-6">
      <Link href="/store-spy" className="flex items-center gap-1.5 text-sm hover:text-[#8a6530] transition-colors"
        style={{ color: "#4d4b44" }}>
        <ArrowLeft size={14} /> Store Spy
      </Link>
      <span style={{ color: "#d4cfc2" }}>/</span>
      <span className="text-sm" style={{ color: "#23221f" }}>{domain}</span>
    </div>
  );

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto">
        {breadcrumb}
        <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <Loader2 size={28} className="animate-spin mb-4" color="#a07840" />
          <p className="font-semibold mb-1" style={{ color: "#23221f" }}>Scanning {domain}…</p>
          <p className="text-sm" style={{ color: "#5d5b54" }}>
            Reading the store&apos;s public catalog, detecting apps, and modeling its traffic & revenue.
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !store) {
    return (
      <div className="max-w-[1100px] mx-auto">
        {breadcrumb}
        <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center"
          style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <AlertCircle size={26} className="mb-3" color="#d4685f" />
          <p className="font-semibold mb-1" style={{ color: "#23221f" }}>Couldn&apos;t analyze this store</p>
          <p className="text-sm mb-5 max-w-[440px]" style={{ color: "#5d5b54" }}>{error}</p>
          <div className="flex items-center gap-3">
            <button onClick={runScan}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#a07840", color: "#fdfbf6" }}>
              <RefreshCw size={14} /> Try again
            </button>
            <Link href="/store-spy"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
              Back to Store Spy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loaded ──
  const sparkBase = [40, 44, 41, 52, 58, 61, 68, 64, 72, 78, 75, 82];
  const socialEntries = Object.entries(store.social_links);

  const statsGrid = [
    { label: "Monthly Revenue",   value: fmtCurrency(store.monthly_revenue_est),  color: "#3e8f72", est: true },
    { label: "Monthly Traffic",   value: fmt(store.monthly_traffic_est),          color: "#23221f", est: true },
    { label: "Products",          value: fmt(store.product_count),                color: "#23221f", est: false },
    { label: "Avg Product Price", value: store.avg_product_price ? fmtPrice(store.avg_product_price) : "—", color: "#a07840", est: false },
    { label: "Ad Spend/mo",       value: fmtCurrency(store.monthly_ad_spend_est), color: "#d4685f", est: true },
    { label: "Oldest Product",    value: foundedYear(store.store_age_days),       color: "#23221f", est: false },
    { label: "Social Channels",   value: fmt(socialEntries.length),               color: "#8b8da0", est: false },
    { label: "Apps Detected",     value: fmt(store.installed_apps.length),        color: "#3e8f72", est: false },
  ];

  return (
    <div className="max-w-[1100px] mx-auto">
      {breadcrumb}

      {/* Store header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl flex-shrink-0"
            style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
            🛍️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-bold" style={{ fontSize: 22, color: "#23221f", letterSpacing: "-0.3px" }}>
                {store.store_name}
              </h1>
              <a href={store.store_url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} color="#5d5b54" />
              </a>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm" style={{ color: "#5d5b54" }}>{domain}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                {store.niche}
              </span>
              {store.theme_name && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                  Theme: {store.theme_name}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
          style={{
            background: saved ? "rgba(160,120,64,0.15)" : "#f3f1ea",
            border: `1px solid ${saved ? "#a07840" : "#e4e1d8"}`,
            color: saved ? "#8a6530" : "#4d4b44",
          }}>
          <Bookmark size={14} fill={saved ? "#a07840" : "none"} /> {saved ? "Tracking" : "Track Store"}
        </button>
      </div>

      {/* Estimate disclaimer */}
      <AiEstimateBadge variant="banner" className="mb-6" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl flex-wrap" style={{ background: "#ffffff", border: "1px solid #e4e1d8", width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t ? "#a07840" : "transparent",
              color:      activeTab === t ? "#fdfbf6" : "#4d4b44",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statsGrid.map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-xs" style={{ color: "#4d4b44" }}>{s.label}</p>
                  {s.est && <AiEstimateBadge />}
                </div>
                <p className="font-bold text-xl" style={{ color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#5d5b54" }}>
            &ldquo;Oldest Product&rdquo; is the earliest item still in the store&apos;s public catalog (up to the 250 most recent) — not the store&apos;s
            founding date, which can&apos;t be reliably determined from a public scan. &ldquo;Products&rdquo; counts publicly listed items only.
          </p>

          {/* Revenue trend — modeled from the estimated monthly revenue */}
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold" style={{ color: "#23221f" }}>Estimated Revenue Trend</h2>
                <AiEstimateBadge />
              </div>
              <span className="text-xs" style={{ color: "#5d5b54" }}>Modeled 12-month shape</span>
            </div>
            <div style={{ height: 120 }}>
              <SparklineChart data={sparkBase.map((v) => v * (Math.max(store.monthly_revenue_est, 1) / 82_000))} color="#a07840" height={120} />
            </div>
          </div>
        </div>
      )}

      {/* Products — real catalog from the public products feed */}
      {activeTab === "Products" && (
        store.top_products.length === 0 ? (
          <EmptyPanel title="No public products found"
            body="This store's product feed wasn't reachable, or it hides its catalog from public scans." />
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #e4e1d8" }}>
              <p className="text-xs" style={{ color: "#5d5b54" }}>
                Showing the store&apos;s {store.top_products.length} most recent public products (real catalog data).
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #e4e1d8" }}>
                  {["Product", "Price", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#5d5b54" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.top_products.map((p, i) => (
                  <tr key={p.handle || i} style={{ borderBottom: i < store.top_products.length - 1 ? "1px solid #f3f1ea" : undefined }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" width={36} height={36}
                            className="rounded-lg object-cover flex-shrink-0" style={{ width: 36, height: 36, border: "1px solid #e4e1d8" }} />
                        ) : (
                          <span className="text-xl">🛍️</span>
                        )}
                        <span className="text-sm font-medium" style={{ color: "#23221f" }}>{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#a07840" }}>
                      {p.price ? fmtPrice(p.price) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`${store.store_url}/products/${p.handle}`} target="_blank" rel="noreferrer"
                        className="text-xs font-semibold hover:text-[#8a6530] transition-colors inline-flex items-center gap-1"
                        style={{ color: "#a07840" }}>
                        View <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Apps — real detection from the homepage HTML */}
      {activeTab === "Apps" && (
        store.installed_apps.length === 0 ? (
          <EmptyPanel title="No apps detected"
            body="We couldn't fingerprint any known Shopify apps on this store's homepage. They may use custom code or apps we don't track yet." />
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #e4e1d8" }}>
              <p className="text-xs" style={{ color: "#5d5b54" }}>
                {store.installed_apps.length} app{store.installed_apps.length === 1 ? "" : "s"} detected from the store&apos;s page source.
              </p>
            </div>
            {store.installed_apps.map((app, i) => (
              <div key={app.name}
                className="flex items-center gap-4 px-5 py-4"
                style={{ borderBottom: i < store.installed_apps.length - 1 ? "1px solid #f3f1ea" : undefined }}>
                <span className="text-2xl">{app.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold" style={{ color: "#23221f" }}>{app.name}</span>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                  {app.category}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Traffic — honest about what a public scan can and can't see */}
      {activeTab === "Traffic" && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold" style={{ color: "#23221f" }}>Estimated Monthly Traffic</h2>
              <AiEstimateBadge />
            </div>
            <p className="font-bold" style={{ fontSize: 34, color: "#23221f", letterSpacing: "-1px" }}>
              {fmt(store.monthly_traffic_est)}
            </p>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "#5d5b54" }}>
              This figure is <strong style={{ color: "#23221f" }}>modeled</strong> from the store&apos;s catalog
              size and detected martech stack — not measured analytics. A precise traffic-source and country
              breakdown requires a connected analytics provider, which isn&apos;t available from a public scan.
            </p>
          </div>

          {socialEntries.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#23221f" }}>Social Channels <span className="text-xs font-normal" style={{ color: "#5d5b54" }}>(found on store)</span></h2>
              <div className="flex flex-wrap gap-2">
                {socialEntries.map(([k, url]) => (
                  <a key={k} href={url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                    {SOCIAL_LABELS[k] ?? k} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Verdict — built from the real scanned signals */}
      {activeTab === "AI Verdict" && (
        <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8", borderLeft: "2px solid #a07840" }}>
          <div className="flex items-center gap-2 mb-4">
            <span>🤖</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07840" }}>AI Verdict</span>
            <AiEstimateBadge />
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#4d4b44" }}>
            <p>
              <strong style={{ color: "#23221f" }}>{store.store_name}</strong> is a{" "}
              <strong style={{ color: "#8a6530" }}>{store.niche}</strong> store carrying{" "}
              <strong style={{ color: "#23221f" }}>{fmt(store.product_count)}</strong> public products
              {store.avg_product_price ? <> at an average price of <strong style={{ color: "#a07840" }}>{fmtPrice(store.avg_product_price)}</strong></> : null}.
              Based on its catalog size and martech stack, we estimate roughly{" "}
              <strong style={{ color: "#3e8f72" }}>{fmtCurrency(store.monthly_revenue_est)}/month</strong> in revenue
              from about <strong style={{ color: "#23221f" }}>{fmt(store.monthly_traffic_est)}</strong> monthly visits.
            </p>
            <p>
              {store.installed_apps.length > 0 ? (
                <>Their stack includes <strong style={{ color: "#23221f" }}>{store.installed_apps.slice(0, 4).map((a) => a.name).join(", ")}</strong>
                {store.installed_apps.length > 4 ? ` and ${store.installed_apps.length - 4} more` : ""} — a sign of a
                {store.installed_apps.length >= 5 ? " mature, optimization-focused" : " developing"} operation.</>
              ) : (
                <>We didn&apos;t detect a recognizable third-party app stack, which can indicate a newer store or a heavily custom build.</>
              )}
              {store.store_age_days ? <> The earliest public product dates back about <strong style={{ color: "#23221f" }}>{ageLabel(store.store_age_days)}</strong>.</> : null}
            </p>
            <p>
              <strong style={{ color: "#c08a2a" }}>Note:</strong> revenue, traffic and ad-spend figures are
              modeled estimates for research — not the store&apos;s reported financials. Use them directionally.
            </p>
          </div>
          <Link href="/ai-analyzer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold hover:text-[#8a6530] transition-colors"
            style={{ color: "#a07840" }}>
            Ask AI more about this store →
          </Link>
        </div>
      )}
    </div>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl p-10 text-center" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
      <p className="font-semibold mb-1" style={{ color: "#23221f" }}>{title}</p>
      <p className="text-sm max-w-[440px] mx-auto" style={{ color: "#5d5b54" }}>{body}</p>
    </div>
  );
}

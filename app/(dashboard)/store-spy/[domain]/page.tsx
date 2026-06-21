"use client";
import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, ExternalLink, Copy, Check } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";

interface Props {
  params: Promise<{ domain: string }>;
}

// Stable mock data keyed by domain hash
function getMockStore(domain: string) {
  const seeds: Record<string, { name: string; emoji: string; niche: string; revenue: number; traffic: number; products: number; aov: number; adSpend: number; year: number; convRate: number }> = {
    "gymshark.com":        { name: "Gymshark",        emoji: "🏋️", niche: "Fitness",  revenue: 12_000_000, traffic: 8_400_000, products: 240, aov: 78, adSpend: 1_200_000, year: 2012, convRate: 3.8 },
    "beardbrand.com":      { name: "Beardbrand",       emoji: "🧔", niche: "Grooming", revenue: 890_000,  traffic: 420_000,   products: 82,  aov: 62, adSpend: 89_000,   year: 2012, convRate: 4.2 },
    "chubbiesshorts.com":  { name: "Chubbies",         emoji: "🩳", niche: "Fashion",  revenue: 3_100_000, traffic: 1_200_000, products: 56,  aov: 71, adSpend: 310_000,  year: 2011, convRate: 2.9 },
    "tentree.com":         { name: "Tentree",           emoji: "🌳", niche: "Eco",      revenue: 2_400_000, traffic: 980_000,   products: 140, aov: 88, adSpend: 240_000,  year: 2012, convRate: 3.1 },
    "blendjet.com":        { name: "BlendJet",          emoji: "🥤", niche: "Kitchen",  revenue: 5_800_000, traffic: 3_100_000, products: 18,  aov: 59, adSpend: 580_000,  year: 2017, convRate: 4.8 },
    "brooklinen.com":      { name: "Brooklinen",        emoji: "🛏️", niche: "Home",     revenue: 7_200_000, traffic: 2_800_000, products: 95,  aov: 112,adSpend: 720_000,  year: 2014, convRate: 3.6 },
  };
  return seeds[domain] ?? { name: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1), emoji: "🛍️", niche: "General", revenue: 450_000, traffic: 220_000, products: 64, aov: 54, adSpend: 45_000, year: 2019, convRate: 2.4 };
}

const TABS = ["Overview", "Products", "Ads", "Traffic", "Apps", "AI Verdict"] as const;
type Tab = typeof TABS[number];

function fmt(n: number) { return n.toLocaleString(); }
function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export default function StoreDetailPage({ params }: Props) {
  const { domain } = use(params);
  const store = getMockStore(domain);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [saved, setSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyHook(id: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const topProducts = [
    { emoji: "💪", name: "Impact Seamless Leggings",  sales: 4_200, price: 45, margin: 68 },
    { emoji: "👕", name: "Training T-Shirt",           sales: 3_800, price: 38, margin: 71 },
    { emoji: "🧢", name: "Core Cap",                   sales: 2_100, price: 22, margin: 76 },
    { emoji: "🩱", name: "Sports Bra Pro",             sales: 1_900, price: 34, margin: 65 },
    { emoji: "🎽", name: "Vital Seamless 2.0",         sales: 1_640, price: 52, margin: 69 },
  ];

  const ads = [
    { id: "a1", platform: "TikTok",    emoji: "💪", product: "Seamless Leggings", hook: "POV: You found leggings that actually stay up during every workout 🔥", engagement: 8.4, days: 18, spend: 42_000  },
    { id: "a2", platform: "Facebook",  emoji: "👕", product: "Training T-Shirt",  hook: "We obsessed over every detail so you can focus on the gains. Meet the Training Tee.", engagement: 5.2, days: 34, spend: 89_000  },
    { id: "a3", platform: "Instagram", emoji: "🩱", product: "Sports Bra Pro",    hook: "Your next PR starts here. Zero distractions, maximum support.", engagement: 6.9, days: 12, spend: 28_000  },
  ];

  const trafficSources = [
    { label: "Paid Search",  pct: 38, color: "#a07840" },
    { label: "Organic",      pct: 24, color: "#5eb89a" },
    { label: "Paid Social",  pct: 22, color: "#8b8da0" },
    { label: "Direct",       pct: 10, color: "#d4b572" },
    { label: "Referral",     pct:  6, color: "#d4685f" },
  ];

  const apps = [
    { emoji: "⭐", name: "Yotpo",         category: "Reviews",    desc: "Photo & video reviews",             pct: 95 },
    { emoji: "📧", name: "Klaviyo",        category: "Email",      desc: "Email + SMS marketing",             pct: 88 },
    { emoji: "🔄", name: "ReConvert",      category: "Upsell",     desc: "Post-purchase upsell flows",        pct: 72 },
    { emoji: "📊", name: "Triple Whale",   category: "Analytics",  desc: "Unified attribution analytics",     pct: 68 },
    { emoji: "📦", name: "Loop Returns",   category: "Fulfilment", desc: "Returns & exchanges portal",        pct: 61 },
    { emoji: "🎁", name: "Smile.io",       category: "Loyalty",    desc: "Points & referral rewards",         pct: 54 },
  ];

  const sparkData = [40, 44, 41, 52, 58, 61, 68, 64, 72, 78, 75, 82];

  const statsGrid = [
    { label: "Monthly Revenue",  value: fmtCurrency(store.revenue),  color: "#5eb89a" },
    { label: "Monthly Traffic",  value: fmt(store.traffic),           color: "#f5f3ee" },
    { label: "Products",         value: fmt(store.products),          color: "#f5f3ee" },
    { label: "Avg Order Value",  value: `$${store.aov}`,              color: "#a07840" },
    { label: "Ad Spend/mo",      value: fmtCurrency(store.adSpend),   color: "#d4685f" },
    { label: "Founded",          value: String(store.year),           color: "#f5f3ee" },
    { label: "Conversion Rate",  value: `${store.convRate}%`,         color: "#5eb89a" },
    { label: "Social Following", value: fmt(Math.round(store.traffic * 0.12)), color: "#8b8da0" },
  ];

  return (
    <div className="max-w-[1100px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/store-spy" className="flex items-center gap-1.5 text-sm hover:text-[#c49a5a] transition-colors"
          style={{ color: "#8a8a94" }}>
          <ArrowLeft size={14} /> Store Spy
        </Link>
        <span style={{ color: "#3a3a42" }}>/</span>
        <span className="text-sm" style={{ color: "#f5f3ee" }}>{domain}</span>
      </div>

      {/* Store header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl flex-shrink-0"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
            {store.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-bold" style={{ fontSize: 22, color: "#f5f3ee", letterSpacing: "-0.3px" }}>
                {store.name}
              </h1>
              <a href={`https://${domain}`} target="_blank" rel="noreferrer">
                <ExternalLink size={14} color="#5c5c64" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "#5c5c64" }}>{domain}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                {store.niche}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: saved ? "rgba(160,120,64,0.15)" : "#1d1d24",
            border: `1px solid ${saved ? "#a07840" : "#2a2a33"}`,
            color: saved ? "#c49a5a" : "#8a8a94",
          }}>
          <Bookmark size={14} fill={saved ? "#a07840" : "none"} /> {saved ? "Tracking" : "Track Store"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t ? "#a07840" : "transparent",
              color:      activeTab === t ? "#f5f3ee" : "#8a8a94",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statsGrid.map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <p className="text-xs mb-1" style={{ color: "#8a8a94" }}>{s.label}</p>
                <p className="font-bold text-xl" style={{ color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Revenue trend */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: "#f5f3ee" }}>Revenue Trend</h2>
              <span className="text-sm font-bold" style={{ color: "#5eb89a" }}>▲ 24% last 12mo</span>
            </div>
            <div style={{ height: 120 }}>
              <SparklineChart data={sparkData.map((v) => v * (store.revenue / 82_000))} color="#a07840" height={120} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "Products" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2a33" }}>
                {["Product", "Est. Sales/mo", "Price", "Margin %", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#5c5c64" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} style={{ borderBottom: i < topProducts.length - 1 ? "1px solid #1d1d24" : undefined }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{p.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: "#f5f3ee" }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: "#5eb89a" }}>{fmt(p.sales)}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#f5f3ee" }}>${p.price}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#a07840" }}>{p.margin}%</td>
                  <td className="px-4 py-3">
                    <Link href="/products" className="text-xs font-semibold hover:text-[#c49a5a] transition-colors"
                      style={{ color: "#a07840" }}>
                      Spy →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Ads" && (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ad.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{ad.product}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                        {ad.platform}
                      </span>
                    </div>
                    <p className="text-sm italic" style={{ color: "#8a8a94" }}>&ldquo;{ad.hook}&rdquo;</p>
                  </div>
                </div>
                <button
                  onClick={() => copyHook(ad.id, ad.hook)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all"
                  style={{
                    background: copiedId === ad.id ? "rgba(94,184,154,0.12)" : "#1d1d24",
                    border: `1px solid ${copiedId === ad.id ? "rgba(94,184,154,0.3)" : "#2a2a33"}`,
                    color: copiedId === ad.id ? "#5eb89a" : "#8a8a94",
                  }}>
                  {copiedId === ad.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedId === ad.id ? "Copied!" : "Copy Hook"}
                </button>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid #1d1d24" }}>
                <div><p className="text-xs" style={{ color: "#5c5c64" }}>Engagement</p><p className="text-sm font-bold" style={{ color: "#5eb89a" }}>{ad.engagement}%</p></div>
                <div><p className="text-xs" style={{ color: "#5c5c64" }}>Days Running</p><p className="text-sm font-bold" style={{ color: "#f5f3ee" }}>{ad.days}</p></div>
                <div><p className="text-xs" style={{ color: "#5c5c64" }}>Est. Spend</p><p className="text-sm font-bold" style={{ color: "#a07840" }}>{fmtCurrency(ad.spend)}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Traffic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-5" style={{ color: "#f5f3ee" }}>Traffic Sources</h2>
            <div className="space-y-4">
              {trafficSources.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "#f5f3ee" }}>{s.label}</span>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "#2a2a33" }}>
                    <div className="rounded-full h-1.5" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-5" style={{ color: "#f5f3ee" }}>Top Countries</h2>
            <div className="space-y-3">
              {[
                { flag: "🇺🇸", country: "United States", pct: 52 },
                { flag: "🇬🇧", country: "United Kingdom", pct: 18 },
                { flag: "🇨🇦", country: "Canada",          pct: 12 },
                { flag: "🇦🇺", country: "Australia",       pct:  8 },
                { flag: "🇩🇪", country: "Germany",         pct:  4 },
              ].map((c) => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: "#f5f3ee" }}>{c.country}</span>
                      <span className="text-xs font-bold" style={{ color: "#8a8a94" }}>{c.pct}%</span>
                    </div>
                    <div className="w-full rounded-full h-1" style={{ background: "#2a2a33" }}>
                      <div className="rounded-full h-1" style={{ width: `${c.pct}%`, background: "#a07840" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Apps" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          {apps.map((app, i) => (
            <div key={app.name}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: i < apps.length - 1 ? "1px solid #1d1d24" : undefined }}>
              <span className="text-2xl">{app.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{app.name}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                    {app.category}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#5c5c64" }}>{app.desc}</p>
              </div>
              <div className="text-right flex-shrink-0" style={{ width: 120 }}>
                <div className="text-xs font-bold mb-1" style={{ color: "#a07840" }}>{app.pct}% of top stores</div>
                <div className="w-full rounded-full h-1.5" style={{ background: "#2a2a33" }}>
                  <div className="rounded-full h-1.5" style={{ width: `${app.pct}%`, background: "linear-gradient(90deg,#8a6530,#a07840)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "AI Verdict" && (
        <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33", borderLeft: "2px solid #a07840" }}>
          <div className="flex items-center gap-2 mb-4">
            <span>🤖</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07840" }}>AI Verdict</span>
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#8a8a94" }}>
            <p>
              <strong style={{ color: "#f5f3ee" }}>{store.name}</strong> is scaling aggressively in the{" "}
              <strong style={{ color: "#c49a5a" }}>{store.niche}</strong> niche with an estimated{" "}
              <strong style={{ color: "#5eb89a" }}>{fmtCurrency(store.revenue)}/month</strong> in revenue.
              Their primary traffic driver is <strong style={{ color: "#f5f3ee" }}>paid search ({trafficSources[0].pct}%)</strong>, suggesting heavy
              investment in Google Shopping and branded keywords.
            </p>
            <p>
              Their top product category shows strong repeat purchase signals — high average order value of{" "}
              <strong style={{ color: "#a07840" }}>${store.aov}</strong> indicates premium positioning. They are likely using
              post-purchase upsell flows (ReConvert or similar) effectively.
            </p>
            <p>
              <strong style={{ color: "#d4b572" }}>Key vulnerability:</strong> Heavy reliance on paid channels ({trafficSources[0].pct + trafficSources[2].pct}% paid) means
              high CAC sensitivity to ad costs. A competitor with stronger organic SEO or influencer presence could
              undercut their margins significantly.
            </p>
            <p>
              <strong style={{ color: "#5eb89a" }}>Opportunity:</strong> Their organic share is only {trafficSources[1].pct}% — a new entrant with strong
              content marketing in the {store.niche} niche could capture significant market share within 6–12 months.
            </p>
          </div>
          <Link href="/ai-analyzer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold hover:text-[#c49a5a] transition-colors"
            style={{ color: "#a07840" }}>
            Ask AI more about this store →
          </Link>
        </div>
      )}
    </div>
  );
}

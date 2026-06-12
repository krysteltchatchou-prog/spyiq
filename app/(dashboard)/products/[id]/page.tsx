"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Share2, Download, Info, ExternalLink } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { IQScoreBadge } from "@/components/products/IQScoreBadge";
import { TrendChart } from "@/components/products/TrendChart";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0];

  const scores = [
    { label: "Demand Score",      value: product.demand_score,      color: "#5eb89a",  desc: "How much buyers are actively searching for this product right now." },
    { label: "Competition",       value: 100 - product.competition_score, color: "#a07840", desc: "Lower competition = higher score. 100 = no competition, 0 = extremely saturated." },
    { label: "Viral Score",       value: product.viral_score,       color: "#8b8da0",  desc: "Likelihood to go viral on TikTok or Instagram based on visual appeal and trend signals." },
    { label: "Margin Score",      value: Math.round(product.margin_pct), color: "#d4b572", desc: "Estimated profit margin after product cost, shipping, and fees." },
  ];

  const competitors = [
    { name: "NovaSkinCo",     domain: "novaskinco.com",    revenue: "$84k/mo",  products: 34 },
    { name: "GlowEssentials", domain: "glowessentials.co", revenue: "$61k/mo",  products: 22 },
    { name: "PureDrops",      domain: "puredrops.shop",    revenue: "$38k/mo",  products: 18 },
  ];

  const suppliers = [
    { name: "Supplier A", price: "$3.20", moq: 1, rating: 4.8, orders: "12k+" },
    { name: "Supplier B", price: "$2.90", moq: 5, rating: 4.6, orders: "8k+"  },
    { name: "Supplier C", price: "$3.50", moq: 1, rating: 4.9, orders: "21k+" },
  ];

  return (
    <div className="max-w-[1100px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/products" className="flex items-center gap-1.5 text-sm transition-colors hover:text-[#c49a5a]"
          style={{ color: "#8a8a94" }}>
          <ArrowLeft size={14} /> Products
        </Link>
        <span style={{ color: "#3a3a42" }}>/</span>
        <span className="text-sm truncate max-w-[200px]" style={{ color: "#f5f3ee" }}>{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl text-4xl flex-shrink-0"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
            {product.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {product.is_trending && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "rgba(94,184,154,0.15)", border: "1px solid rgba(94,184,154,0.3)", color: "#5eb89a" }}>
                  🔥 Trending
                </span>
              )}
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                {product.niche}
              </span>
              {product.platforms.map((p) => (
                <span key={p} className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#5c5c64" }}>
                  {p}
                </span>
              ))}
            </div>
            <h1 className="font-bold" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>
              {product.name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8a8a94" }}>
              ${product.price_range_low} – ${product.price_range_high}&nbsp;·&nbsp;Updated today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <IQScoreBadge score={product.iq_score} size={72} strokeWidth={5} showLabel />
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#a07840", color: "#f5f3ee" }}>
              <Bookmark size={13} /> Save
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — 2/3 */}
        <div className="lg:col-span-2 space-y-6">

          {/* Score breakdown */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-semibold" style={{ color: "#f5f3ee" }}>Score Breakdown</h2>
              <div className="relative group cursor-pointer">
                <Info size={13} color="#5c5c64" />
                <div className="absolute left-5 top-0 hidden group-hover:block z-10 w-56 rounded-xl p-3 text-xs"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                  Scores are calculated from live market data and AI analysis.
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {scores.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium" style={{ color: "#f5f3ee" }}>{s.label}</span>
                      <div className="relative group cursor-pointer">
                        <Info size={11} color="#5c5c64" />
                        <div className="absolute left-4 top-0 hidden group-hover:block z-10 w-52 rounded-xl p-2.5 text-xs"
                          style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "#2a2a33" }}>
                    <div className="rounded-full h-1.5 transition-all"
                      style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales trend */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold" style={{ color: "#f5f3ee" }}>Sales Trend (30 days)</h2>
              <span className="text-sm font-bold" style={{ color: "#5eb89a" }}>
                ▲ {Math.round(product.monthly_sales_est / 30).toLocaleString()} avg/day
              </span>
            </div>
            <TrendChart monthlyBase={product.monthly_sales_est} />
          </div>

          {/* Keywords */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Related Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {[
                ...product.keywords,
                "dropshipping",
                "winning product",
                product.niche.toLowerCase(),
                "buy online",
                `best ${product.keywords[0]}`,
              ].map((kw) => (
                <span key={kw}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition-all"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#c49a5a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a33"; e.currentTarget.style.color = "#8a8a94"; }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Target audiences */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Target Audiences</h2>
            <div className="flex flex-wrap gap-2">
              {product.target_audiences.map((a) => (
                <span key={a} className="rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.25)", color: "#c49a5a" }}>
                  {a}
                </span>
              ))}
              <span className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: "rgba(139,141,160,0.10)", border: "1px solid rgba(139,141,160,0.25)", color: "#8b8da0" }}>
                Ages 18–45
              </span>
            </div>
          </div>

          {/* Competitor stores */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Stores Selling This</h2>
            <div className="space-y-3">
              {competitors.map((c) => (
                <div key={c.domain}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#5c5c64" }}>{c.domain}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#5eb89a" }}>{c.revenue}</p>
                      <p className="text-xs" style={{ color: "#5c5c64" }}>revenue</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#f5f3ee" }}>{c.products}</p>
                      <p className="text-xs" style={{ color: "#5c5c64" }}>products</p>
                    </div>
                    <Link href={`/store-spy/${c.domain}`}>
                      <ExternalLink size={14} color="#5c5c64" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">

          {/* Quick stats */}
          <div className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-4 text-sm" style={{ color: "#f5f3ee" }}>Quick Stats</h2>
            <div className="space-y-3">
              {[
                { label: "Est. Monthly Sales", value: product.monthly_sales_est.toLocaleString(), color: "#f5f3ee" },
                { label: "Profit Margin",      value: `${product.margin_pct}%`,                   color: "#5eb89a" },
                { label: "Viral Score",         value: `${product.viral_score}/100`,               color: "#a07840" },
                {
                  label: "Competition",
                  value: product.competition_score <= 40 ? "Low" : product.competition_score <= 65 ? "Medium" : "High",
                  color: product.competition_score <= 40 ? "#5eb89a" : product.competition_score <= 65 ? "#d4b572" : "#d4685f",
                },
                {
                  label: "Supplier",
                  value: product.supplier_available ? "Available ✓" : "Limited",
                  color: product.supplier_available ? "#5eb89a" : "#d4b572",
                },
                { label: "Best Platform", value: product.platforms[0], color: "#8b8da0" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#8a8a94" }}>{stat.label}</span>
                  <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33", borderLeft: "2px solid #a07840" }}>
            <div className="flex items-center gap-2 mb-3">
              <span>🤖</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07840" }}>AI Analysis</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>
              {product.name} shows strong demand indicators with a {product.demand_score}/100 demand score.
              Competition is currently{" "}
              <strong style={{ color: product.competition_score <= 40 ? "#5eb89a" : "#d4b572" }}>
                {product.competition_score <= 40 ? "low" : product.competition_score <= 65 ? "moderate" : "high"}
              </strong>
              , giving early movers an advantage. The {product.margin_pct}% margin is{" "}
              {product.margin_pct >= 65 ? "excellent" : product.margin_pct >= 50 ? "solid" : "acceptable"} for dropshipping.
              Target {product.target_audiences[0]} on {product.platforms[0]} for fastest traction.
              Key risk: supply chain delays during peak season.
            </p>
            <Link href="/ai-analyzer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold hover:text-[#c49a5a] transition-colors"
              style={{ color: "#a07840" }}>
              Deep dive with AI →
            </Link>
          </div>

          {/* Suppliers */}
          <div className="rounded-2xl p-5" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>Supplier Suggestions</h2>
              <span className="text-xs" style={{ color: "#5c5c64" }}>AliExpress</span>
            </div>
            <div className="space-y-3">
              {suppliers.map((s) => (
                <div key={s.name} className="rounded-xl p-3"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "#f5f3ee" }}>{s.name}</span>
                    <span className="text-xs font-bold" style={{ color: "#5eb89a" }}>{s.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#5c5c64" }}>MOQ: {s.moq}</span>
                    <span className="text-xs" style={{ color: "#5c5c64" }}>⭐ {s.rating}</span>
                    <span className="text-xs" style={{ color: "#5c5c64" }}>{s.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a3a42"; e.currentTarget.style.color = "#f5f3ee"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a33"; e.currentTarget.style.color = "#8a8a94"; }}>
            <Download size={14} /> Export Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

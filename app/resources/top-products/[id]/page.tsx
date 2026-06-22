import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import { getBoardProduct } from "@/lib/board-data";
import {
  iqScoreBand, demandScore, marginScore, trendScore, competitionScore,
} from "@/lib/iqScore";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getBoardProduct(params.id);
  return {
    title: p ? `${p.name} — SpyIQ` : "Product — SpyIQ",
    description: p ? `IQ Score ${p.iq_score}. ${p.niche}. Est. ${p.monthly_sales_est.toLocaleString()} sales/mo.` : undefined,
  };
}

export const dynamic = "force-dynamic";

const money = (n: number) => "$" + Math.round(n).toLocaleString();

function Bar({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium" style={{ color: "#23221f" }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: "#8a6530" }}>{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f3f1ea" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: "#a07840" }} />
      </div>
      <p className="text-xs mt-1" style={{ color: "#5d5b54" }}>{hint}</p>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const p = await getBoardProduct(params.id);
  if (!p) notFound();

  const band = iqScoreBand(p.iq_score);
  const sub = {
    demand: demandScore(p.monthly_sales_est),
    margin: marginScore(p.margin_pct),
    trend: trendScore(p.search_growth),
    competition: competitionScore(p.competition_level),
  };

  const stats = [
    { label: "Selling price", value: money(p.price_usd) },
    { label: "Est. cost (COGS)", value: money(p.cogs_est) },
    { label: "Profit margin", value: `${p.margin_pct}%` },
    { label: "Monthly sales", value: p.monthly_sales_est.toLocaleString() },
    { label: "Monthly revenue", value: money(p.monthly_revenue_est) },
    { label: "Stores selling", value: p.stores_count.toLocaleString() },
    { label: "Search volume", value: p.search_volume.toLocaleString() },
    { label: "Active ads", value: p.ad_count.toLocaleString() },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1000px] mx-auto">
        <Link href="/resources/top-products" className="text-sm transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
          ← Back to all products
        </Link>

        {/* Header */}
        <div className="flex items-start gap-5 mt-6 mb-8 flex-wrap">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl text-4xl shrink-0"
            style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>{p.emoji}</div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: "#f3f1ea", color: "#4d4b44" }}>{p.niche}</span>
              {p.is_featured && (
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ background: "rgba(160,120,64,0.15)", color: "#8a6530" }}>★ Featured</span>
              )}
            </div>
            <h1 className="font-bold" style={{ fontSize: 28, letterSpacing: "-0.8px" }}>{p.name}</h1>
          </div>
          <div className="text-center rounded-2xl px-6 py-4" style={{ background: "#ffffff", border: `1px solid ${band.color}55` }}>
            <p className="font-black" style={{ fontSize: 36, color: band.color, letterSpacing: "-1px" }}>{p.iq_score}</p>
            <p className="text-xs font-semibold" style={{ color: band.color }}>{band.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#5d5b54" }}>IQ Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: stats + breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>Key metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: "#f3f1ea" }}>
                    <p className="font-bold text-sm" style={{ color: "#23221f" }}>{s.value}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#5d5b54" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-bold text-sm" style={{ color: "#23221f" }}>IQ Score breakdown</h2>
              <Bar label="Demand (35%)" value={sub.demand} hint={`${p.monthly_sales_est.toLocaleString()} est. sales/mo`} />
              <Bar label="Margin (25%)" value={sub.margin} hint={`${p.margin_pct}% profit margin`} />
              <Bar label="Trend (25%)" value={sub.trend} hint={`${p.search_growth > 0 ? "+" : ""}${p.search_growth}% search growth`} />
              <Bar label="Competition (15%)" value={sub.competition} hint={`${p.competition_level} competition`} />
            </div>
          </div>

          {/* Right: suppliers + stores */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>Find a supplier</h2>
              <div className="space-y-2">
                {p.suppliers.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
                    <span className="text-sm font-medium" style={{ color: "#23221f" }}>{s.name}</span>
                    <span className="text-sm font-bold" style={{ color: "#3e8f72" }}>~{money(s.price)} →</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>Stores selling this</h2>
              <div className="space-y-2">
                {p.top_stores.map((s) => (
                  <div key={s.domain} className="rounded-xl px-3 py-2.5" style={{ background: "#f3f1ea" }}>
                    <p className="text-sm font-medium" style={{ color: "#23221f" }}>{s.name}</p>
                    <p className="text-xs" style={{ color: "#5d5b54" }}>{s.domain}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/signup?plan=pro"
              className="block text-center py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#a07840", color: "#fdfbf6" }}>
              ⚡ Analyze with AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

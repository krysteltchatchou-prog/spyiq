import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import { getShop } from "@/lib/shops-data";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const s = await getShop(params.id);
  return {
    title: s ? `${s.store_name} — SpyIQ` : "Store — SpyIQ",
    description: s ? `${s.niche} store. Est. revenue and installed apps on SpyIQ.` : undefined,
  };
}

export const dynamic = "force-dynamic";

function money(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "K";
  return "$" + Math.round(n);
}
const compact = (n: number) => (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? Math.round(n / 1_000) + "K" : n.toString());

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const s = await getShop(params.id);
  if (!s) notFound();

  const stats = [
    { label: "Est. monthly revenue", value: money(s.monthly_revenue_est), accent: "#3e8f72" },
    { label: "Est. monthly traffic", value: compact(s.monthly_traffic_est), accent: "#8a6530" },
    { label: "Est. ad spend / mo", value: money(s.monthly_ad_spend_est), accent: "#c08a2a" },
    { label: "Avg. product price", value: money(s.avg_product_price), accent: "#23221f" },
    { label: "Products", value: s.product_count.toLocaleString(), accent: "#23221f" },
    { label: "Revenue growth", value: `${s.revenue_growth >= 0 ? "+" : ""}${s.revenue_growth}%`, accent: s.revenue_growth >= 0 ? "#3e8f72" : "#d4685f" },
    { label: "Store age", value: s.store_age_days != null ? `${Math.round(s.store_age_days / 30)} mo` : "—", accent: "#23221f" },
    { label: "SpyIQ rank", value: `#${s.spyiq_rank}`, accent: "#8a6530" },
  ];

  const card = { background: "#ffffff", border: "1px solid #e4e1d8" } as const;

  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1000px] mx-auto">
        <Link href="/resources/top-shops" className="text-sm transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
          ← Back to leaderboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mt-6 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: "rgba(160,120,64,0.15)", color: "#8a6530" }}>#{s.spyiq_rank} in SpyIQ</span>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: "#f3f1ea", color: "#4d4b44" }}>{s.niche}</span>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: "#f3f1ea", color: "#4d4b44" }}>{s.country}</span>
            </div>
            <h1 className="font-bold" style={{ fontSize: 30, letterSpacing: "-1px" }}>{s.store_name}</h1>
            <a href={s.store_url} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
              {s.store_url.replace("https://", "")} ↗
            </a>
          </div>
          {Object.entries(s.social_links).length > 0 && (
            <div className="flex gap-2">
              {Object.entries(s.social_links).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="text-xs rounded-full px-3 py-1.5" style={{ background: "#f3f1ea", color: "#4d4b44" }}>{k}</a>
              ))}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((st) => (
            <div key={st.label} className="rounded-2xl p-5" style={card}>
              <p className="font-black" style={{ fontSize: 22, color: st.accent, letterSpacing: "-0.5px" }}>{st.value}</p>
              <p className="text-xs mt-1" style={{ color: "#4d4b44" }}>{st.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products */}
          <div className="rounded-2xl p-6" style={card}>
            <h2 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>Top products</h2>
            <div className="space-y-2">
              {s.top_products.map((p) => (
                <div key={p.title} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: "#f3f1ea" }}>
                  <span className="text-sm" style={{ color: "#23221f" }}>{p.title}</span>
                  <span className="text-sm font-bold" style={{ color: "#3e8f72" }}>{money(p.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installed apps */}
          <div className="rounded-2xl p-6" style={card}>
            <h2 className="font-bold text-sm mb-4" style={{ color: "#23221f" }}>
              Installed apps {s.theme_name && <span style={{ color: "#5d5b54" }}>· Theme: {s.theme_name}</span>}
            </h2>
            <div className="flex flex-wrap gap-2">
              {s.installed_apps.map((a) => (
                <span key={a.name} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f" }}>
                  <span>{a.emoji}</span>{a.name}<span style={{ color: "#5d5b54" }}>· {a.category}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/solutions/shop-analysis"
            className="inline-block rounded-xl px-6 py-3 text-sm font-bold transition-all"
            style={{ background: "#a07840", color: "#fdfbf6" }}>
            🕵️ Run a live scan
          </Link>
        </div>
      </main>
    </div>
  );
}

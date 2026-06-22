"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { BoardProduct } from "@/lib/board-data";
import { iqScoreBand } from "@/lib/iqScore";

const SORTS = [
  { id: "iq",      label: "IQ Score" },
  { id: "sales",   label: "Monthly Sales" },
  { id: "margin",  label: "Margin %" },
  { id: "revenue", label: "Revenue" },
  { id: "growth",  label: "Search Growth" },
] as const;

const TREND_ICON: Record<BoardProduct["trend_direction"], string> = { up: "📈", down: "📉", flat: "→" };

function money(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export default function ProductBoard({ products }: { products: BoardProduct[] }) {
  const niches = useMemo(
    () => Array.from(new Set(products.map((p) => p.niche))).sort(),
    [products]
  );

  const [niche, setNiche]       = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [minMargin, setMinMargin] = useState(0);
  const [minIQ, setMinIQ]       = useState(0);
  const [sort, setSort]         = useState<(typeof SORTS)[number]["id"]>("iq");
  const [search, setSearch]     = useState("");

  const filtered = useMemo(() => {
    const out = products.filter((p) =>
      (niche === "All" || p.niche === niche) &&
      p.price_usd <= maxPrice &&
      p.margin_pct >= minMargin &&
      p.iq_score >= minIQ &&
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
    );
    out.sort((a, b) => {
      switch (sort) {
        case "sales":   return b.monthly_sales_est - a.monthly_sales_est;
        case "margin":  return b.margin_pct - a.margin_pct;
        case "revenue": return b.monthly_revenue_est - a.monthly_revenue_est;
        case "growth":  return b.search_growth - a.search_growth;
        default:        return b.iq_score - a.iq_score;
      }
    });
    return out;
  }, [products, niche, maxPrice, minMargin, minIQ, sort, search]);

  const inputStyle = { background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" } as const;

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[66px] z-40 rounded-2xl p-4 mb-6"
        style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
              className="w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm" style={inputStyle}>
              <option value="All">All niches</option>
              {niches.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Sort by</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full rounded-xl px-3 py-2 text-sm" style={inputStyle}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Max price: {money(maxPrice)}</label>
            <input type="range" min={10} max={100} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-full accent-[#a07840]" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Min margin: {minMargin}%</label>
            <input type="range" min={0} max={90} step={5} value={minMargin} onChange={(e) => setMinMargin(+e.target.value)}
              className="w-full accent-[#a07840]" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Min IQ Score: {minIQ}</label>
            <input type="range" min={0} max={100} step={5} value={minIQ} onChange={(e) => setMinIQ(+e.target.value)}
              className="w-full accent-[#a07840]" />
          </div>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "#4d4b44" }}>
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <p className="text-sm" style={{ color: "#4d4b44" }}>No products match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const band = iqScoreBand(p.iq_score);
            return (
              <Link key={p.product_id} href={`/resources/top-products/${p.product_id}`}
                className="rounded-2xl p-5 transition-all block"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
                    style={{ background: "#f3f1ea" }}>{p.emoji}</div>
                  <div className="flex items-center gap-1.5">
                    {p.is_featured && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: "rgba(160,120,64,0.15)", color: "#8a6530" }}>★ Featured</span>
                    )}
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: `${band.color}22`, color: band.color }}>
                      IQ {p.iq_score}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "#23221f" }}>{p.name}</h3>
                <p className="text-xs mb-4" style={{ color: "#4d4b44" }}>
                  {p.niche} · {TREND_ICON[p.trend_direction]} {p.search_growth > 0 ? "+" : ""}{p.search_growth}%
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Price", value: money(p.price_usd) },
                    { label: "Margin", value: `${p.margin_pct}%` },
                    { label: "Sales/mo", value: p.monthly_sales_est.toLocaleString() },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl py-2" style={{ background: "#f3f1ea" }}>
                      <p className="font-bold text-xs" style={{ color: "#23221f" }}>{s.value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#5d5b54" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

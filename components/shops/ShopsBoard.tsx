"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { Shop } from "@/lib/shops-data";

function money(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "K";
  return "$" + n;
}
function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toString();
}

export default function ShopsBoard({ shops }: { shops: Shop[] }) {
  const niches = useMemo(() => ["All", ...Array.from(new Set(shops.map((s) => s.niche))).sort()], [shops]);
  const countries = useMemo(() => ["All", ...Array.from(new Set(shops.map((s) => s.country))).sort()], [shops]);
  const [niche, setNiche] = useState("All");
  const [country, setCountry] = useState("All");

  const filtered = useMemo(
    () => shops.filter((s) => (niche === "All" || s.niche === niche) && (country === "All" || s.country === country)),
    [shops, niche, country]
  );

  const selectStyle = { background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" } as const;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Niche</label>
          <select value={niche} onChange={(e) => setNiche(e.target.value)} className="rounded-xl px-3 py-2 text-sm" style={selectStyle}>
            {niches.map((n) => <option key={n} value={n}>{n === "All" ? "All niches" : n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl px-3 py-2 text-sm" style={selectStyle}>
            {countries.map((c) => <option key={c} value={c}>{c === "All" ? "All countries" : c}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2a2a33" }}>
        {/* Header row (desktop) */}
        <div className="hidden md:grid items-center gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{ background: "#15151a", color: "#5c5c64", gridTemplateColumns: "48px 1fr 120px 120px 100px 90px" }}>
          <span>#</span><span>Store</span><span className="text-right">Revenue/mo</span>
          <span className="text-right">Traffic/mo</span><span className="text-right">Growth</span><span></span>
        </div>

        {filtered.map((s, i) => (
          <Link key={s.store_id} href={`/resources/top-shops/${s.store_id}`}
            className="grid items-center gap-4 px-5 py-4 transition-colors"
            style={{
              gridTemplateColumns: "48px 1fr 120px 120px 100px 90px",
              background: i % 2 === 0 ? "#15151a" : "transparent",
              borderTop: i === 0 ? "none" : "1px solid #1d1d24",
            }}>
            <span className="font-black text-lg" style={{ color: s.spyiq_rank <= 3 ? "#c49a5a" : "#5c5c64", letterSpacing: "-1px" }}>
              {s.spyiq_rank}
            </span>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: "#f5f3ee" }}>{s.store_name}</p>
              <p className="text-xs truncate" style={{ color: "#8a8a94" }}>
                {s.store_url.replace("https://", "")} · {s.niche} · {s.country}
              </p>
            </div>
            <span className="text-right font-bold text-sm md:block hidden" style={{ color: "#5eb89a" }}>{money(s.monthly_revenue_est)}</span>
            <span className="text-right text-sm md:block hidden" style={{ color: "#f5f3ee" }}>{compact(s.monthly_traffic_est)}</span>
            <span className="text-right text-sm font-semibold md:block hidden" style={{ color: s.revenue_growth >= 0 ? "#5eb89a" : "#d4685f" }}>
              {s.revenue_growth >= 0 ? "▲" : "▼"} {Math.abs(s.revenue_growth)}%
            </span>
            <span className="text-right text-xs md:block hidden" style={{ color: "#c49a5a" }}>View →</span>
            {/* mobile revenue */}
            <span className="md:hidden col-span-4 text-sm font-bold" style={{ color: "#5eb89a" }}>{money(s.monthly_revenue_est)}/mo</span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center" style={{ background: "#15151a" }}>
            <p className="text-sm" style={{ color: "#8a8a94" }}>No stores match these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

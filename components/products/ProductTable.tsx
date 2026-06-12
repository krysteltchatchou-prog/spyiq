"use client";
import Link from "next/link";
import { Bookmark, Bot, ExternalLink, TrendingUp } from "lucide-react";
import { IQScoreBadge } from "./IQScoreBadge";
import type { Product } from "@/types/product";
import { formatNumber } from "@/lib/utils";

interface Props { products: Product[] }

export function ProductTable({ products }: Props) {
  if (!products.length) {
    return (
      <div className="rounded-xl flex flex-col items-center justify-center py-20 text-center"
        style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
        <p style={{ fontSize: 32 }}>🔍</p>
        <p className="mt-3 font-semibold" style={{ color: "#f5f3ee" }}>No products match your filters</p>
        <p className="text-sm mt-1" style={{ color: "#8a8a94" }}>Try adjusting the IQ Score range or clearing niche filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2a33" }}>
            {["#", "Product", "Niche", "IQ Score", "Est. Sales/mo", "Margin", "Trending", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#5c5c64", letterSpacing: "0.5px", background: "#15151a" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={p.id}
              className="group transition-colors"
              style={{ borderBottom: i < products.length - 1 ? "1px solid #1a1a20" : undefined }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d1d24")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Rank */}
              <td className="px-4 py-3 w-8">
                <span className="text-[12px] font-bold" style={{ color: i < 3 ? "#a07840" : "#3a3a42" }}>
                  {i + 1}
                </span>
              </td>

              {/* Product */}
              <td className="px-4 py-3">
                <Link href={`/products/${p.id}`} className="flex items-center gap-2.5 group/row">
                  <div className="shrink-0 flex items-center justify-center rounded-lg text-base"
                    style={{ width: 36, height: 36, background: "#1d1d24", border: "1px solid #2a2a33" }}>
                    {p.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold truncate max-w-[200px] group-hover/row:text-[#c49a5a] transition-colors"
                      style={{ color: "#f5f3ee" }}>
                      {p.name}
                    </p>
                    <p className="text-[10px]" style={{ color: "#5c5c64" }}>
                      ${p.price_range_low} – ${p.price_range_high}
                    </p>
                  </div>
                </Link>
              </td>

              {/* Niche */}
              <td className="px-4 py-3">
                <span className="text-[11px] font-medium rounded-full px-2 py-0.5"
                  style={{ background: "rgba(160,120,64,0.10)", color: "#a07840", border: "1px solid rgba(160,120,64,0.2)" }}>
                  {p.niche}
                </span>
              </td>

              {/* IQ Score */}
              <td className="px-4 py-3">
                <IQScoreBadge score={p.iq_score} size={36} strokeWidth={3} />
              </td>

              {/* Sales */}
              <td className="px-4 py-3">
                <p className="text-[13px] font-semibold" style={{ color: "#f5f3ee" }}>
                  {formatNumber(p.monthly_sales_est)}
                </p>
                <p className="text-[10px]" style={{ color: "#5c5c64" }}>units/mo</p>
              </td>

              {/* Margin */}
              <td className="px-4 py-3">
                <p className="text-[13px] font-semibold"
                  style={{ color: p.margin_pct >= 65 ? "#5eb89a" : p.margin_pct >= 50 ? "#d4b572" : "#d4685f" }}>
                  {p.margin_pct}%
                </p>
              </td>

              {/* Trending */}
              <td className="px-4 py-3">
                {p.is_trending ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: "#5eb89a" }}>
                    <TrendingUp size={11} /> Yes
                  </span>
                ) : (
                  <span className="text-[11px]" style={{ color: "#3a3a42" }}>—</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    title="Save"
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#a07840"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8a94"; }}
                  >
                    <Bookmark size={12} />
                  </button>
                  <Link href={`/ai-analyzer?product=${encodeURIComponent(p.name)}`}
                    title="Analyze with AI"
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c49a5a"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8a94"; }}
                  >
                    <Bot size={12} />
                  </Link>
                  <Link href={`/products/${p.id}`}
                    title="View detail"
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f5f3ee"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8a94"; }}
                  >
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

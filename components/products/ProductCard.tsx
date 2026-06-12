"use client";
import Link from "next/link";
import { Bookmark, Bot, TrendingUp } from "lucide-react";
import { IQScoreBadge } from "./IQScoreBadge";
import type { Product } from "@/types/product";
import { formatNumber } from "@/lib/utils";

interface Props { product: Product }

export function ProductCard({ product: p }: Props) {
  return (
    <div
      className="rounded-xl flex flex-col group transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      style={{ background: "#15151a", border: "1px solid #2a2a33" }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center rounded-t-xl"
        style={{ height: 100, background: "#1d1d24", borderBottom: "1px solid #2a2a33", fontSize: 40 }}
      >
        {p.emoji}
        {p.is_trending && (
          <span
            className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full text-[9px] font-bold px-1.5 py-0.5"
            style={{ background: "rgba(94,184,154,0.15)", color: "#5eb89a", border: "1px solid rgba(94,184,154,0.3)" }}
          >
            <TrendingUp size={8} /> Hot
          </span>
        )}
        {/* Save button — appears on hover */}
        <button
          className="absolute top-2 left-2 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(12,12,14,0.8)", border: "1px solid #2a2a33", color: "#8a8a94" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#a07840"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8a94"; }}
        >
          <Bookmark size={12} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-4">
        {/* Name + niche */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <Link href={`/products/${p.id}`}>
              <p className="text-[13px] font-semibold leading-snug hover:text-[#c49a5a] transition-colors line-clamp-2"
                style={{ color: "#f5f3ee" }}>
                {p.name}
              </p>
            </Link>
            <span className="inline-block mt-1 text-[10px] font-medium rounded-full px-1.5 py-0.5"
              style={{ background: "rgba(160,120,64,0.10)", color: "#a07840", border: "1px solid rgba(160,120,64,0.2)" }}>
              {p.niche}
            </span>
          </div>
          <IQScoreBadge score={p.iq_score} size={42} strokeWidth={3.5} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Sales/mo", value: formatNumber(p.monthly_sales_est), color: "#f5f3ee" },
            { label: "Margin",   value: `${p.margin_pct}%`,               color: p.margin_pct >= 65 ? "#5eb89a" : "#d4b572" },
            { label: "Viral",    value: `${p.viral_score}`,                color: "#a07840" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg p-2 text-center"
              style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
              <p className="text-[13px] font-bold" style={{ color }}>{value}</p>
              <p className="text-[9px] mt-0.5 uppercase tracking-wide" style={{ color: "#5c5c64" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Price range */}
        <p className="text-[11px] mb-3" style={{ color: "#8a8a94" }}>
          ${p.price_range_low} – ${p.price_range_high} &nbsp;·&nbsp;
          {p.supplier_available
            ? <span style={{ color: "#5eb89a" }}>Supplier available</span>
            : <span style={{ color: "#d4685f" }}>No supplier</span>}
        </p>
      </div>

      {/* Action bar */}
      <div className="flex gap-2 px-4 pb-4">
        <Link
          href={`/ai-analyzer?product=${encodeURIComponent(p.name)}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors"
          style={{ background: "#a07840", color: "#f5f3ee" }}
        >
          <Bot size={12} /> Analyze with AI
        </Link>
        <button
          className="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
          style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
        >
          Supplier
        </button>
      </div>
    </div>
  );
}

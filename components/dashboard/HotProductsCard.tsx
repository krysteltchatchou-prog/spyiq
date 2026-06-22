"use client";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { IQScoreBadge } from "@/components/products/IQScoreBadge";
import { HOT_PRODUCTS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

interface HotProduct {
  id: string;
  emoji?: string;
  name: string;
  niche: string;
  daily_sales: number;
  iq_score: number;
  margin_pct: number;
}

export function HotProductsCard({ products }: { products?: HotProduct[] }) {
  const items: HotProduct[] = products?.length ? products : HOT_PRODUCTS;
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #e4e1d8" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ color: "#23221f", fontWeight: 600, fontSize: 13 }}>Hot Products Now</span>
        </div>
        <Link
          href="/resources/top-products"
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#8a6530]"
          style={{ color: "#a07840" }}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Product rows */}
      <div className="flex-1">
        {items.map((product, i) => (
          <Link
            key={product.id}
            href={`/resources/top-products/${product.id}`}
            className="flex items-center gap-3 px-5 py-3 transition-colors group"
            style={{
              borderBottom: i < items.length - 1 ? "1px solid #1a1a20" : undefined,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f1ea")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Rank */}
            <span
              className="shrink-0 font-bold text-center"
              style={{
                width: 18,
                fontSize: 11,
                color: i === 0 ? "#a07840" : "#d4cfc2",
              }}
            >
              {i + 1}
            </span>

            {/* Emoji thumb */}
            <div
              className="shrink-0 flex items-center justify-center rounded-lg text-base"
              style={{ width: 34, height: 34, background: "#f3f1ea", border: "1px solid #e4e1d8" }}
            >
              {product.emoji}
            </div>

            {/* Name + niche */}
            <div className="flex-1 min-w-0">
              <p
                className="font-medium truncate text-[13px] transition-colors group-hover:text-[#23221f]"
                style={{ color: "#23221f" }}
              >
                {product.name}
              </p>
              <span
                className="inline-block rounded-full text-[10px] font-medium px-1.5 py-0.5 mt-0.5"
                style={{
                  background: "rgba(160,120,64,0.10)",
                  color: "#a07840",
                  border: "1px solid rgba(160,120,64,0.2)",
                }}
              >
                {product.niche}
              </span>
            </div>

            {/* Stats */}
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold" style={{ color: "#3e8f72" }}>
                {formatNumber(product.daily_sales)}/day
              </p>
              <p className="text-[10px]" style={{ color: "#4d4b44" }}>
                {product.margin_pct}% margin
              </p>
            </div>

            {/* IQ Score ring */}
            <IQScoreBadge score={product.iq_score} size={36} strokeWidth={3} />

            {/* Save button */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1.5"
              style={{ color: "#4d4b44" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#a07840"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#4d4b44"; }}
            >
              <Bookmark size={13} />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

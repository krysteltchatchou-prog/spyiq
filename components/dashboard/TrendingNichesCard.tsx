"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { TRENDING_NICHES } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const MOMENTUM = [
  { min: 30, label: "Exploding 🚀", color: "#3e8f72" },
  { min: 20, label: "Rising 📈",    color: "#a07840" },
  { min: 10, label: "Stable →",    color: "#4d4b44" },
  { min: 0,  label: "Declining 📉", color: "#d4685f" },
];

function getMomentum(growth: number) {
  return MOMENTUM.find((m) => growth >= m.min) ?? MOMENTUM[3];
}

export function TrendingNichesCard() {
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
          <span style={{ fontSize: 16 }}>📈</span>
          <span style={{ color: "#23221f", fontWeight: 600, fontSize: 13 }}>Trending Niches</span>
        </div>
        <Link
          href="/trends"
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#8a6530]"
          style={{ color: "#a07840" }}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Niche rows */}
      <div className="flex-1">
        {TRENDING_NICHES.map((niche, i) => {
          const momentum = getMomentum(niche.growth);
          return (
            <Link
              key={niche.id}
              href={`/trends?niche=${encodeURIComponent(niche.name)}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors"
              style={{ borderBottom: i < TRENDING_NICHES.length - 1 ? "1px solid #1a1a20" : undefined }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f1ea")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Emoji */}
              <div
                className="shrink-0 flex items-center justify-center rounded-lg text-base"
                style={{ width: 34, height: 34, background: "#f3f1ea", border: "1px solid #e4e1d8" }}
              >
                {niche.emoji}
              </div>

              {/* Name + products count */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[13px] truncate" style={{ color: "#23221f" }}>
                  {niche.name}
                </p>
                <p className="text-[10px]" style={{ color: "#4d4b44" }}>
                  {formatNumber(niche.products)} products
                </p>
              </div>

              {/* Sparkline */}
              <div className="shrink-0">
                <SparklineChart
                  data={niche.sparkline}
                  width={72}
                  height={24}
                  color={niche.growth >= 20 ? "#a07840" : "#8b8da0"}
                />
              </div>

              {/* Growth + momentum */}
              <div className="shrink-0 text-right" style={{ minWidth: 68 }}>
                <p className="text-xs font-bold" style={{ color: "#3e8f72" }}>
                  +{niche.growth}%
                </p>
                <p className="text-[10px]" style={{ color: momentum.color }}>
                  {momentum.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

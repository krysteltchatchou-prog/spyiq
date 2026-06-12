"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, ArrowRight, Check } from "lucide-react";
import { TRENDING_ADS } from "@/lib/mock-data";

const PLATFORMS = ["All", "TikTok", "Facebook", "Instagram", "YouTube", "Google"] as const;
type Platform = typeof PLATFORMS[number];

const PLATFORM_ICONS: Record<string, string> = {
  TikTok: "🎵", Facebook: "📘", Instagram: "📸", YouTube: "▶️", Google: "🔵",
};
const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "#5eb89a", Facebook: "#4a7fc1", Instagram: "#c49a5a",
  YouTube: "#d4685f", Google: "#8b8da0",
};

export function TrendingAdsWidget() {
  const [platform, setPlatform] = useState<Platform>("All");
  const [copied, setCopied] = useState<string | null>(null);

  const ads = platform === "All"
    ? TRENDING_ADS
    : TRENDING_ADS.filter((a) => a.platform === platform);

  function copyHook(id: string, hook: string) {
    navigator.clipboard.writeText(hook).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="rounded-xl flex flex-col" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #2a2a33" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>📣</span>
          <span style={{ color: "#f5f3ee", fontWeight: 600, fontSize: 13 }}>Trending Ads Now</span>
        </div>
        <Link href="/ad-spy" className="flex items-center gap-1 text-xs font-medium hover:text-[#c49a5a] transition-colors" style={{ color: "#a07840" }}>
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Platform tabs */}
      <div className="flex items-center gap-1 px-4 py-2.5 overflow-x-auto" style={{ borderBottom: "1px solid #1a1a20" }}>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className="shrink-0 rounded-full text-[11px] font-medium transition-all px-2.5 py-1"
            style={platform === p
              ? { background: "#a07840", color: "#f5f3ee" }
              : { background: "transparent", color: "#8a8a94" }}
          >
            {p !== "All" && PLATFORM_ICONS[p]} {p}
          </button>
        ))}
      </div>

      {/* Ad rows */}
      <div className="flex-1">
        {ads.map((ad, i) => (
          <div
            key={ad.id}
            className="flex items-start gap-3 px-5 py-3 group transition-colors"
            style={{ borderBottom: i < ads.length - 1 ? "1px solid #1a1a20" : undefined }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d1d24")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Platform icon */}
            <div
              className="shrink-0 flex items-center justify-center rounded-lg text-sm mt-0.5"
              style={{ width: 32, height: 32, background: "#1d1d24", border: "1px solid #2a2a33" }}
            >
              {PLATFORM_ICONS[ad.platform]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-semibold" style={{ color: "#f5f3ee" }}>
                  {ad.emoji} {ad.product}
                </span>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: `${PLATFORM_COLORS[ad.platform]}18`,
                    color: PLATFORM_COLORS[ad.platform],
                    border: `1px solid ${PLATFORM_COLORS[ad.platform]}30`,
                  }}
                >
                  {ad.platform}
                </span>
              </div>
              <p className="text-[12px] leading-snug italic line-clamp-2" style={{ color: "#8a8a94" }}>
                &ldquo;{ad.hook}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px]" style={{ color: "#5eb89a" }}>{ad.engagement}% eng.</span>
                <span className="text-[10px]" style={{ color: "#8a8a94" }}>{ad.days}d running</span>
                <span className="text-[10px]" style={{ color: "#8a8a94" }}>
                  ${(ad.est_spend / 1000).toFixed(1)}k spend
                </span>
              </div>
            </div>

            {/* Copy hook */}
            <button
              onClick={() => copyHook(ad.id, ad.hook)}
              className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all opacity-0 group-hover:opacity-100"
              style={{
                background: copied === ad.id ? "rgba(94,184,154,0.12)" : "#1d1d24",
                border: `1px solid ${copied === ad.id ? "rgba(94,184,154,0.3)" : "#2a2a33"}`,
                color: copied === ad.id ? "#5eb89a" : "#8a8a94",
              }}
            >
              {copied === ad.id ? <Check size={10} /> : <Copy size={10} />}
              {copied === ad.id ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

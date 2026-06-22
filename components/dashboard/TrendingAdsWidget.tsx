"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, ArrowRight, Check } from "lucide-react";
import { TRENDING_ADS } from "@/lib/mock-data";

const PLATFORMS = ["All", "TikTok", "Facebook", "Instagram", "YouTube", "Google"] as const;
type Platform = typeof PLATFORMS[number];

const PLATFORM_ICONS: Record<string, string> = {
  TikTok: "🎵", Facebook: "📘", Instagram: "📸", YouTube: "▶️", Google: "🔵",
};
const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "#3e8f72", Facebook: "#4a7fc1", Instagram: "#8a6530",
  YouTube: "#d4685f", Google: "#8b8da0",
};
const NICHE_EMOJI: Record<string, string> = {
  Beauty: "🧴", Pets: "🦮", "Home & Garden": "💡", Sports: "🏋️", Fashion: "🎒",
  "Health & Wellness": "🧍", Automotive: "🚗", Kids: "🌟", "Food & Beverage": "☕", Electronics: "🎧",
};

interface AdRow { id: string; emoji: string; product: string; platform: string; hook: string; engagement: number; days: number; est_spend: number }

const daysAgo = (iso: string) => Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));

export function TrendingAdsWidget() {
  const [platform, setPlatform] = useState<Platform>("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [ads, setAds] = useState<AdRow[]>(TRENDING_ADS as AdRow[]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (platform !== "All") params.set("platform", platform);
    fetch(`/api/ads?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active || !Array.isArray(data.ads)) return;
        setAds(
          data.ads.slice(0, 6).map((a: Record<string, unknown>) => ({
            id: String(a.ad_id),
            emoji: NICHE_EMOJI[String(a.niche)] ?? "🛍️",
            product: String(a.product_name),
            platform: String(a.platform),
            hook: String(a.hook_text),
            engagement: Number(a.engagement_rate) || 0,
            days: daysAgo(String(a.first_seen)),
            est_spend: Number(a.ad_spend_est) || 0,
          }))
        );
      })
      .catch(() => { /* keep current/mock data */ });
    return () => { active = false; };
  }, [platform]);

  function copyHook(id: string, hook: string) {
    navigator.clipboard.writeText(hook).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="rounded-xl flex flex-col" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e4e1d8" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>📣</span>
          <span style={{ color: "#23221f", fontWeight: 600, fontSize: 13 }}>Trending Ads Now</span>
        </div>
        <Link href="/ad-spy" className="flex items-center gap-1 text-xs font-medium hover:text-[#8a6530] transition-colors" style={{ color: "#a07840" }}>
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
              ? { background: "#a07840", color: "#23221f" }
              : { background: "transparent", color: "#4d4b44" }}
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
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f1ea")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Platform icon */}
            <div
              className="shrink-0 flex items-center justify-center rounded-lg text-sm mt-0.5"
              style={{ width: 32, height: 32, background: "#f3f1ea", border: "1px solid #e4e1d8" }}
            >
              {PLATFORM_ICONS[ad.platform]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-semibold" style={{ color: "#23221f" }}>
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
              <p className="text-[12px] leading-snug italic line-clamp-2" style={{ color: "#4d4b44" }}>
                &ldquo;{ad.hook}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px]" style={{ color: "#3e8f72" }}>{ad.engagement}% eng.</span>
                <span className="text-[10px]" style={{ color: "#4d4b44" }}>{ad.days}d running</span>
                <span className="text-[10px]" style={{ color: "#4d4b44" }}>
                  ${(ad.est_spend / 1000).toFixed(1)}k spend
                </span>
              </div>
            </div>

            {/* Copy hook */}
            <button
              onClick={() => copyHook(ad.id, ad.hook)}
              className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all opacity-0 group-hover:opacity-100"
              style={{
                background: copied === ad.id ? "rgba(94,184,154,0.12)" : "#f3f1ea",
                border: `1px solid ${copied === ad.id ? "rgba(94,184,154,0.3)" : "#e4e1d8"}`,
                color: copied === ad.id ? "#3e8f72" : "#4d4b44",
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

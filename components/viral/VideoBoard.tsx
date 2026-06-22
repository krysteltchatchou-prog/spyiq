"use client";
import { useState, useMemo } from "react";
import type { ViralVideo } from "@/lib/viral-data";
import { viralBand } from "@/lib/viralScore";

const PLATFORM_ICON: Record<string, string> = { TikTok: "🎵", Instagram: "📸", YouTube: "▶️" };

function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}
const daysAgo = (iso: string) => Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));

export default function VideoBoard({ videos }: { videos: ViralVideo[] }) {
  const niches = useMemo(() => ["All", ...Array.from(new Set(videos.map((v) => v.niche))).sort()], [videos]);
  const [niche, setNiche] = useState("All");
  const [platform, setPlatform] = useState("All");

  const filtered = useMemo(
    () => videos.filter((v) => (niche === "All" || v.niche === niche) && (platform === "All" || v.platform === platform)),
    [videos, niche, platform]
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {niches.map((n) => (
          <button key={n} onClick={() => setNiche(n)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: niche === n ? "#a07840" : "#ffffff",
              border: `1px solid ${niche === n ? "#a07840" : "#e4e1d8"}`,
              color: niche === n ? "#fdfbf6" : "#4d4b44",
            }}>{n}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "TikTok", "Instagram", "YouTube"].map((p) => (
          <button key={p} onClick={() => setPlatform(p)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: platform === p ? "#f3f1ea" : "transparent",
              border: `1px solid ${platform === p ? "#d4cfc2" : "#e4e1d8"}`,
              color: platform === p ? "#23221f" : "#5d5b54",
            }}>{p === "All" ? "All platforms" : `${PLATFORM_ICON[p]} ${p}`}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => {
          const band = viralBand(v.viral_score);
          return (
            <div key={v.video_id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              {/* Thumb */}
              <div className="relative h-44 flex items-center justify-center" style={{ background: "#f3f1ea" }}>
                <span className="text-5xl opacity-40">{PLATFORM_ICON[v.platform]}</span>
                <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "rgba(12,12,14,0.7)", color: "#fdfbf6" }}>
                  {PLATFORM_ICON[v.platform]} {v.platform}
                </span>
                <span className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: `${band.color}22`, color: band.color }}>
                  🔥 {v.viral_score}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: band.color }}>{band.label}</span>
                  <span className="text-xs" style={{ color: "#5d5b54" }}>{daysAgo(v.posted_at)}d ago</span>
                </div>
                <p className="font-bold text-sm" style={{ color: "#23221f" }}>{v.product_name}</p>
                <p className="text-xs mb-2" style={{ color: "#4d4b44" }}>
                  {v.creator_handle} · {compact(v.creator_followers)} followers
                </p>
                <p className="text-xs italic leading-relaxed mb-3 flex-1" style={{ color: "#c9c7c0" }}>&ldquo;{v.caption}&rdquo;</p>

                <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
                  {[
                    { label: "Views", value: compact(v.views_total) },
                    { label: "24h", value: compact(v.views_24h) },
                    { label: "Shares", value: compact(v.shares) },
                    { label: "Saves", value: compact(v.saves) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg py-1.5" style={{ background: "#f3f1ea" }}>
                      <p className="font-bold text-[11px]" style={{ color: "#23221f" }}>{s.value}</p>
                      <p className="text-[9px]" style={{ color: "#5d5b54" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <a href={v.product_url} target="_blank" rel="noopener noreferrer"
                  className="w-full text-center rounded-xl py-2 text-xs font-bold transition-all"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#8a6530" }}>
                  🔎 Find this product
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

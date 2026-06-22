"use client";
import { useState, useEffect, useCallback } from "react";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

interface Ad {
  ad_id: string; platform: string; product_name: string; niche: string; hook_text: string;
  likes: number; comments: number; shares: number; views: number; engagement_rate: number;
  ad_spend_est: number; is_active: boolean; country: string; shop_url: string; cta_text: string;
  first_seen: string;
}

const TABS = [
  { id: "All", label: "All", icon: "✨" },
  { id: "TikTok", label: "TikTok", icon: "🎵" },
  { id: "Facebook", label: "Facebook", icon: "📘" },
  { id: "Instagram", label: "Instagram", icon: "📸" },
  { id: "YouTube", label: "YouTube", icon: "▶️" },
  { id: "Google", label: "Google", icon: "🔵" },
];

const PLATFORM_ICON: Record<string, string> = { TikTok: "🎵", Facebook: "📘", Instagram: "📸", YouTube: "▶️", Google: "🔵" };

function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}
const money = (n: number) => "$" + Math.round(n).toLocaleString();
const daysAgo = (iso: string) => Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));

export default function AdBoard() {
  const [tab, setTab] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tab !== "All") params.set("platform", tab);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    try {
      const res = await fetch(`/api/ads?${params.toString()}`);
      const data = await res.json();
      setAds(data.ads || []);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [tab, keyword]);

  useEffect(() => { load(); }, [load]);

  function copyHook(ad: Ad) {
    navigator.clipboard?.writeText(ad.hook_text);
    setCopied(ad.ad_id);
    setTimeout(() => setCopied((c) => (c === ad.ad_id ? null : c)), 1500);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={{
              background: tab === t.id ? "#a07840" : "#ffffff",
              border: `1px solid ${tab === t.id ? "#a07840" : "#e4e1d8"}`,
              color: tab === t.id ? "#fdfbf6" : "#4d4b44",
            }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Keyword search */}
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search by product, niche or hook…"
        className="w-full rounded-xl px-4 py-2.5 text-sm mb-6"
        style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }} />

      {loading ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <p className="text-sm" style={{ color: "#4d4b44" }}>Loading ads…</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <p className="text-sm" style={{ color: "#4d4b44" }}>No ads match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ads.map((ad) => (
            <div key={ad.ad_id} className="rounded-2xl p-5 flex flex-col" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1"
                  style={{ background: "#f3f1ea", color: "#23221f" }}>
                  {PLATFORM_ICON[ad.platform]} {ad.platform}
                </span>
                <span className="text-xs rounded-full px-2 py-0.5"
                  style={{ background: ad.is_active ? "rgba(94,184,154,0.12)" : "#f3f1ea", color: ad.is_active ? "#3e8f72" : "#5d5b54" }}>
                  {ad.is_active ? "● Active" : "Paused"}
                </span>
              </div>

              <p className="font-bold text-sm" style={{ color: "#23221f" }}>{ad.product_name}</p>
              <p className="text-xs mb-3" style={{ color: "#4d4b44" }}>{ad.niche} · {ad.shop_url} · {ad.country}</p>

              <p className="text-sm italic leading-relaxed mb-4 flex-1" style={{ color: "#c9c7c0" }}>
                &ldquo;{ad.hook_text}&rdquo;
              </p>

              <div className="grid grid-cols-4 gap-1.5 mb-4 text-center">
                {[
                  { label: "Views", value: compact(ad.views) },
                  { label: "Eng.", value: `${ad.engagement_rate}%` },
                  { label: "Days", value: daysAgo(ad.first_seen).toString() },
                  { label: "Spend", value: money(ad.ad_spend_est) },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg py-1.5" style={{ background: "#f3f1ea" }}>
                    <p className="font-bold text-[11px]" style={{ color: "#23221f" }}>{s.value}</p>
                    <p className="text-[9px]" style={{ color: "#5d5b54" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <AiEstimateBadge />
              </div>

              <button onClick={() => copyHook(ad)}
                className="w-full rounded-xl py-2 text-xs font-bold transition-all"
                style={{
                  background: copied === ad.ad_id ? "rgba(94,184,154,0.15)" : "#f3f1ea",
                  border: "1px solid #e4e1d8",
                  color: copied === ad.ad_id ? "#3e8f72" : "#8a6530",
                }}>
                {copied === ad.ad_id ? "✓ Copied!" : "📋 Copy Hook"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

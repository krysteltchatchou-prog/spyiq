"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Clock, TrendingUp } from "lucide-react";

const RECENT_SEARCHES = [
  { domain: "gymshark.com",      niche: "Fitness",  revenue: "$12M/mo" },
  { domain: "petsuppliesplus.com",niche: "Pets",    revenue: "$4.2M/mo" },
  { domain: "beardbrand.com",    niche: "Grooming", revenue: "$890k/mo" },
];

const FEATURED_STORES = [
  { domain: "gymshark.com",        emoji: "🏋️", name: "Gymshark",          niche: "Fitness",  revenue: "$12M/mo",   traffic: "8.4M/mo" },
  { domain: "chubbiesshorts.com",  emoji: "🩳", name: "Chubbies",          niche: "Fashion",  revenue: "$3.1M/mo",  traffic: "1.2M/mo" },
  { domain: "beardbrand.com",      emoji: "🧔", name: "Beardbrand",        niche: "Grooming", revenue: "$890k/mo",  traffic: "420k/mo" },
  { domain: "tentree.com",         emoji: "🌳", name: "Tentree",           niche: "Eco",      revenue: "$2.4M/mo",  traffic: "980k/mo" },
  { domain: "blendjet.com",        emoji: "🥤", name: "BlendJet",          niche: "Kitchen",  revenue: "$5.8M/mo",  traffic: "3.1M/mo" },
  { domain: "brooklinen.com",      emoji: "🛏️", name: "Brooklinen",        niche: "Home",     revenue: "$7.2M/mo",  traffic: "2.8M/mo" },
];

export default function StoreSpyPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAnalyze(domain?: string) {
    const target = domain ?? query.trim();
    if (!target) return;
    const clean = target.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    setLoading(true);
    router.push(`/store-spy/${clean}`);
  }

  return (
    <div className="max-w-[900px]">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#23221f", letterSpacing: "-0.4px" }}>
          Store Spy
        </h1>
        <p className="text-sm" style={{ color: "#4d4b44" }}>
          Enter any Shopify store URL to get revenue estimates, top products, ad spend, traffic sources and more.
        </p>
      </div>

      {/* Search bar */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} color="#5d5b54" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="gymshark.com or https://gymshark.com"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-colors"
              style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={!query.trim() || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: !query.trim() ? "#e4e1d8" : "#a07840",
              color:      !query.trim() ? "#5d5b54"  : "#fdfbf6",
              cursor:     !query.trim() ? "not-allowed" : "pointer",
            }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Analyze Store
          </button>
        </div>

        {/* Recent searches */}
        {RECENT_SEARCHES.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#5d5b54" }}>
              <Clock size={11} /> Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((r) => (
                <button key={r.domain}
                  onClick={() => handleAnalyze(r.domain)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
                  {r.domain}
                  <span style={{ color: "#5d5b54" }}>·</span>
                  <span style={{ color: "#3e8f72" }}>{r.revenue}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured stores */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} color="#a07840" />
          <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Top Performing Stores</h2>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.25)", color: "#3e8f72" }}>
            LIVE
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_STORES.map((s) => (
            <button key={s.domain}
              onClick={() => handleAnalyze(s.domain)}
              className="text-left p-4 rounded-2xl sq-tile">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#23221f" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "#5d5b54" }}>{s.domain}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: "#3e8f72" }}>{s.revenue}</p>
                  <p className="text-xs" style={{ color: "#5d5b54" }}>revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#23221f" }}>{s.traffic}</p>
                  <p className="text-xs" style={{ color: "#5d5b54" }}>visitors</p>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                  {s.niche}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

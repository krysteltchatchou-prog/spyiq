"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Clock, TrendingUp } from "lucide-react";

const EXAMPLE_STORES = [
  { domain: "gymshark.com",        emoji: "🏋️", name: "Gymshark",          niche: "Fitness"  },
  { domain: "chubbiesshorts.com",  emoji: "🩳", name: "Chubbies",          niche: "Fashion"  },
  { domain: "beardbrand.com",      emoji: "🧔", name: "Beardbrand",        niche: "Grooming" },
  { domain: "tentree.com",         emoji: "🌳", name: "Tentree",           niche: "Eco"      },
  { domain: "blendjet.com",        emoji: "🥤", name: "BlendJet",          niche: "Kitchen"  },
  { domain: "brooklinen.com",      emoji: "🛏️", name: "Brooklinen",        niche: "Home"     },
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
    <div className="max-w-[900px] mx-auto">
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

        {/* Quick examples */}
        {EXAMPLE_STORES.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#5d5b54" }}>
              <Clock size={11} /> Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_STORES.slice(0, 3).map((r) => (
                <button key={r.domain}
                  onClick={() => handleAnalyze(r.domain)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
                  {r.domain}
                  <span style={{ color: "#5d5b54" }}>·</span>
                  <span style={{ color: "#5d5b54" }}>{r.niche}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Example stores to analyze */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={15} color="#a07840" />
          <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Popular stores to analyze</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: "#5d5b54" }}>
          Pick one to run a live scan — real catalog, apps and modeled traffic & revenue estimates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLE_STORES.map((s) => (
            <button key={s.domain}
              onClick={() => handleAnalyze(s.domain)}
              className="text-left p-4 rounded-2xl sq-tile flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{s.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#23221f" }}>{s.name}</p>
                  <p className="text-xs truncate" style={{ color: "#5d5b54" }}>{s.domain}</p>
                </div>
              </div>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium flex-shrink-0"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                {s.niche}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

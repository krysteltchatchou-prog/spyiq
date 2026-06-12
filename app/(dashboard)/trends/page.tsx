"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";

const CATEGORIES = ["All", "Fashion", "Electronics", "Home", "Beauty", "Fitness", "Pets", "Seasonal"] as const;
type Category = typeof CATEGORIES[number];

const SORT_OPTIONS = ["Fastest Growing", "Highest Volume", "Most Products"] as const;
type SortOpt = typeof SORT_OPTIONS[number];

const NICHES = [
  { id:"n1",  emoji:"🧴", name:"Skincare & Beauty",    category:"Beauty",      products:284, growth:38, volume:148_000, sparkline:[40,44,43,51,58,62,71,68,76,82,79,88], momentum:"Exploding" },
  { id:"n2",  emoji:"🏠", name:"Smart Home",            category:"Electronics", products:197, growth:29, volume:92_000,  sparkline:[30,32,34,33,39,44,47,45,51,54,52,58], momentum:"Rising"    },
  { id:"n3",  emoji:"🐕", name:"Pet Accessories",       category:"Pets",        products:163, growth:24, volume:76_000,  sparkline:[28,27,30,31,34,37,40,38,44,46,45,49], momentum:"Rising"    },
  { id:"n4",  emoji:"🏋️", name:"Home Fitness",          category:"Fitness",     products:142, growth:19, volume:64_000,  sparkline:[22,24,23,26,27,29,31,30,34,35,34,37], momentum:"Stable"    },
  { id:"n5",  emoji:"🌿", name:"Eco & Sustainable",     category:"Home",        products:118, growth:16, volume:48_000,  sparkline:[18,19,19,21,22,23,24,23,26,27,26,28], momentum:"Stable"    },
  { id:"n6",  emoji:"💄", name:"Cosmetics & Makeup",    category:"Beauty",      products:211, growth:31, volume:124_000, sparkline:[36,38,37,42,47,49,54,52,58,62,60,66], momentum:"Rising"    },
  { id:"n7",  emoji:"🧸", name:"Kids & Toys",           category:"Seasonal",    products:94,  growth:44, volume:82_000,  sparkline:[24,26,28,31,38,44,52,61,68,72,70,78], momentum:"Exploding" },
  { id:"n8",  emoji:"🎮", name:"Gaming Accessories",    category:"Electronics", products:156, growth:21, volume:88_000,  sparkline:[32,34,35,33,37,39,42,41,45,47,46,50], momentum:"Stable"    },
  { id:"n9",  emoji:"☕", name:"Kitchen & Coffee",       category:"Home",        products:108, growth:-4, volume:54_000,  sparkline:[38,37,36,35,34,33,32,31,30,29,28,27], momentum:"Declining" },
  { id:"n10", emoji:"🧘", name:"Wellness & Meditation", category:"Fitness",     products:87,  growth:33, volume:58_000,  sparkline:[20,21,22,24,26,28,30,29,33,36,34,39], momentum:"Rising"    },
  { id:"n11", emoji:"🎒", name:"Travel Gear",            category:"Fashion",     products:72,  growth:12, volume:42_000,  sparkline:[18,18,19,19,20,21,22,21,23,24,23,25], momentum:"Stable"    },
  { id:"n12", emoji:"🪴", name:"Indoor Plants & Decor", category:"Home",        products:63,  growth:51, volume:68_000,  sparkline:[16,18,20,24,28,32,36,41,46,52,56,62], momentum:"Exploding" },
];

const MOMENTUM_STYLES: Record<string, { color: string; icon: string }> = {
  "Exploding": { color: "#d4685f", icon: "🚀" },
  "Rising":    { color: "#5eb89a", icon: "📈" },
  "Stable":    { color: "#8b8da0", icon: "→" },
  "Declining": { color: "#5c5c64", icon: "📉" },
};

function fmtVolume(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export default function TrendsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOpt>("Fastest Growing");
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());

  function toggleAlert(id: string) {
    setAlertedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = NICHES
    .filter((n) => activeCategory === "All" || n.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Fastest Growing")  return b.growth - a.growth;
      if (sortBy === "Highest Volume")   return b.volume - a.volume;
      return b.products - a.products;
    });

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-bold" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>Trend Radar</h1>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.3)", color: "#5eb89a" }}>
            LIVE
          </span>
        </div>
        <p className="text-sm" style={{ color: "#8a8a94" }}>Real-time niche momentum. Set alerts to catch the next spike before everyone else.</p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[58px] z-20 -mx-7 px-7 py-3 mb-6"
        style={{ background: "#0c0c0e", borderBottom: "1px solid #2a2a33" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c}
                onClick={() => setActiveCategory(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeCategory === c ? "#a07840" : "#15151a",
                  border:     `1px solid ${activeCategory === c ? "#a07840" : "#2a2a33"}`,
                  color:      activeCategory === c ? "#f5f3ee" : "#8a8a94",
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#5c5c64" }}>Sort:</span>
            {SORT_OPTIONS.map((s) => (
              <button key={s}
                onClick={() => setSortBy(s)}
                className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sortBy === s ? "rgba(160,120,64,0.15)" : "#15151a",
                  border:     `1px solid ${sortBy === s ? "#a07840" : "#2a2a33"}`,
                  color:      sortBy === s ? "#c49a5a" : "#8a8a94",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((niche) => {
          const ms = MOMENTUM_STYLES[niche.momentum];
          const isAlerted = alertedIds.has(niche.id);

          return (
            <div key={niche.id}
              className="rounded-2xl p-5 transition-all"
              style={{ background: "#15151a", border: "1px solid #2a2a33" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}>

              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{niche.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{niche.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#5c5c64" }}>{niche.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAlert(niche.id)}
                  className="p-1.5 rounded-lg transition-all"
                  title={isAlerted ? "Remove alert" : "Set alert"}
                  style={{
                    background: isAlerted ? "rgba(160,120,64,0.15)" : "transparent",
                    border: `1px solid ${isAlerted ? "#a07840" : "#2a2a33"}`,
                    color: isAlerted ? "#a07840" : "#5c5c64",
                  }}>
                  <Bell size={13} fill={isAlerted ? "#a07840" : "none"} />
                </button>
              </div>

              {/* Sparkline */}
              <div className="mb-4" style={{ height: 60 }}>
                <SparklineChart
                  data={niche.sparkline}
                  color={niche.growth >= 30 ? "#5eb89a" : niche.growth < 0 ? "#d4685f" : "#a07840"}
                  height={60}
                />
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px]" style={{ color: "#5c5c64" }}>Search Volume</p>
                    <p className="text-sm font-bold" style={{ color: "#f5f3ee" }}>{fmtVolume(niche.volume)}/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: "#5c5c64" }}>Products</p>
                    <p className="text-sm font-bold" style={{ color: "#f5f3ee" }}>{niche.products}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span style={{ color: ms.color, fontSize: 13 }}>{niche.growth > 0 ? "▲" : "▼"}</span>
                    <span className="text-sm font-bold" style={{ color: ms.color }}>{Math.abs(niche.growth)}%</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-[10px]">{ms.icon}</span>
                    <span className="text-[10px] font-semibold" style={{ color: ms.color }}>{niche.momentum}</span>
                  </div>
                </div>
              </div>

              {isAlerted && (
                <div className="mt-3 pt-3 flex items-center gap-1.5" style={{ borderTop: "1px solid #1d1d24" }}>
                  <Bell size={11} color="#a07840" fill="#a07840" />
                  <span className="text-[10px] font-medium" style={{ color: "#a07840" }}>Alert active — you&apos;ll be notified when this niche spikes</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { TOP_STORE_APPS } from "@/lib/mock-data";

const CATEGORY_COLORS: Record<string, string> = {
  Reviews:    "#5eb89a",
  Email:      "#a07840",
  Upsell:     "#c49a5a",
  Analytics:  "#8b8da0",
  Fulfilment: "#d4b572",
  Loyalty:    "#5eb89a",
  Trust:      "#8b8da0",
  Conversion: "#a07840",
};

export function TopAppsWidget() {
  const [spinning, setSpinning] = useState(false);

  return (
    <div className="rounded-xl flex flex-col" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #2a2a33" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🏆</span>
          <span style={{ color: "#f5f3ee", fontWeight: 600, fontSize: 13 }}>Apps Top Stores Use</span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(160,120,64,0.12)", color: "#a07840", border: "1px solid rgba(160,120,64,0.2)" }}>
            Shopify
          </span>
        </div>
        <button
          onClick={() => { setSpinning(true); setTimeout(() => setSpinning(false), 800); }}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
          style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
        >
          <RefreshCw size={11} className={spinning ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* App rows */}
      <div className="flex-1">
        {TOP_STORE_APPS.map((app, i) => {
          const color = CATEGORY_COLORS[app.category] ?? "#8b8da0";
          return (
            <div
              key={app.name}
              className="flex items-center gap-3 px-5 py-3 transition-colors"
              style={{ borderBottom: i < TOP_STORE_APPS.length - 1 ? "1px solid #1a1a20" : undefined }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d1d24")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* App icon */}
              <div
                className="shrink-0 flex items-center justify-center rounded-lg text-base"
                style={{ width: 32, height: 32, background: "#1d1d24", border: "1px solid #2a2a33" }}
              >
                {app.emoji}
              </div>

              {/* Name + desc */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold truncate" style={{ color: "#f5f3ee" }}>{app.name}</span>
                  <span
                    className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                  >
                    {app.category}
                  </span>
                </div>
                <p className="text-[11px] truncate mt-0.5" style={{ color: "#8a8a94" }}>{app.desc}</p>
              </div>

              {/* Usage bar */}
              <div className="shrink-0 text-right" style={{ width: 64 }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: "#f5f3ee" }}>{app.pct}%</p>
                <div className="rounded-full overflow-hidden" style={{ height: 3, background: "#2a2a33" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${app.pct}%`, background: `linear-gradient(90deg, #a07840, #c49a5a)` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

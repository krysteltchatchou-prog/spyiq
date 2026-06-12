"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AI_INSIGHTS } from "@/lib/mock-data";

type InsightType = "Opportunity" | "Warning" | "Insight" | "Alert";

const TYPE_COLORS: Record<InsightType, { border: string; badge: string; text: string }> = {
  Opportunity: { border: "#5eb89a", badge: "rgba(94,184,154,0.12)",  text: "#5eb89a" },
  Warning:     { border: "#d4b572", badge: "rgba(212,181,114,0.12)", text: "#d4b572" },
  Insight:     { border: "#a07840", badge: "rgba(160,120,64,0.12)",  text: "#c49a5a" },
  Alert:       { border: "#d4685f", badge: "rgba(212,104,95,0.12)",  text: "#d4685f" },
};

export function InsightsFeed() {
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }

  return (
    <div
      className="rounded-xl"
      style={{ background: "#15151a", border: "1px solid #2a2a33" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #2a2a33" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🤖</span>
          <span style={{ color: "#f5f3ee", fontWeight: 600, fontSize: 13 }}>AI Insights</span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(160,120,64,0.12)", color: "#a07840", border: "1px solid rgba(160,120,64,0.2)" }}
          >
            Live
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
          style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
        >
          <RefreshCw
            size={11}
            className={spinning ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* 2×2 insight grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {AI_INSIGHTS.map((insight) => {
          const colors = TYPE_COLORS[insight.type];
          return (
            <div
              key={insight.id}
              className="rounded-xl p-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              style={{
                background: "#0c0c0e",
                border: "1px solid #2a2a33",
                borderLeft: `3px solid ${colors.border}`,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <span style={{ fontSize: 15, lineHeight: 1.3 }}>{insight.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full tracking-wide"
                      style={{ background: colors.badge, color: colors.text, border: `1px solid ${colors.border}30` }}
                    >
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: "#f5f3ee" }}>
                    {insight.title}
                  </p>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "#8a8a94" }}>
                {insight.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

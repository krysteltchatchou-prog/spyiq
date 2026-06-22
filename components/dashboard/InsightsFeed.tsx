"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AI_INSIGHTS } from "@/lib/mock-data";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

type InsightType = "Opportunity" | "Warning" | "Insight" | "Alert";

const TYPE_COLORS: Record<InsightType, { border: string; badge: string; text: string }> = {
  Opportunity: { border: "#3e8f72", badge: "rgba(94,184,154,0.12)",  text: "#3e8f72" },
  Warning:     { border: "#c08a2a", badge: "rgba(212,181,114,0.12)", text: "#c08a2a" },
  Insight:     { border: "#a07840", badge: "rgba(160,120,64,0.12)",  text: "#8a6530" },
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
      style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #e4e1d8" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🤖</span>
          <span style={{ color: "#23221f", fontWeight: 600, fontSize: 13 }}>AI Insights</span>
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
          style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
        >
          <RefreshCw
            size={11}
            className={spinning ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* 2×2 insight grid */}
      <AiEstimateBadge variant="banner" className="mx-4 mt-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {AI_INSIGHTS.map((insight) => {
          const colors = TYPE_COLORS[insight.type];
          return (
            <div
              key={insight.id}
              className="rounded-xl p-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              style={{
                background: "#f4f2ec",
                border: "1px solid #e4e1d8",
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
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: "#23221f" }}>
                    {insight.title}
                  </p>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "#4d4b44" }}>
                {insight.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

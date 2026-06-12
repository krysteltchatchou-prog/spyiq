"use client";
import { Info, Package, Trophy, Store, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DASHBOARD_STATS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { useDateRange } from "@/hooks/useDateRange";

const CARDS = [
  {
    key: "products_tracked",
    label: "Products Tracked",
    icon: Package,
    iconColor: "#a07840",
    iconBg: "rgba(160,120,64,0.12)",
    tooltip: "Total products in our intelligence database, updated every 6 hours.",
    value: (s: typeof DASHBOARD_STATS) => formatNumber(s.products_tracked),
    delta: (s: typeof DASHBOARD_STATS) => s.products_delta,
  },
  {
    key: "winning_products",
    label: "Winning Products",
    icon: Trophy,
    iconColor: "#5eb89a",
    iconBg: "rgba(94,184,154,0.12)",
    tooltip: "Products with IQ Score ≥ 80 that are currently trending.",
    value: (s: typeof DASHBOARD_STATS) => formatNumber(s.winning_products),
    delta: (s: typeof DASHBOARD_STATS) => s.winning_delta,
  },
  {
    key: "stores_analyzed",
    label: "Stores Analyzed",
    icon: Store,
    iconColor: "#8b8da0",
    iconBg: "rgba(139,141,160,0.12)",
    tooltip: "Shopify stores we've run full intelligence reports on.",
    value: (s: typeof DASHBOARD_STATS) => formatNumber(s.stores_analyzed),
    delta: (s: typeof DASHBOARD_STATS) => s.stores_delta,
  },
  {
    key: "ai_credits",
    label: "AI Credits Used",
    icon: Zap,
    iconColor: "#d4b572",
    iconBg: "rgba(212,181,114,0.12)",
    tooltip: "AI analysis credits consumed this month. Resets on your billing date.",
    value: (s: typeof DASHBOARD_STATS) => `${s.ai_credits_used} / ${s.ai_credits_limit}`,
    delta: (s: typeof DASHBOARD_STATS) => s.ai_credits_delta,
    isCredit: true,
  },
];

export function StatsGrid() {
  const { range } = useDateRange();
  const stats = DASHBOARD_STATS;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((card) => {
          const Icon  = card.icon;
          const delta = card.delta(stats);
          const up    = delta >= 0;
          const pct   = Math.abs(delta);

          return (
            <div
              key={card.key}
              className="rounded-xl p-5 transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              style={{
                background: "#15151a",
                border: "1px solid #2a2a33",
                borderTop: `2px solid ${card.iconColor}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 34, height: 34, background: card.iconBg }}
                >
                  <Icon size={16} color={card.iconColor} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="opacity-40 hover:opacity-70 transition-opacity">
                      <Info size={13} color="#8a8a94" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{card.tooltip}</TooltipContent>
                </Tooltip>
              </div>

              {/* Value */}
              <p
                className="font-bold tracking-tight"
                style={{ fontSize: 26, color: "#f5f3ee", letterSpacing: "-1px", lineHeight: 1 }}
              >
                {card.value(stats)}
              </p>

              {/* Label */}
              <p className="mt-1 text-xs" style={{ color: "#8a8a94" }}>{card.label}</p>

              {/* Credit bar */}
              {"isCredit" in card && card.isCredit && (
                <div
                  className="mt-3 rounded-full overflow-hidden"
                  style={{ height: 3, background: "#2a2a33" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(stats.ai_credits_used / stats.ai_credits_limit) * 100}%`,
                      background: stats.ai_credits_used / stats.ai_credits_limit > 0.85 ? "#d4685f" : "#d4b572",
                    }}
                  />
                </div>
              )}

              {/* Delta */}
              {!("isCredit" in card && card.isCredit) && (
                <p className="mt-2 text-xs font-medium" style={{ color: up ? "#5eb89a" : "#d4685f" }}>
                  {up ? "▲" : "▼"} {pct}% vs last {range}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

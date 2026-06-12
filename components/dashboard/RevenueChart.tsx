"use client";
import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { REVENUE_CHART_DATA } from "@/lib/mock-data";
import { useDateRange } from "@/hooks/useDateRange";
import { formatCurrency, formatNumber } from "@/lib/utils";

const TABS = ["Revenue", "Top Products", "Ad Spend"] as const;
type Tab = typeof TABS[number];

const METRICS = [
  { key: "revenue",  label: "Gross Revenue", color: "#a07840" },
  { key: "profit",   label: "Net Profit",    color: "#5eb89a" },
  { key: "orders",   label: "Orders",        color: "#8b8da0" },
] as const;

// Custom tooltip
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs"
      style={{ background: "#1d1d24", border: "1px solid #2a2a33", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
    >
      <p className="font-semibold mb-1.5" style={{ color: "#f5f3ee" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="rounded-full" style={{ width: 6, height: 6, background: p.color, display:"inline-block" }} />
          <span style={{ color: "#8a8a94" }}>
            {p.dataKey.startsWith("prev") ? "Prev " : ""}
            {p.dataKey.includes("orders") ? "Orders" : p.dataKey.includes("profit") ? "Profit" : "Revenue"}:
          </span>
          <span style={{ color: "#f5f3ee", fontWeight: 600 }}>
            {p.dataKey.includes("orders") ? formatNumber(p.value) : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const [tab, setTab]               = useState<Tab>("Revenue");
  const [activeMetrics, setActive]  = useState(new Set(["revenue"]));
  const [showPrev, setShowPrev]     = useState(true);
  const { range }                   = useDateRange();

  // Slice data based on selected range
  const points = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 30 : 30;
  const data   = REVENUE_CHART_DATA.slice(-points);

  function toggleMetric(key: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key) && next.size > 1) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Total for header
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const prev  = data.reduce((s, d) => s + d.prev_revenue, 0);
  const deltaPct = ((total - prev) / prev * 100).toFixed(1);
  const up       = total >= prev;

  return (
    <div
      className="rounded-xl"
      style={{ background: "#15151a", border: "1px solid #2a2a33" }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid #2a2a33" }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#5c5c64", letterSpacing: "0.5px" }}>
            {tab}
          </p>
          <p className="font-bold" style={{ fontSize: 26, color: "#f5f3ee", letterSpacing: "-1px" }}>
            {formatCurrency(total)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: up ? "#5eb89a" : "#d4685f" }}>
            {up ? "▲" : "▼"} {Math.abs(Number(deltaPct))}% vs previous period
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-md px-3 py-1 text-xs font-medium transition-all"
              style={tab === t
                ? { background: "#a07840", color: "#f5f3ee" }
                : { color: "#8a8a94" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggles */}
      <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: "1px solid #1a1a20" }}>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
            style={{ opacity: activeMetrics.has(m.key) ? 1 : 0.35 }}
          >
            <span className="rounded-sm" style={{ width: 10, height: 10, background: m.color, display:"inline-block" }} />
            <span style={{ color: "#d4cfc7" }}>{m.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setShowPrev((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
            style={{ opacity: showPrev ? 1 : 0.35 }}
          >
            {/* dotted line indicator */}
            <svg width={16} height={8}>
              <line x1="0" y1="4" x2="16" y2="4" stroke="#8b8da0" strokeWidth={1.5} strokeDasharray="3 2" />
            </svg>
            <span style={{ color: "#8a8a94" }}>Previous period</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pt-4 pb-3" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#a07840" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a07840" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5eb89a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#5eb89a" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1d1d24" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#5c5c64", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis
              tick={{ fill: "#5c5c64", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={42}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2a2a33", strokeWidth: 1 }} />

            {/* Previous period — dotted */}
            {showPrev && (
              <Area
                type="monotone"
                dataKey="prev_revenue"
                stroke="#8b8da0"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                fill="none"
                dot={false}
                activeDot={false}
              />
            )}

            {/* Current period lines */}
            {activeMetrics.has("revenue") && (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#a07840"
                strokeWidth={2}
                fill="url(#gradRevenue)"
                dot={false}
                activeDot={{ r: 4, fill: "#a07840", stroke: "#0c0c0e", strokeWidth: 2 }}
              />
            )}
            {activeMetrics.has("profit") && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#5eb89a"
                strokeWidth={2}
                fill="url(#gradProfit)"
                dot={false}
                activeDot={{ r: 4, fill: "#5eb89a", stroke: "#0c0c0e", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

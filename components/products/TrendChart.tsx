"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Fixed data so SSR and client match
const EPOCH = new Date("2026-05-13").getTime();
const OFFSETS = [0,120,80,-40,200,160,240,-80,320,280,400,360,440,200,520,480,560,320,640,600,720,480,800,760,840,600,920,880,960,820];

interface Props {
  monthlyBase: number;
}

export function TrendChart({ monthlyBase }: Props) {
  const daily = Math.round(monthlyBase / 30);
  const data = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(EPOCH + i * 86_400_000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sales: Math.max(0, daily + OFFSETS[i]),
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#a07840" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#a07840" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: "#5d5b54", fontSize: 10 }} tickLine={false} axisLine={false}
          interval={6} />
        <YAxis tick={{ fill: "#5d5b54", fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#f3f1ea", border: "1px solid #e4e1d8", borderRadius: 8, color: "#23221f", fontSize: 12 }}
          labelStyle={{ color: "#4d4b44" }}
          cursor={{ stroke: "#e4e1d8" }}
        />
        <Area type="monotone" dataKey="sales" stroke="#a07840" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

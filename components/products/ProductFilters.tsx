"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { NICHES } from "@/lib/constants";

export type SortKey = "iq_score" | "monthly_sales_est" | "margin_pct" | "created_at" | "viral_score";

export interface FilterState {
  search:     string;
  niches:     string[];
  iq_min:     number;
  iq_max:     number;
  sales_min:  number;
  trending:   boolean;
  supplier:   boolean;
  platform:   string;
  sort:       SortKey;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "", niches: [], iq_min: 0, iq_max: 100,
  sales_min: 0, trending: false, supplier: false, platform: "All", sort: "iq_score",
};

const PLATFORMS = ["All", "TikTok", "Facebook", "Instagram", "YouTube", "Google"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "iq_score",          label: "IQ Score"      },
  { value: "monthly_sales_est", label: "Monthly Sales" },
  { value: "margin_pct",        label: "Margin %"      },
  { value: "viral_score",       label: "Viral Score"   },
  { value: "created_at",        label: "Newest"        },
];

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export function ProductFilters({ filters, onChange }: Props) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange({ ...filters, [k]: v });

  function toggleNiche(n: string) {
    const next = filters.niches.includes(n)
      ? filters.niches.filter((x) => x !== n)
      : [...filters.niches, n];
    set("niches", next);
  }

  const hasActive =
    filters.search || filters.niches.length || filters.iq_min > 0 ||
    filters.trending || filters.supplier || filters.platform !== "All";

  return (
    <div
      className="rounded-xl p-4 space-y-3 sticky top-[58px] z-20"
      style={{ background: "#15151a", border: "1px solid #2a2a33" }}
    >
      {/* Row 1: search + sort + clear */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" color="#5c5c64" />
          <input
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-lg pl-8 pr-3 py-2 text-[13px] transition-colors"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={13} color="#8a8a94" />
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value as SortKey)}
            className="rounded-lg px-2.5 py-2 text-[12px] font-medium appearance-none cursor-pointer"
            style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-1 rounded-lg overflow-hidden"
          style={{ border: "1px solid #2a2a33", background: "#1d1d24" }}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => set("platform", p)}
              className="px-2.5 py-1.5 text-[11px] font-medium transition-colors"
              style={filters.platform === p
                ? { background: "#a07840", color: "#f5f3ee" }
                : { color: "#8a8a94" }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Toggle: trending */}
        <button
          onClick={() => set("trending", !filters.trending)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={filters.trending
            ? { background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.3)", color: "#5eb89a" }
            : { background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
        >
          🔥 Trending
        </button>

        {/* Toggle: supplier */}
        <button
          onClick={() => set("supplier", !filters.supplier)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={filters.supplier
            ? { background: "rgba(160,120,64,0.12)", border: "1px solid rgba(160,120,64,0.3)", color: "#c49a5a" }
            : { background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
        >
          📦 Supplier
        </button>

        {/* Clear */}
        {hasActive && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors"
            style={{ color: "#d4685f", background: "rgba(212,104,95,0.08)", border: "1px solid rgba(212,104,95,0.2)" }}
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Row 2: niche pills */}
      <div className="flex flex-wrap gap-1.5">
        {NICHES.map((n) => {
          const active = filters.niches.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggleNiche(n)}
              className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-all"
              style={active
                ? { background: "#a07840", color: "#f5f3ee" }
                : { background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Row 3: IQ Score range */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium shrink-0" style={{ color: "#8a8a94" }}>IQ Score</span>
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min={0} max={100} value={filters.iq_min}
            onChange={(e) => set("iq_min", +e.target.value)}
            className="flex-1 accent-[#a07840]" style={{ accentColor: "#a07840" }} />
          <span className="text-[11px] font-bold shrink-0 tabular-nums" style={{ color: "#c49a5a", minWidth: 24 }}>
            {filters.iq_min}+
          </span>
        </div>
      </div>
    </div>
  );
}

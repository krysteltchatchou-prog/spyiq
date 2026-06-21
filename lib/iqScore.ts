// SpyIQ — IQ Score engine
// Weighted blend of four signals (sum of weights = 1.0):
//   demand 35% · margin 25% · trend 25% · competition 15%
// Returns an integer 1–100 (higher = stronger winner).

export const IQ_WEIGHTS = {
  demand: 0.35,
  margin: 0.25,
  trend: 0.25,
  competition: 0.15,
} as const;

export interface IQSubScores {
  /** 0–100, higher = more demand */
  demand: number;
  /** 0–100, higher = better margin */
  margin: number;
  /** 0–100, higher = stronger upward trend */
  trend: number;
  /** 0–100, higher = LESS competition (more headroom) */
  competition: number;
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Combine four normalized sub-scores (0–100) into a single IQ Score (1–100). */
export function calculateIQScore(s: IQSubScores): number {
  const raw =
    clamp(s.demand) * IQ_WEIGHTS.demand +
    clamp(s.margin) * IQ_WEIGHTS.margin +
    clamp(s.trend) * IQ_WEIGHTS.trend +
    clamp(s.competition) * IQ_WEIGHTS.competition;
  return clamp(Math.round(raw), 1, 100);
}

// ─── Helpers to derive sub-scores from raw product metrics ──────────────────

/** Monthly sales → demand score. ~5k+ sales/mo saturates to 100. */
export function demandScore(monthlySales: number): number {
  return clamp((Math.log10(Math.max(1, monthlySales)) / Math.log10(5000)) * 100);
}

/** Margin % (0–100) maps roughly linearly; 80%+ margin saturates. */
export function marginScore(marginPct: number): number {
  return clamp((marginPct / 80) * 100);
}

/** Search growth % (can be negative) → trend score centered at 0 growth = 50. */
export function trendScore(searchGrowthPct: number): number {
  return clamp(50 + searchGrowthPct / 2);
}

/** Competition level → headroom score (low competition = high score). */
export function competitionScore(level: "low" | "medium" | "high"): number {
  return { low: 90, medium: 55, high: 25 }[level] ?? 50;
}

export interface RawProductMetrics {
  monthly_sales_est: number;
  margin_pct: number;
  search_growth: number;
  competition_level: "low" | "medium" | "high";
}

/** Compute the IQ Score directly from a product's raw metrics. */
export function iqScoreFromProduct(p: RawProductMetrics): number {
  return calculateIQScore({
    demand: demandScore(p.monthly_sales_est),
    margin: marginScore(p.margin_pct),
    trend: trendScore(p.search_growth),
    competition: competitionScore(p.competition_level),
  });
}

/** Human label + color for an IQ Score band. */
export function iqScoreBand(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Winner", color: "#5eb89a" };
  if (score >= 70) return { label: "Strong", color: "#c49a5a" };
  if (score >= 50) return { label: "Average", color: "#d4b572" };
  return { label: "Weak", color: "#d4685f" };
}

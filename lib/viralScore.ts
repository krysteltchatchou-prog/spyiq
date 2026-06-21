// SpyIQ — Viral Score engine for the Viral Video Tracker.
// Weighted blend (sum = 1.0):
//   view velocity 35% · share rate 30% · save rate 20% · engagement 15%
// Returns an integer 1–100 (higher = more viral right now).

export const VIRAL_WEIGHTS = {
  velocity: 0.35,
  shareRate: 0.30,
  saveRate: 0.20,
  engagement: 0.15,
} as const;

export interface ViralInputs {
  views_total: number;
  views_24h: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Velocity score from last-24h views. ~2M views/24h saturates to 100. */
function velocityScore(views24h: number): number {
  return clamp((Math.log10(Math.max(1, views24h)) / Math.log10(2_000_000)) * 100);
}

/** A per-view rate (shares/views etc.) scaled so `target` maps to 100. */
function rateScore(numerator: number, views: number, target: number): number {
  if (views <= 0) return 0;
  return clamp((numerator / views / target) * 100);
}

export function calculateViralScore(v: ViralInputs): number {
  const views = Math.max(1, v.views_total);
  const velocity = velocityScore(v.views_24h);
  const shareRate = rateScore(v.shares, views, 0.05);      // 5% share rate = 100
  const saveRate = rateScore(v.saves, views, 0.08);        // 8% save rate = 100
  const engagement = rateScore(v.likes + v.comments, views, 0.15); // 15% = 100

  const raw =
    velocity * VIRAL_WEIGHTS.velocity +
    shareRate * VIRAL_WEIGHTS.shareRate +
    saveRate * VIRAL_WEIGHTS.saveRate +
    engagement * VIRAL_WEIGHTS.engagement;

  return clamp(Math.round(raw), 1, 100);
}

/** Human label + color for a viral score band. */
export function viralBand(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Exploding 🚀", color: "#5eb89a" };
  if (score >= 70) return { label: "Rising 📈", color: "#c49a5a" };
  if (score >= 50) return { label: "Warm", color: "#d4b572" };
  return { label: "Cooling", color: "#8a8a94" };
}

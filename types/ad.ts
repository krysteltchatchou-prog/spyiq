export type AdPlatform = "Facebook" | "TikTok" | "Instagram" | "YouTube" | "Google";

export interface Ad {
  id: string;
  product_name: string;
  emoji?: string;
  niche: string;
  platform: AdPlatform;
  hook: string;
  engagement_rate: number;
  days_running: number;
  est_spend: number;
  target_audience?: string;
  created_at: string;
}

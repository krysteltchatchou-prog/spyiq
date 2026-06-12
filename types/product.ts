export interface Product {
  id: string;
  name: string;
  emoji?: string;
  niche: string;
  iq_score: number;
  demand_score: number;
  competition_score: number;
  margin_pct: number;
  viral_score: number;
  monthly_sales_est: number;
  price_range_low: number;
  price_range_high: number;
  supplier_available: boolean;
  is_trending: boolean;
  keywords: string[];
  target_audiences: string[];
  platforms: string[];
  last_updated: string;
  created_at: string;
}

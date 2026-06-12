export interface StoreAnalysis {
  id: string;
  domain: string;
  store_name: string;
  niche: string;
  monthly_revenue_est: number;
  monthly_traffic_est: number;
  products_count: number;
  avg_order_value: number;
  ad_spend_monthly_est: number;
  founded_year: number;
  theme?: string;
  top_products: TopProduct[];
  traffic_sources: TrafficSource[];
  social_data?: Record<string, number>;
  ai_verdict?: string;
  analyzed_at: string;
}

export interface TopProduct {
  name: string;
  emoji?: string;
  monthly_sales_est: number;
  price: number;
  margin_pct: number;
}

export interface TrafficSource {
  source: string;
  percentage: number;
}

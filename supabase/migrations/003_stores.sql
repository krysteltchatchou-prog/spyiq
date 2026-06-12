CREATE TABLE store_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  store_name TEXT,
  niche TEXT,
  monthly_revenue_est NUMERIC,
  monthly_traffic_est INT,
  products_count INT,
  avg_order_value NUMERIC,
  ad_spend_monthly_est NUMERIC,
  founded_year INT,
  theme TEXT,
  top_products JSONB,
  traffic_sources JSONB,
  social_data JSONB,
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX store_analyses_domain_idx ON store_analyses(domain);

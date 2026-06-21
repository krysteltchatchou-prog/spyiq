-- Features 2 & 5 — Store Spy scans + Top Shops Directory
-- Public catalog of scanned Shopify stores. Written by the service role
-- (store-spy API), read publicly for the Top Shops leaderboard.

CREATE TABLE IF NOT EXISTS shops (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id             TEXT UNIQUE NOT NULL,        -- slug, e.g. "allbirds-com"
  store_url            TEXT NOT NULL,
  store_name           TEXT,
  niche                TEXT,
  country              TEXT,
  monthly_revenue_est  NUMERIC,
  monthly_traffic_est  INT,
  monthly_ad_spend_est NUMERIC,
  top_products         JSONB DEFAULT '[]',
  installed_apps       JSONB DEFAULT '[]',
  theme_name           TEXT,
  social_links         JSONB DEFAULT '{}',
  avg_product_price    NUMERIC,
  product_count        INT,
  store_age_days       INT,
  revenue_growth       NUMERIC,
  spyiq_rank           INT,
  last_scanned         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shops_niche_idx   ON shops(niche);
CREATE INDEX IF NOT EXISTS shops_country_idx ON shops(country);
CREATE INDEX IF NOT EXISTS shops_revenue_idx ON shops(monthly_revenue_est DESC);
CREATE INDEX IF NOT EXISTS shops_rank_idx    ON shops(spyiq_rank);

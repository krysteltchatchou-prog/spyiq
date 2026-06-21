CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT,
  niche TEXT,
  iq_score INT CHECK (iq_score BETWEEN 0 AND 100),
  demand_score INT,
  competition_score INT,
  margin_pct NUMERIC,
  viral_score INT,
  monthly_sales_est INT,
  price_range_low NUMERIC,
  price_range_high NUMERIC,
  supplier_available BOOLEAN DEFAULT true,
  is_trending BOOLEAN DEFAULT false,
  keywords TEXT[],
  target_audiences TEXT[],
  platforms TEXT[],
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE keyword_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  search_volume_est INT,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  trend_direction TEXT,
  related_keywords TEXT[],
  platforms JSONB,
  last_updated TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX products_niche_idx ON products(niche);
CREATE INDEX products_iq_score_idx ON products(iq_score DESC);
CREATE INDEX products_trending_idx ON products(is_trending);

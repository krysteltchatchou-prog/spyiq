-- Feature 1 — Winner Products Board
-- Extends the existing `products` table (002_products.sql) with the columns
-- the Winner Products Board needs. Non-destructive: safe to run on an existing DB.

ALTER TABLE products ADD COLUMN IF NOT EXISTS product_id          TEXT UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url           TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_usd           NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cogs_est            NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stores_count        INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS monthly_revenue_est NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_volume       INT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_growth       NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ad_count            INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS competition_level   TEXT CHECK (competition_level IN ('low','medium','high'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS trend_direction     TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS suppliers           JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS top_stores          JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS first_seen          TIMESTAMPTZ DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured         BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS products_competition_idx ON products(competition_level);
CREATE INDEX IF NOT EXISTS products_featured_idx    ON products(is_featured);
CREATE INDEX IF NOT EXISTS products_price_idx       ON products(price_usd);

-- The Winner Products Board is public, read-only catalog data.
-- (No RLS needed — these rows are not user-scoped. Writes happen via the service role.)

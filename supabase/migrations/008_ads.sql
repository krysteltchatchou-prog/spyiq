-- Feature 3 — Ad Intelligence
-- Public catalog of winning ads, synced periodically (Vercel Cron → lib/syncAds).

CREATE TABLE IF NOT EXISTS ads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id           TEXT UNIQUE NOT NULL,
  platform        TEXT CHECK (platform IN ('TikTok','Facebook','Instagram','YouTube','Google')),
  product_name    TEXT,
  niche           TEXT,
  hook_text       TEXT,
  video_url       TEXT,
  likes           INT DEFAULT 0,
  comments        INT DEFAULT 0,
  shares          INT DEFAULT 0,
  views           INT DEFAULT 0,
  engagement_rate NUMERIC,
  ad_spend_est    NUMERIC,
  first_seen      TIMESTAMPTZ DEFAULT now(),
  last_seen       TIMESTAMPTZ DEFAULT now(),
  is_active       BOOLEAN DEFAULT true,
  country         TEXT,
  shop_url        TEXT,
  cta_text        TEXT
);

CREATE INDEX IF NOT EXISTS ads_platform_idx   ON ads(platform);
CREATE INDEX IF NOT EXISTS ads_niche_idx       ON ads(niche);
CREATE INDEX IF NOT EXISTS ads_engagement_idx  ON ads(engagement_rate DESC);
CREATE INDEX IF NOT EXISTS ads_active_idx       ON ads(is_active);

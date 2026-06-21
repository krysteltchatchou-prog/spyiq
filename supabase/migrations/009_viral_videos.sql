-- Feature 4 — Viral Video Tracker
-- Public catalog of trending product videos scored by viral_score.

CREATE TABLE IF NOT EXISTS viral_videos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id          TEXT UNIQUE NOT NULL,
  platform          TEXT CHECK (platform IN ('TikTok','Instagram','YouTube')),
  creator_handle    TEXT,
  creator_followers INT,
  product_name      TEXT,
  product_url       TEXT,
  views_total       BIGINT,
  views_24h         BIGINT,
  view_velocity     NUMERIC,
  likes             INT,
  comments          INT,
  shares            INT,
  saves             INT,
  caption           TEXT,
  hashtags          TEXT[],
  audio_name        TEXT,
  thumbnail_url     TEXT,
  posted_at         TIMESTAMPTZ,
  niche             TEXT,
  viral_score       INT CHECK (viral_score BETWEEN 0 AND 100),
  last_updated      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS viral_niche_idx    ON viral_videos(niche);
CREATE INDEX IF NOT EXISTS viral_platform_idx ON viral_videos(platform);
CREATE INDEX IF NOT EXISTS viral_score_idx     ON viral_videos(viral_score DESC);

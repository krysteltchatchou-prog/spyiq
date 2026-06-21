-- Migration 010: Shopify connections (per-user OAuth tokens)
-- One row per user per connected Shopify store. The access_token lets SpyIQ
-- create products in that merchant's store on their behalf. User-scoped + RLS on,
-- and the token is only ever read server-side via the service role.

CREATE TABLE IF NOT EXISTS shopify_connections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_domain   TEXT NOT NULL,             -- e.g. "my-store.myshopify.com"
  access_token  TEXT NOT NULL,
  scope         TEXT,
  installed_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, shop_domain)
);

ALTER TABLE shopify_connections ENABLE ROW LEVEL SECURITY;

-- Users can see/manage only their own connections. Server writes use the
-- service role (which bypasses RLS), so this policy is just the safety net.
CREATE POLICY "Users see own shopify connections"
  ON shopify_connections FOR ALL
  USING (auth.uid() = user_id);

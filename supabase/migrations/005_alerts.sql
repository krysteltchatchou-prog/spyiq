CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('trend', 'competitor', 'price_drop', 'new_product', 'store_change')),
  title TEXT,
  body TEXT,
  metadata JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE generated_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT,
  niche TEXT,
  style TEXT,
  language TEXT,
  generated_data JSONB,
  shopify_domain TEXT,
  pushed_to_shopify BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own chat" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own stores" ON generated_stores FOR ALL USING (auth.uid() = user_id);

CREATE INDEX alerts_user_idx ON alerts(user_id, read);
CREATE INDEX chat_sessions_user_idx ON chat_sessions(user_id);

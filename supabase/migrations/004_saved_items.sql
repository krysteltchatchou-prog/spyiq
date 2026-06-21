CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('product', 'store', 'ad', 'keyword')),
  item_id TEXT,
  item_data JSONB,
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);

CREATE INDEX saved_items_user_idx ON saved_items(user_id);
CREATE INDEX saved_items_type_idx ON saved_items(item_type);

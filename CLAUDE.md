# SpyIQ — AI Ecommerce Intelligence Platform
## CLAUDE.md — Project Blueprint for Claude Code

---

## 🎯 PRODUCT VISION

SpyIQ is a **Shopify & dropshipping intelligence SaaS** that combines:
- **Helium 10's** depth (30+ tools, keyword research, competitor analytics, alerts)
- **Copyfy's** clean UX (ad spy, product database, store analysis, fast workflow)
- **Claude Sonnet 4.6** AI woven into every feature (not bolted on)

**Core promise:** Find your next winning product, spy on any competitor, and launch faster — all in one place.

**Target users:** Shopify store owners, dropshippers, ecommerce entrepreneurs (beginner to advanced)

**Differentiator from Helium 10:** Built for Shopify/dropshipping (not Amazon). Cleaner, less overwhelming.
**Differentiator from Copyfy:** AI-powered throughout (not just product pages). Better UX, deeper data.

---

## 🛠️ TECH STACK

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS + shadcn/ui
AI:           Anthropic SDK — claude-sonnet-4-6
Database:     Supabase (Postgres + Row Level Security)
Auth:         Supabase Auth (email + Google OAuth)
Payments:     Stripe (subscriptions + usage billing)
Cache:        Redis (Upstash) for rate limiting & caching
Deployment:   Vercel
```

---

## 🎨 DESIGN SYSTEM

### Philosophy
**User-friendly first.** Helium 10's biggest complaint is being overwhelming. SpyIQ must feel like it has 5 tools that do everything, not 30 tools that confuse you. Progressive disclosure: simple by default, powerful when you dig in.

### Color Palette
```
Background:       #0c0c0e   (near-black, luxury base)
Surface:          #15151a   (card backgrounds)
Surface2:         #1d1d24   (hover states, inputs)
Surface3:         #1f1f26   (modals, dropdowns — elevated above cards)
Border:           #2a2a33   (subtle dividers)
Accent:           #a07840   (gold — primary CTA, luxury editorial)
Accent Light:     #c49a5a   (hover, links)
Accent Glow:      rgba(160,120,64,0.12)
Secondary Accent: #8b8da0   (muted blue-grey, secondary actions)
Green:            #5eb89a   (positive, up trends)
Red:              #d4685f   (warnings, down trends)
Yellow:           #d4b572   (caution)
Text:             #f5f3ee   (warm white, primary)
Muted:            #8a8a94   (labels, secondary)
Disabled BG:      #3a3a42
Disabled Text:    #5c5c64
Focus Ring:       rgba(160,120,64,0.38)
Error BG:         rgba(212,104,95,0.10)
Success BG:       rgba(94,184,154,0.10)
```

### Typography
```
Font: Inter (Google Fonts)
Display: 700 weight, -0.5px letter-spacing
Body: 400/500, 14px, 1.6 line-height
Labels: 500, 11-12px, uppercase, 0.5px tracking
Numbers/Stats: 700-800 weight, -1px letter-spacing
```

### Layout
- **Fixed sidebar** (210px) — always visible, never collapses on desktop
- **Sticky topbar** (58px) — page title + contextual actions
- **Content area** — 28px padding, max-width 1400px
- **Cards** — 12px border-radius, 1px border, subtle shadow on hover
- **No gradients** on backgrounds — flat, dark, surgical

### Component Rules
- Buttons: 6px border-radius, 600 weight, 12px font
- Inputs: dark background (#1d1d24), gold focus ring (`rgba(160,120,64,0.38)`), disabled state `#3a3a42` bg / `#5c5c64` text
- Tables: alternating rows (#15151a / transparent), sticky header
- Charts: gold (#a07840) as primary line/bar with area fill, green (#5eb89a) for positive, red (#d4685f) for negative, dotted line for previous period comparison (Helium 10 pattern), no grid clutter
- Badges: small pill, 9-10px font, glass style (low opacity bg + border)
- Empty states: always include an action CTA, never just "No data"
- Logo: SpyIQ PNG logo at 135px wide, transparent background, inside 58px header box
- Nav items: grouped into sections (Overview / Research / Spy Tools / AI / My SpyIQ), active state has gold left border + glow
- Topbar: date range filter (7D/30D/90D/1Y) shown contextually only on data pages
- Sidebar width: 210px fixed, logo box 58px tall matching topbar height exactly

---

## 🧭 NAVIGATION STRUCTURE

Sidebar grouped into 5 sections (exactly as built):
- **Overview:** Dashboard
- **Research:** Product Database, Trend Radar (Live badge), Keywords
- **Spy Tools:** Store Spy, Ad Intelligence
- **AI:** AI Analyzer, AI Store Builder
- **My SpyIQ:** Saved Items, Alerts (badge with count)

Date filter (7D/30D/90D/1Y) in topbar — only visible on: Dashboard, Products, Trends pages. Hidden on all other pages.

---

## 🗂️ PROJECT STRUCTURE

```
spyiq/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Sidebar + Topbar shell
│   │   ├── dashboard/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx            ← Product Database
│   │   │   └── [id]/page.tsx       ← Product Detail
│   │   ├── trends/page.tsx
│   │   ├── store-spy/
│   │   │   ├── page.tsx
│   │   │   └── [domain]/page.tsx
│   │   ├── ad-spy/page.tsx
│   │   ├── keyword-research/page.tsx
│   │   ├── ai-analyzer/page.tsx
│   │   ├── saved/page.tsx
│   │   ├── alerts/page.tsx
│   │   └── settings/page.tsx
│   ├── (landing)/
│   │   └── page.tsx                ← Marketing landing page
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/route.ts       ← AI chat endpoint
│   │   │   ├── analyze/route.ts    ← Product analysis
│   │   │   └── score/route.ts      ← IQ Score calculator
│   │   ├── products/route.ts
│   │   ├── trends/route.ts
│   │   ├── stores/route.ts
│   │   ├── ads/route.ts
│   │   ├── keywords/route.ts
│   │   └── webhooks/stripe/route.ts
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── StatsGrid.tsx
│   │   ├── HotProductsCard.tsx
│   │   ├── TrendingNichesCard.tsx
│   │   └── InsightsFeed.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductTable.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── IQScoreBadge.tsx
│   │   └── ProductDetailModal.tsx
│   ├── store-spy/
│   │   ├── StoreSearchBar.tsx
│   │   ├── StoreOverview.tsx
│   │   ├── StoreProducts.tsx
│   │   ├── StoreTrafficChart.tsx
│   │   └── StoreAdsSection.tsx
│   ├── ad-spy/
│   │   ├── AdCard.tsx
│   │   ├── AdFilters.tsx
│   │   └── AdDetailDrawer.tsx
│   ├── ai/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── AnalysisPanel.tsx
│   │   └── AIInsightCard.tsx
│   ├── charts/
│   │   ├── SparklineChart.tsx
│   │   ├── TrendChart.tsx
│   │   ├── SalesVelocityChart.tsx
│   │   └── KeywordVolumeChart.tsx
│   └── ui/                         ← shadcn/ui components
├── lib/
│   ├── anthropic.ts                ← Anthropic client + helpers
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe.ts
│   ├── redis.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useStoreAnalysis.ts
│   ├── useAIChat.ts
│   ├── useSavedProducts.ts
│   └── useAlerts.ts
├── types/
│   ├── product.ts
│   ├── store.ts
│   ├── ad.ts
│   └── user.ts
└── supabase/
    └── migrations/
        ├── 001_users.sql
        ├── 002_products.sql
        ├── 003_stores.sql
        ├── 004_saved_items.sql
        └── 005_alerts.sql
```

---

## 📋 DATABASE SCHEMA (Supabase / Postgres)

```sql
-- Users & subscriptions
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  ai_credits_used INT DEFAULT 0,
  ai_credits_limit INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product database (cached AI results)
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

-- Store spy cache
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

-- Saved products & stores
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('product', 'store', 'ad', 'keyword')),
  item_id TEXT,
  item_data JSONB,
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT now()
);

-- Alerts
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

-- AI chat history
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Keyword research cache
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies (users only see their own data)
CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own chat" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
```

---

## 🔧 CORE FEATURES — DETAILED SPECS

### 1. DASHBOARD (`/dashboard`)

**Philosophy:** Like Helium 10's Insights Dashboard but cleaner. One screen, everything at a glance.

**Layout (top to bottom):**
1. **KPI Cards row** (4 cards) — Products Tracked, Winning Products, Stores Analyzed, AI Credits Used
2. **Revenue Chart** — Helium 10-style tabbed graph (Revenue / Top Products / Ad Spend tabs)
3. **2-column row** — "Hot Products Now" + "Trending Niches" (with sparklines)
4. **AI Insights panel** — 2×2 grid of insight cards
5. **AI Store Builder widget** — full-width, gold-bordered card with URL input
6. **2-column row** — "Trending Ads Now" + "Apps Top Stores Use"

**KPI Cards:** period comparison below each value ("▲ 14% vs last 30D"), tooltip icon on every label (Helium 10 pattern), gold top accent bar

**Revenue Chart (Helium 10-inspired):**
- Tabs: Revenue / Top Products / Ad Spend
- Metric toggles: Gross Revenue, Net Profit, Orders (checkboxes)
- Comparison toggle: solid line = current period, dotted line = previous period
- Gold primary line with area fill gradient, green secondary line
- Event markers (circles) on notable data points
- X-axis date labels, Y-axis value labels

**Hot Products:** 5 rows — emoji thumb, name, niche tag, daily sales, IQ Score ring chart, margin %. Click row → AI Analyzer with that product pre-loaded

**Trending Niches:** 5 rows — emoji, name, product count, 7-point sparkline SVG, growth %

**AI Insights panel:** 2×2 grid. Each card has colored left border (green=Opportunity, yellow=Warning, gold=Insight, red=Alert), icon, title, body, type badge. Refresh button.

**AI Store Builder widget:**
- Gold-accented border, gradient background
- Headline: "From any link to a store ready to sell — in 60 seconds"
- Subtext: "Paste an AliExpress, Amazon or Shopify product link. SpyIQ's AI retrieves the images, writes all the copy, builds conversion-optimised blocks, and generates a complete store. Personalise, import to Shopify — and start your first sales."
- URL input + "⚡ Generate Store" button
- 4 feature mini-cards: Brand Identity / Full Copywriting / Ad Hooks / Shopify Import
- Live progress screen (hidden until generation starts): each step checks off in sequence with ✓
- Generation steps: Fetching product data → Retrieving images → Generating brand identity → Writing copy → Building home page → Creating ad hooks → Packaging for Shopify
- Links to full AI Store Builder page

**Trending Ads Now widget:**
- Platform filter tabs: All / 🎵 TikTok / 📘 Facebook / 📸 Instagram / ▶️ YouTube / 🔵 Google
- Each row: platform icon, product name + emoji, ad hook in italic, engagement %, days running, est. spend, 📋 copy hook button
- Clicking a row → navigates to Ad Intelligence page
- AI-generated fresh on each dashboard load, refreshes on platform tab switch

**Apps Top Stores Use widget:**
- Shows 8 most-used Shopify apps by top-performing dropshipping stores
- Each row: app emoji icon, app name, category badge, short description, usage % bar
- Categories: Reviews / Upsell / Email / Analytics / Fulfilment / Loyalty / Trust / Conversion
- Usage bar fills with gold gradient proportional to % of top stores using it
- Refresh button re-generates via Claude

**Empty state (new users):** Onboarding checklist widget. "Complete these 3 steps to see your dashboard fill up."

---

### 2. PRODUCT DATABASE (`/products`)

**Inspired by:** Helium 10 Black Box + Copyfy Product Database

**Layout:** Full-page table with sticky filter bar at top, product cards grid toggle

**Filter bar (sticky, important for UX):**
- Search input (keyword)
- Niche dropdown (multi-select): Fashion, Electronics, Home & Garden, Beauty, Sports, Pets, Kids, etc.
- IQ Score slider: 0–100
- Monthly Sales: range input
- Profit Margin %: range input
- Platform: All / TikTok Viral / Facebook / Instagram
- Trending: toggle
- Supplier Available: toggle
- Sort by: IQ Score / Sales / Margin / Newest / Trending

**Product Table columns:**
| # | Product | Niche | IQ Score | Est. Sales/mo | Margin | Trending | Actions |
|---|---------|-------|----------|---------------|--------|----------|---------|

**Product Card (grid view):**
- Emoji thumbnail with trending badge
- Name, niche tag
- IQ Score ring chart (small, 40px)
- 3 stats: Sales, Margin, Viral Score
- Buttons: "Save" (bookmark) + "Analyze with AI" + "Find Supplier"

**Product Detail Page (`/products/[id]`):**
Full analysis page:
- Header: name, niche, IQ Score large ring chart
- Score breakdown: Demand / Competition / Margin / Viral (horizontal bars with explanations)
- Sales trend chart (30-day sparkline, Recharts)
- Keywords section: cloud of related keywords with search volumes
- Target audiences: colored tags (age + interest)
- Competitor analysis: 3 stores selling this product
- AI Analysis panel: auto-generated Claude insights (300 words)
- Supplier suggestions: 3 AliExpress-style results
- Action bar: Save / Export / Share / "Import to Shopify" (future)

---

### 3. TREND RADAR (`/trends`)

**Inspired by:** Helium 10 Trendster + Google Trends but for Shopify niches

**Layout:** 3-column grid of niche trend cards + full-page trend chart on click

**Trend Cards:**
- Niche name + emoji
- 7-day sparkline chart (SVG, animated on load)
- Growth % badge (green/red)
- Search volume estimate
- Number of trending products in niche
- Momentum indicator: "Exploding 🚀" / "Rising 📈" / "Stable →" / "Declining 📉"

**Top section:**
- Category filter pills: All / Fashion / Electronics / Home / Beauty / Sports / Pets / Seasonal
- Time range: 7D / 30D / 90D
- Sort: Fastest Growing / Highest Volume / Most Products

**Trend Detail (click on card):**
- Full 30-day chart with volume overlay
- Top 5 products in this niche right now
- AI market analysis (Claude-generated, 200 words)
- "Set Alert" button → notifies user when trend spikes

---

### 4. STORE SPY (`/store-spy`)

**Inspired by:** Copyfy Shop Analysis + TrendTrack competitor intelligence

**Search:** Clean URL input with "Analyze" button. Recent searches shown below.

**Results layout (after analysis):**
- Store header: logo/emoji, name, domain, niche badge, "Track Store" button
- Tab navigation: Overview / Products / Ads / Traffic / Apps

**Overview tab:**
- 8-stat grid: Monthly Revenue (est.), Monthly Traffic, Products Count, Avg Order Value, Ad Spend, Founded, Social Followers, Conversion Rate (est.)
- Revenue trend chart (12-month line chart)

**Products tab:**
- Table: product name, emoji, est. sales/month, price, margin %, "Spy" action
- Sort by sales, margin, recency

**Ads tab:**
- Grid of active ad creatives (emoji placeholder + hook text)
- Platform badge (FB / TikTok / Instagram)
- Est. spend, days running, engagement rate
- "Copy Hook" button (copies the ad hook to clipboard — Copyfy-inspired)

**Traffic tab:**
- Donut chart: traffic sources breakdown (Organic / Paid / Social / Direct / Referral)
- Country breakdown bar chart
- Monthly visitor trend

**Shopify Apps tab:**
- List of detected/estimated Shopify apps used by this store, with emoji icons
- Categories: Analytics / Marketing / Reviews / Fulfilment / Upsell / Loyalty / Trust
- Usage likelihood % bar for each app
- "Used by X% of stores in this niche" context label

**AI Verdict tab:**
- Claude-generated 3–5 sentence analysis of the store
- Covers: main traffic driver, top product signals, scaling velocity, weaknesses

**AI Verdict (always visible panel on right):**
Claude-generated 3-sentence verdict: "This store is scaling fast in the [niche] niche. Their main traffic driver is paid social (62%). Their top product [X] shows strong repeat purchase signals."

---

### 5. AD SPY (`/ad-spy`)

**Inspired by:** Copyfy Ad Spy (TikTok + Meta) + Minea

**Layout:** Masonry/grid of ad cards with sticky filter bar

**Filters:**
- Platform: All / 📘 Facebook / 🎵 TikTok / 📸 Instagram / ▶️ YouTube / 🔵 Google
- Niche: dropdown multi-select
- Days Running: 1–7 / 7–30 / 30–90 / 90+
- Engagement Rate: slider
- Est. Spend: range
- Sort: Most Engaging / Most Recent / Longest Running / Highest Spend

**Ad Card:**
- Emoji thumbnail (placeholder for actual creative)
- Product name + niche tag
- Platform badge
- "Hook" preview text (first 2 lines of ad copy, italic)
- 3 stats: Engagement %, Days Running, Est. Spend
- CTA bar: "Copy Hook" / "Find Product" / "Save Ad"

**Ad Detail Drawer (slide from right):**
- Full hook text
- Target audience details
- Performance metrics timeline
- Similar products selling this
- AI creative analysis: "This ad works because..."
- "Generate similar hook" button → Claude writes 3 variations

---

### 6. KEYWORD RESEARCH (`/keyword-research`)

**Inspired by:** Helium 10 Magnet + Cerebro (but for Shopify/Google, not Amazon)

**Search:** Input with "Research" button. Supports single keyword or competitor domain.

**Results layout:**
- Main keyword stats: Search Volume, Competition, Trend Direction, IQ Score
- 30-day volume trend chart
- Related keywords table:
  | Keyword | Volume/mo | Competition | Trend | Score | Action |
- "Questions" section: common questions around this keyword
- AI Keyword Brief (Claude): best angle to target this keyword, which audience, which product types

**Export:** CSV download of all keywords

---

### 7. AI ANALYZER (`/ai-analyzer`)

**The flagship feature. Claude Sonnet 4.6 as your ecommerce co-pilot.**

**Layout:** Split panel
- Left: Chat interface (full height)
- Right: Dynamic context panel (updates based on conversation)

**Chat interface:**
- Conversation history persisted in Supabase
- Markdown rendering in messages
- Typing animation (3-dot bounce)
- Quick prompt chips below input:
  - "Find me a winning product under $30"
  - "Analyze this niche: [user types]"
  - "Is [product] worth dropshipping?"
  - "What's trending this week?"
  - "Write a product description for [X]"
  - "Compare [store A] vs [store B]"

**Context panel (dynamic):**
- Updates as user discusses a product: shows IQ Score breakdown
- If discussing a niche: shows trend chart + top products
- If discussing an ad: shows hook analysis
- If discussing a store: shows store overview stats
- Always shows: "Related Products" and "Suggested Next Steps"

**System prompt for Claude:**
```
You are SpyIQ, an expert AI ecommerce intelligence assistant for Shopify 
and dropshipping entrepreneurs. You have deep knowledge of:
- Product research and winner identification
- Shopify store optimization
- Dropshipping supplier sourcing
- Facebook and TikTok ad strategy
- Niche selection and market sizing
- Competitor analysis
- Pricing strategy

Always be specific, data-driven, and actionable. Give concrete recommendations.
When analyzing a product, always mention: demand, competition, margin potential, 
target audience, and one risk factor. Use numbers when possible.
Keep responses concise but comprehensive. Use bullet points for lists.
```

---

### 8. SAVED ITEMS (`/saved`)

**Layout:** Tabs — Saved Products / Saved Stores / Saved Ads / Saved Keywords

Each tab shows a grid/table of saved items with:
- Item thumbnail/emoji + name
- Date saved
- Quick stats (IQ Score for products, Revenue for stores)
- Notes field (editable inline)
- Remove button
- "Open Full Analysis" link

**Bulk actions:** Select all / Export CSV / Delete selected

---

### 9. ALERTS (`/alerts`)

**Inspired by:** Helium 10 Alerts system

**Alert types:**
- 🚀 New Trending Product (in saved niches)
- 📉 Price Drop (on tracked stores)
- 🔥 Niche Spike (volume up 50%+ in 48h)
- 👀 New Competitor Store (in tracked niche)
- 📣 New Ad Spotted (from tracked store)
- ⚠️ Product Saturation Warning

**Settings panel:** User sets up alert preferences:
- Which niches to monitor
- Which stores to track
- Alert frequency: Real-time / Daily digest / Weekly

**Alert card:**
- Icon + color left border (green=opportunity, yellow=warning, red=urgent)
- Title + body
- Timestamp
- Action button: "View Product" / "Analyze Store" / "Dismiss"
- Read/unread state

---

### 10. LANDING PAGE (`/`)

**Structure:**
1. **Hero:** "Find Winning Products Before Everyone Else" — headline, 3-word subline, CTA "Start for Free", animated product card preview
2. **Social proof bar:** "2,400+ dropshippers use SpyIQ" + logos strip
3. **Features section:** 6 feature cards in 2-row grid (Product Database / Store Spy / Ad Spy / Trend Radar / AI Analyzer / Keyword Research)
4. **How it works:** 3-step process (Find → Spy → Launch)
5. **Comparison table:** SpyIQ vs Helium 10 vs Copyfy (SpyIQ wins on key dimensions)
6. **Testimonials:** 3 cards with avatar + quote + metrics ("Found my winning product in 4 hours")
7. **Pricing section** (see below)
8. **FAQ:** 6 questions
9. **Final CTA:** "Start your free trial today"

---

## 💳 PRICING

| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 5 product searches/day, 3 store analyses, no AI chat |
| Starter | $29/mo | 50 searches/day, 20 stores, 100 AI credits/mo |
| Pro | $79/mo | Unlimited searches, 100 stores/mo, 500 AI credits, alerts, keyword research |
| Agency | $199/mo | Everything unlimited, 5 team seats, API access, white-label |

**Free trial:** 5-day full Pro access on signup (no credit card required)

**Stripe integration:**
- Subscriptions via Stripe Checkout
- Usage-based AI credits (overages billed at $0.05/credit)
- Stripe webhook → update profiles.plan in Supabase
- Billing portal via Stripe Customer Portal

---

## 🤖 AI INTEGRATION — ANTHROPIC SDK

```typescript
// lib/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SPYIQ_SYSTEM_PROMPT = `You are SpyIQ, an expert AI ecommerce 
intelligence assistant for Shopify and dropshipping entrepreneurs...`;

// Product IQ Score generation
export async function generateIQScore(productName: string, niche: string) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: 'Return only valid JSON. No markdown.',
    messages: [{
      role: 'user',
      content: `Generate a realistic IQ score breakdown for dropshipping product: "${productName}" in niche: "${niche}".
      Return JSON: { iq_score, demand_score, competition_score, margin_pct, viral_score, reasoning }`
    }]
  });
  return JSON.parse(msg.content[0].text);
}

// Store analysis generation
export async function analyzeStore(domain: string) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: 'Return only valid JSON. No markdown.',
    messages: [{
      role: 'user',
      content: `Generate a realistic Shopify store intelligence report for: ${domain}
      Return JSON: { store_name, niche, monthly_revenue_est, monthly_traffic_est, products_count,
        avg_order_value, ad_spend_monthly_est, founded_year, top_products, traffic_sources, ai_verdict }`
    }]
  });
  return JSON.parse(msg.content[0].text);
}

// Streaming chat
export async function streamChat(messages: any[], res: Response) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: SPYIQ_SYSTEM_PROMPT,
    messages,
  });
  // pipe stream to response
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
    }
  }
}
```

---

## 🛡️ RATE LIMITING & CACHING

```typescript
// lib/redis.ts — Upstash Redis
// Rate limits by plan:
const RATE_LIMITS = {
  free:    { searches: 5,   stores: 3,   ai: 0    },
  starter: { searches: 50,  stores: 20,  ai: 100  },
  pro:     { searches: 999, stores: 100, ai: 500  },
  agency:  { searches: 999, stores: 999, ai: 9999 },
};

// Cache AI responses (TTL: 1 hour for products, 6 hours for stores)
// Key format: "product:{name}:{niche}", "store:{domain}"
```

---

## 🚀 ENVIRONMENT VARIABLES

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ANTHROPIC_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📱 RESPONSIVE DESIGN

- **Desktop (1280px+):** Full sidebar + full feature set
- **Tablet (768–1280px):** Collapsible sidebar (icon-only mode)
- **Mobile (<768px):** Bottom navigation bar (5 icons), stacked layouts, simplified charts

---

## ✅ BUILD ORDER (recommended for Claude Code)

Build in this exact order:

1. **Project setup** — Next.js 14, Tailwind, shadcn/ui, env vars
2. **Supabase** — migrations, RLS policies, auth config
3. **Auth pages** — login, signup, forgot password
4. **Dashboard layout** — sidebar (210px), topbar (58px), logo box (58px, same height as topbar), routing shell with nav sections
5. **Dashboard page** — stats cards, hot products, trends, insights
6. **Product Database** — filters, table, grid toggle, product cards
7. **Product Detail page** — IQ score, charts, AI analysis
8. **Store Spy** — search, overview, tabs, AI verdict
9. **Ad Spy** — grid, filters, ad cards, drawer
10. **Trend Radar** — cards, sparklines, category filters
11. **Keyword Research** — search, results table, AI brief
12. **AI Analyzer** — chat interface, streaming, context panel
13. **Saved Items** — tabbed saved list
14. **Alerts** — list, settings, mark as read
15. **Settings page** — profile, billing, notifications, API key
16. **Stripe integration** — checkout, webhooks, billing portal
17. **Landing page** — hero, features, pricing, testimonials
18. **Rate limiting** — Redis middleware
19. **Caching** — Redis cache for AI responses
20. **Polish** — loading skeletons, empty states, error boundaries, toasts

---

## 🎨 FINAL UI DECISIONS (locked — do not change)

These were finalized during design iteration and must be respected exactly:

| Element | Value | Notes |
|---|---|---|
| Sidebar width | 210px fixed | Do not widen |
| Topbar height | 58px | Matches logo box height exactly |
| Logo box height | 58px | Same as topbar — they align on same horizontal line |
| Logo size | 135px wide, height auto | Transparent PNG background |
| Logo background | var(--bg) #0c0c0e | Blends logo into sidebar seamlessly |
| Primary accent | #a07840 | Dark burnished gold — not bright gold |
| Accent hover | #8a6530 | Darker bronze for hover/gradient start |
| Accent light | #c49a5a | For secondary hover states and links |
| Nav active state | gold left border (2px) + accent-glow bg | Not solid background |
| Date filter | Only shown on Dashboard, Products, Trends | Hidden on all other pages |
| Ad platforms | FB + TikTok + Instagram + YouTube + Google | All 5 platforms supported |
| Dashboard layout | 6 sections top-to-bottom (see Dashboard spec) | Exact order must be preserved |
| Chart style | Solid line + dotted previous period | Helium 10 comparison pattern |

---

## 🧪 KEY UX RULES (do not break these)

1. **Every page loads in <1.5s** — use skeleton loaders, never blank screens
2. **AI calls always stream** — never make users wait for a full response before showing anything
3. **Filters are always visible** — sticky filter bar, never hidden behind a "Filter" button
4. **One-click save** — bookmark icon on every product/store/ad card, no modal required
5. **Empty states have CTAs** — "No saved products yet → Search Products"
6. **Errors are helpful** — "Rate limit reached. Upgrade to Pro for unlimited searches."
7. **Mobile works** — test every page at 375px width
8. **Numbers are formatted** — always use toLocaleString(), never raw numbers
9. **Color coding is consistent** — green = good/up, red = bad/down, yellow = medium/caution, purple = AI
10. **Tooltips on every metric** — explain IQ Score, Demand Score, etc. on hover

---

## 📦 KEY DEPENDENCIES

```json
{
  "dependencies": {
    "next": "14.x",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.4",
    "@anthropic-ai/sdk": "^0.24",
    "stripe": "^14",
    "@upstash/redis": "^1.28",
    "@upstash/ratelimit": "^1.2",
    "recharts": "^2.12",
    "lucide-react": "^0.383",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "sonner": "^1.4",
    "zustand": "^4.5",
    "react-hook-form": "^7",
    "zod": "^3"
  }
}
```

---

## 🎬 FIRST PROMPT TO USE IN CLAUDE CODE

After dropping this file into your project, use this as your opening prompt:

```
Read CLAUDE.md completely. Then start building SpyIQ following the 
BUILD ORDER exactly.

Start with steps 1–4:
1. Initialize Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
2. Set up the folder structure from CLAUDE.md
3. Create the Supabase migration files
4. Build the dashboard layout (Sidebar + Topbar) with all navigation items

Use the exact color palette, typography, and design rules from CLAUDE.md.
Make it look polished from the very first component.
```

Then continue with each subsequent group of steps as Claude Code completes them.

---

*SpyIQ — Built with Claude Sonnet 4.6 | Version 1.0 Blueprint*

---

## 🏪 AI STORE BUILDER (`/store-builder`) — ADDED MODULE

**Inspired by:** Copyfy's AI store generation — but deeper, with full brand identity

**The promise:** Go from winning product → launch-ready Shopify store in under 60 seconds using Claude.

### 4-Step Wizard Flow

**Step 1 — Pick Your Product**
- Search box OR select from Saved Products OR paste any AliExpress/product URL
- Product card preview shows: name, niche, IQ Score, margin

**Step 2 — Choose Your Store Style**
- Store name input (or "Generate for me" → Claude suggests 5 name options)
- Niche/aesthetic picker: grid of 8 visual styles
  (Minimalist / Luxury / Bold & Colorful / Fitness / Tech / Natural/Eco / Pet-friendly / Kids)
- Target audience toggles (age range, gender, interest tags)
- Language: 12 languages (EN, FR, ES, DE, IT, PT, NL, AR, ZH, JA, KO, RU)

**Step 3 — AI Generation screen (live progress)**
```
✓ Analyzing product market fit...
✓ Generating brand identity...
✓ Writing product copy...
✓ Building home page...
✓ Creating collection page...
✓ Writing FAQ & policies...
✓ Generating ad hooks...
⟳ Packaging for Shopify export...
```
Total time: ~45–60 seconds using Claude streaming.

**Step 4 — Review & Export (tabbed preview)**
- Brand tab: store name, tagline, 5-color palette, font pairing, logo concept
- Product Page tab: SEO title, meta description, 3-paragraph description, 5 bullets, FAQ (5 Q&As)
- Home Page tab: hero headline, hero sub, 3 feature blocks, social proof, CTAs
- Ads tab: 3 Facebook hooks, 3 TikTok hooks, 2 email subject lines
- Export tab: download or push to Shopify

### Export Options
- Copy any section to clipboard (one-click)
- Download as .txt (all copy)
- Download as Shopify CSV (product import)
- Push to Shopify via Partner API (user connects their store in Settings)

### Claude Prompt for Generation
```
You are an expert ecommerce copywriter and brand strategist.
Generate a complete, conversion-optimized Shopify store for a dropshipper.

Product: {product_name} | Niche: {niche} | Style: {style}
Audience: {audience} | Language: {language}

Return ONLY valid JSON:
{
  brand: { store_name, tagline, color_palette[5], font_display, font_body, brand_voice },
  product_page: { seo_title, meta_description, headline, description_p1, description_p2, description_p3, bullets[5], faq[5] },
  home_page: { hero_headline, hero_sub, features[3], social_proof, cta_primary, cta_secondary },
  ads: { facebook[3], tiktok[3], email_subjects[2] },
  policies: { shipping_blurb, returns_blurb, trust_badges[4] }
}
```

### Database Table
```sql
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
```

### Plan Limits
- Free: 1 store generation total
- Starter: 5 stores/month
- Pro: 20 stores/month  
- Agency: Unlimited + batch multi-language generation

### Build Order Position
Insert as Step 12.5 (after AI Analyzer, before Saved Items) in the BUILD ORDER.

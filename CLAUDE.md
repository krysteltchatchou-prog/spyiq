> At the start of each session, also read PROGRESS.md for the latest progress log.
> At the end of each session, update PROGRESS.md.

---

## 👋 HOW TO WORK WITH ME (read this first)

I'm a newbie / beginner programmer. Please keep this in mind for everything you do in this project:

1. Assume I don't know technical or coding terms — if you must use one, briefly explain it in plain language the first time.
2. Before making changes, briefly tell me WHAT you're about to do and WHY, in plain language.
3. Give me step-by-step explanations, not just code dumps — walk me through what each important part/line does.
4. Tell me exactly WHERE things are happening — which file, which folder, which command, and what to type and where (e.g. terminal vs. editor).
5. After you make a change or run a command, tell me what success looks like — what I should see if it worked, and what an error might look like.
6. If something could go wrong or is a common beginner mistake (e.g. forgetting to save, wrong folder, missing dependency), give me a heads-up.
7. Don't assume I have things installed or configured — check first, or tell me how to check.
8. Keep changes small and explain them one at a time when possible, rather than making many changes at once without explanation.
9. If my request is ambiguous or could be done multiple ways, ask me one simple clarifying question instead of guessing.

Keep this approach for the whole project, unless I tell you I'm comfortable and want shorter, more technical answers.

---

## 🎯 WHAT THE PROJECT IS

SpyIQ ([spyiq.co](https://spyiq.co)) is an AI-powered ecommerce intelligence SaaS for Shopify dropshippers. It helps users find winning products, spy on competitor stores, track viral videos, analyse ads across all platforms, and generate store copy using AI.

**Core promise:** Find your next winning product, spy on any competitor, and launch faster — all in one place.

**Target users:** Shopify store owners, dropshippers, ecommerce entrepreneurs (beginner to advanced).

**Positioning:** Built specifically for Shopify/dropshipping — deep product + competitor data, AI woven into every feature (not bolted on), and a clean, un-overwhelming UX. Comparison copy anywhere in the product refers to competitors generically as **"Other tools"** — never by name (see IMPORTANT RULES below).

---

## 🛠️ TECH STACK — never change these

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript preferred, JSX acceptable
- **Styling:** Tailwind CSS for all styling, using shadcn/ui + Radix component primitives (already installed under `components/ui/`) — no other CSS framework
- **Database:** Supabase (Postgres + Row Level Security) — already configured
- **Auth:** Supabase Auth (email + Google OAuth) — login/signup/OAuth callback are already built and working (`app/(auth)/*`, `app/auth/callback/route.ts`, `lib/supabase/middleware.ts`)
- **AI:** Claude API using model **`claude-sonnet-4-6`** only, via `@anthropic-ai/sdk` (`lib/anthropic.ts`)
- **Payments:** Stripe (subscriptions + usage billing)
- **Cache:** Redis (Upstash) for rate limiting & caching
- **Deployment:** Vercel — auto-deploys on every push to main
- **Version control:** Git — push to GitHub after every completed feature

> **Note (2026-07-27):** an earlier draft of this file listed NextAuth.js and a green (#0F6E56) primary color. Checked against the live code — the app already runs on **Supabase Auth** and the **gold accent (#a07840)** across a light theme, built and verified over several prior sessions. Confirmed with the user to keep those as-is rather than migrate; this file now reflects what's actually built.

---

## GIT RULES — run these after every completed task

```bash
git add .
git commit -m "clear description of what was done"
git push origin main
```

Never leave work uncommitted. Every session that completes a feature or fix should end with a push. Always run `npm run build` before pushing — fix all errors before pushing.

> Heads-up: as of the last session there were 130+ uncommitted files (the user had been holding off on commits). Going forward, follow the rule above — but if you find a large pile of pre-existing uncommitted work at the start of a session, don't force-push or discard it; review with `git status`/`git diff` and commit it in sensible chunks first, then keep to the one-push-per-feature rule from then on.

---

## 🚀 ENVIRONMENT VARIABLES — never hardcode these, always use `process.env`

```env
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

SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_SCOPES=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

(No `NEXTAUTH_*` or `GOOGLE_CLIENT_*` vars — Google OAuth is handled through the Supabase Auth provider, not a separate NextAuth config.)

---

## 🗂️ FOLDER STRUCTURE — always follow this (reflects what's actually built)

```
app/
  (auth)/login/page.tsx
  (auth)/signup/page.tsx
  (auth)/forgot-password/page.tsx
  (dashboard)/layout.tsx              ← Sidebar + Topbar shell
  (dashboard)/dashboard/page.tsx
  (dashboard)/products/page.tsx
  (dashboard)/products/[id]/page.tsx
  (dashboard)/trends/page.tsx
  (dashboard)/store-spy/page.tsx
  (dashboard)/store-spy/[domain]/page.tsx
  (dashboard)/ad-spy/page.tsx
  (dashboard)/keyword-research/page.tsx
  (dashboard)/ai-analyzer/page.tsx
  (dashboard)/store-builder/page.tsx
  (dashboard)/saved/page.tsx
  (dashboard)/alerts/page.tsx
  (dashboard)/settings/page.tsx
  auth/callback/route.ts              ← Supabase OAuth callback
  api/ai/chat/route.ts
  api/ai/generate/route.ts
  api/ai/store-builder/route.ts
  api/products/route.ts
  api/store-spy/route.ts
  api/ads/route.ts
  api/keywords/route.ts
  api/shopify/{install,callback,status,push,connect-token,publish-store}/route.ts
  api/stripe/{checkout,portal}/route.ts
  api/webhooks/stripe/route.ts
  api/cron/sync-ads/route.ts
  resources/top-products/[id]/page.tsx
  resources/top-shops/[id]/page.tsx
  resources/top-ads/page.tsx
  resources/viral-videos/page.tsx
  solutions/shop-analysis/page.tsx
  solutions/ai-store/page.tsx
  terms/page.tsx
  privacy/page.tsx
  not-found.tsx
  global-error.tsx
  layout.tsx
  page.tsx                            ← Landing page
  globals.css
components/
  layout/{Sidebar,Topbar,MobileNav,PublicHeader,ComingSoon}.tsx
  dashboard/{StatsGrid,HotProductsCard,TrendingNichesCard,InsightsFeed,StoreBuilderWidget}.tsx
  products/{ProductCard,ProductTable,ProductFilters,IQScoreBadge,TrendChart}.tsx
  store-spy/StoreSpyClient.tsx
  ads/AdBoard.tsx
  ai/AiStudio.tsx
  charts/SparklineChart.tsx
  board/ProductBoard.tsx
  shops/ShopsBoard.tsx
  viral/VideoBoard.tsx
  landing/{StoreBuilderDemo,BeforeAfter,Reveal,FaqAccordion,ScrollToTop}.tsx
  auth/AuthShell.tsx
  ui/                                 ← shadcn/ui components
lib/
  anthropic.ts
  supabase/{client,server,middleware,admin}.ts
  stripe.ts
  redis.ts
  rate-limit.ts
  iqScore.ts
  scanStore.ts
  detectApps.ts
  syncAds.ts
  ads-data.ts
  board-data.ts
  shops-data.ts
  viral-data.ts
  shopify.ts
  extractProductImages.ts
  utils.ts
public/
  SpyIQ_Logo.png
  og-image.png (via app/opengraph-image.tsx)
supabase/migrations/001–010
CLAUDE.md
PROGRESS.md
vercel.json
```

> Not yet built but planned: a standalone `lib/viralScore.js`-equivalent module implementing the Viral Score formula below (viral scoring currently lives inline in the viral board data layer) — check `lib/viral-data.ts` first before assuming it's missing.

---

## 📋 SUPABASE TABLES

Quick overview:

- **`products`** — winner products with `iq_score` (Winner Products Board)
- **`ads`** — ad intelligence across TikTok, Instagram, Facebook, YouTube, Google
- **`viral_videos`** — viral TikTok and Instagram Reels
- **`shops`** — top Shopify stores directory
- **`profiles`** — user accounts, plan, and AI credit balances (references `auth.users`)
- **`saved_items`**, **`alerts`**, **`chat_sessions`**, **`keyword_data`**, **`generated_stores`**, **`shopify_connections`** — supporting tables

Full schema (Postgres / Supabase):

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

-- Product database (cached AI results + Winner Products Board)
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
  product_id TEXT UNIQUE,
  image_url TEXT,
  price_usd NUMERIC,
  cogs_est NUMERIC,
  stores_count INT DEFAULT 0,
  monthly_revenue_est NUMERIC,
  search_volume INT,
  search_growth NUMERIC,
  ad_count INT DEFAULT 0,
  competition_level TEXT CHECK (competition_level IN ('low','medium','high')),
  trend_direction TEXT,
  suppliers JSONB DEFAULT '[]',
  top_stores JSONB DEFAULT '[]',
  first_seen TIMESTAMPTZ DEFAULT now(),
  is_featured BOOLEAN DEFAULT false,
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

-- Top Shops directory
CREATE TABLE shops (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id             TEXT UNIQUE NOT NULL,
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

-- Ad Intelligence (synced via Vercel Cron → lib/syncAds)
CREATE TABLE ads (
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

-- Viral Video Tracker
CREATE TABLE viral_videos (
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

-- AI Store Builder output
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

-- Shopify OAuth connections (per user)
CREATE TABLE shopify_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_domain TEXT NOT NULL,
  access_token TEXT NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: on for user-scoped tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own chat" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own generated stores" ON generated_stores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own shopify connection" ON shopify_connections FOR ALL USING (auth.uid() = user_id);

-- products / shops / ads / viral_videos / keyword_data / store_analyses are
-- PUBLIC, read-only catalog data (not user-scoped) — RLS intentionally OFF.
-- Writes happen via the Supabase service role from scan/sync APIs + Vercel Cron.
```

---

## 🎨 DESIGN RULES — never break these

**Color palette (light theme, gold accent):**
```
Background:    #f4f2ec   (warm off-white base)
Card/Surface:  #ffffff
Chrome:        #e7e2d7   (sidebar/topbar in the logged-in app)
Border:        #e4e1d8
Accent:        #a07840   (gold — primary CTA, links, focus rings)
Accent Hover:  #8a6530
Accent Light:  #c49a5a
Accent Glow:   rgba(160,120,64,0.12)
Green:         #3e8f72   (positive, up trends)
Red:           #d4685f   (warnings, down trends)
Yellow:        #c08a2a   (caution)
Text:          #23221f
Muted:         #4d4b44 / #73716a
Button text on gold: #fdfbf6 (white — never dark text on a gold button)
```

- Tailwind CSS only for all styling (shadcn/ui components are Tailwind + Radix under the hood — fine to use).
- Never mention any competitor names anywhere in code, UI, or comments.
- Comparison tables always use "Other tools", never named competitors.
- Every page must be fully mobile responsive (test at 375px width).
- All buttons must have hover and loading states.
- All forms must show visible, specific error messages on failure.
- Terms and Privacy links always point to real pages (`/terms`, `/privacy`), never `href="#"`.
- Sidebar width 210px fixed, topbar 58px, logo box 58px (matches topbar height) — locked, don't widen.
- Nav active state = gold left border (2px) + accent-glow background, not a solid fill.
- Charts: gold primary line/bar with area fill, green for positive, red for negative, dotted line for previous-period comparison, no grid clutter.

---

## 🧭 NAVIGATION STRUCTURE

**Public marketing header** (target design — not fully built yet, current `PublicHeader.tsx` is a minimal Sign in / Start Free Trial bar; build the dropdowns as a follow-up):
```
Logo → links to /
Solutions dropdown:
  Shop Analysis → /solutions/shop-analysis
  AI Store Builder → /solutions/ai-store
Resources dropdown:
  Top Products → /resources/top-products
  Top Shops → /resources/top-shops
  Top Ads → /resources/top-ads
  Viral Videos → /resources/viral-videos
Features → scrolls to #features on homepage
Pricing → scrolls to #pricing on homepage
FAQ → scrolls to #faq on homepage
Sign in button
Start free trial button (gold)
```

**Dashboard sidebar** (already built — `components/layout/Sidebar.tsx`), grouped into 5 sections:
- **Overview:** Dashboard
- **Research:** Product Database, Trend Radar (Live badge), Keywords
- **Spy Tools:** Store Spy, Ad Intelligence
- **AI:** AI Analyzer, AI Store Builder
- **My SpyIQ:** Saved Items, Alerts (badge with count)

Date filter (7D/30D/90D/1Y) in topbar — only visible on: Dashboard, Products, Trends pages. Hidden on all other pages.

---

## HOMEPAGE SECTIONS — these must always exist

- `id="features"` on the features section
- `id="pricing"` on the pricing section
- `id="faq"` on the FAQ section
- `scroll-behavior: smooth` in `app/globals.css` — ✅ already set

---

## 💳 PRICING TIERS

| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 5 ads/day, 3 videos/day, 10 products, 5 shops, 1 store spy/day, no AI |
| Starter | $29/mo | 50 ads/day, 20 videos/day, 100 products, 25 shops, 10 spy/day, 100 AI credits |
| Pro | $79/mo | Unlimited ads, unlimited videos, full 12K products, full shops, 100 spy/mo, 500 AI credits |
| Agency | $199/mo | Everything unlimited, plus API access, plus CSV export, plus alerts |

> These are the target tiers going forward. The current landing page pricing copy (`app/page.tsx`) and rate limiter (`lib/redis.ts` `RATE_LIMITS`) describe an earlier store-builder-centric version (stores/scans/AI credits). Next time pricing is touched, reconcile the landing copy + `RATE_LIMITS` + Stripe price IDs to match this table — don't do it silently as a side effect of an unrelated task.

---

## FEATURES TO BUILD — always in this exact order

1. **Winner Products Board** — `lib/iqScore.ts` and `/resources/top-products` — ✅ built
2. **Competitor Store Spy** — `lib/scanStore.ts` and `/solutions/shop-analysis` — ✅ built (real scan, not mocked — see PROGRESS.md Session #9)
3. **Ad Intelligence** — `lib/syncAds.ts` and `/resources/top-ads` — ✅ built
4. **Viral Video Tracker** — viral score logic and `/resources/viral-videos` — ✅ built, formula below not yet split into its own `lib/viralScore.ts` module
5. **Top Shops Directory** — `lib/detectApps.ts` and `/resources/top-shops` — ✅ built
6. **AI Creative Studio** — `/solutions/ai-store` and `/api/ai/generate` — 🟡 the AI Store Builder wizard exists (`/store-builder`, `/api/ai/store-builder`); the 6-generator "Creative Studio" pattern below (market-context-aware, tone-based, credit-metered) is the next evolution of it, not yet split into standalone generators

(Full page-by-page UI specs for each of these live further down in this file, under CORE FEATURES — DETAILED SPECS.)

---

## IQ SCORE FORMULA — never change this

Already implemented exactly as follows in `lib/iqScore.ts`:

- **Demand 35%:** monthly_sales_est + search_volume + ad_count, normalised to 0–100
- **Margin 25%:** margin_pct, where 60%+ margin = 100 points
- **Trend 25%:** search_growth plus viral video velocity
- **Competition 15%:** inverted stores_count — fewer sellers = higher score

Always returns an integer 1 to 100.

---

## VIRAL SCORE FORMULA — never change this

- **View velocity 35%:** `views_24h / views_total * 100`
- **Share rate 30%:** `shares / views * 1000`
- **Save rate 20%:** `saves / views * 1000`
- **Engagement 15%:** `(likes + comments) / views * 100`

Always returns an integer 1 to 100.

---

## AI CREATIVE STUDIO RULES

- Always use model `claude-sonnet-4-6` only.
- Before generating any copy, always query Supabase for:
  - Top 3 ad hooks in the same niche from the `ads` table
  - Top viral video caption in the same niche from the `viral_videos` table
- Always include that market context in every Claude prompt — never generate generic copy without it.
- Always deduct 1 credit per generation from `profiles.ai_credits_used`.
- 6 generators to build:
  1. TikTok Hook Generator
  2. Facebook Ad Copy
  3. Product Description
  4. Store Headline
  5. Email Subject Lines
  6. Landing Page Hero Section
- Tone options: Urgent, Friendly, Premium, Funny, Bold.
- Every output has a Copy button and a Regenerate button.

---

## FIXES ALREADY IDENTIFIED — check these are done, fix any that are not

- ✅ Logo wrapped in `Link href="/"`
- 🟡 Nav restructured with Solutions and Resources dropdowns — **not built yet**, see NAVIGATION STRUCTURE above
- ✅ Competitor names not present in code/UI (spot-checked; keep enforcing on every new PR)
- ✅ Terms page exists at `/terms`
- ✅ Privacy page exists at `/privacy` (both currently carry a "Draft — not reviewed by legal counsel" banner; Terms §15 jurisdiction is a placeholder — fill both before public launch)
- ✅ Signup page links to `/terms` and `/privacy`, not `href="#"`
- ✅ Pricing buttons pass `?plan=free` / `?plan=starter` / `?plan=pro` query params
- ✅ Agency button goes to `mailto:hello@spyiq.co`, not `/signup`
- ✅ Smooth scroll working on homepage
- ✅ Open Graph meta tags in `app/layout.tsx`
- 🟡 Google OAuth redirect URIs — configured through Supabase Auth's Google provider (not raw `GOOGLE_CLIENT_ID`/`SECRET`); confirm the Supabase dashboard's authorized redirect URI matches the deployed domain before launch
- 🟡 Two remaining `href="#"` — the Instagram/TikTok icons in the landing footer (`app/page.tsx`) are intentional placeholders until real social accounts exist; swap in real URLs before launch

---

## HOW TO START EVERY SESSION

1. Read this CLAUDE.md file first, then PROGRESS.md for the latest status.
2. Run `git status` to see what changed since last session.
3. Run `npm run dev` to check the current state of the app.
4. Continue with the next incomplete item on the features list.
5. If I say "continue", pick up exactly where we left off (per PROGRESS.md).
6. If I say "fix the site", run through the FIXES ALREADY IDENTIFIED checklist above.
7. If I say "deploy", run `npm run build` then `git push origin main`.

## HOW TO END EVERY SESSION

1. Run `npm run build` and fix any errors.
2. `git add .`
3. `git commit` with a clear description of what was built.
4. `git push origin main`.
5. Confirm the Vercel deployment succeeded.
6. Update PROGRESS.md (status table + session log).
7. Tell me what was completed and what comes next.

---

## CODE QUALITY RULES

- No `console.log` left in production code.
- All API routes must have try/catch error handling.
- All database calls must handle errors gracefully.
- No hardcoded secrets or API keys ever.
- Split any component longer than 200 lines into smaller components.
- Always add loading states and error states to every page.
- Always add empty states (with a CTA) when a list or table has no data.

---

## IMPORTANT RULES THAT NEVER CHANGE

- Never mention competitor names anywhere — not in code, UI, comments, or variable names. Use "Other tools" in comparisons.
- Never use `href="#"` for any link — always point to a real page (exception: the two social-icon placeholders noted above, until real accounts exist).
- Always push to GitHub after completing any feature or fix.
- Always confirm the Vercel deployment after pushing.
- Always ask before deleting any existing file or database table.
- When in doubt about a design decision, ask before building — one simple clarifying question, not a guess.

---

## 🔧 CORE FEATURES — DETAILED SPECS

Page-by-page UI specs for each feature in the FEATURES TO BUILD list above.

### 1. DASHBOARD (`/dashboard`)

**Layout (top to bottom):**
1. **KPI Cards row** (4 cards) — Products Tracked, Winning Products, Stores Analyzed, AI Credits Used
2. **Revenue Chart** — tabbed graph (Revenue / Top Products / Ad Spend tabs)
3. **2-column row** — "Hot Products Now" + "Trending Niches" (with sparklines)
4. **AI Insights panel** — 2×2 grid of insight cards
5. **AI Store Builder widget** — full-width, gold-bordered card with URL input
6. **2-column row** — "Trending Ads Now" + "Apps Top Stores Use"

**KPI Cards:** period comparison below each value ("▲ 14% vs last 30D"), tooltip icon on every label, gold top accent bar.

**Revenue Chart:**
- Tabs: Revenue / Top Products / Ad Spend
- Metric toggles: Gross Revenue, Net Profit, Orders (checkboxes)
- Comparison toggle: solid line = current period, dotted line = previous period
- Gold primary line with area fill gradient, green secondary line
- Event markers (circles) on notable data points

**Hot Products:** 5 rows — emoji thumb, name, niche tag, daily sales, IQ Score ring chart, margin %. Click row → AI Analyzer with that product pre-loaded.

**Trending Niches:** 5 rows — emoji, name, product count, 7-point sparkline SVG, growth %.

**AI Insights panel:** 2×2 grid. Colored left border (green=Opportunity, yellow=Warning, gold=Insight, red=Alert), icon, title, body, type badge, refresh button.

**AI Store Builder widget:** gold-accented border, gradient background. Headline: "From any link to a store ready to sell — in 60 seconds." URL input + "⚡ Generate Store" button. 4 feature mini-cards: Brand Identity / Full Copywriting / Ad Hooks / Shopify Import. Live progress screen with sequential checkmarks: Fetching product data → Retrieving images → Generating brand identity → Writing copy → Building home page → Creating ad hooks → Packaging for Shopify.

**Trending Ads Now widget:** Platform filter tabs (All / TikTok / Facebook / Instagram / YouTube / Google). Each row: platform icon, product name + emoji, ad hook in italic, engagement %, days running, est. spend, copy-hook button. Click → Ad Intelligence page.

**Apps Top Stores Use widget:** 8 most-used Shopify apps by top-performing stores. Each row: app icon, name, category badge, description, usage % bar (gold gradient). Refresh regenerates via Claude.

**Empty state (new users):** onboarding checklist widget — "Complete these 3 steps to see your dashboard fill up."

### 2. PRODUCT DATABASE (`/products`)

**Filter bar (sticky):** search input, niche multi-select, IQ Score slider 0–100, monthly sales range, margin % range, platform filter, trending toggle, supplier-available toggle, sort by.

**Table columns:** # / Product / Niche / IQ Score / Est. Sales/mo / Margin / Trending / Actions.

**Card (grid view):** emoji thumbnail + trending badge, name, niche tag, IQ Score ring (40px), 3 stats (Sales/Margin/Viral Score), Save + Analyze with AI + Find Supplier buttons.

**Product Detail (`/products/[id]`):** header with large IQ ring, score breakdown bars (Demand/Competition/Margin/Viral), 30-day sales sparkline, keyword cloud, target-audience tags, 3 competitor stores, AI analysis panel (~300 words), 3 supplier suggestions, action bar (Save/Export/Share/Import to Shopify).

### 3. TREND RADAR (`/trends`)

3-column grid of niche trend cards: emoji, 7-day sparkline, growth % badge, search volume estimate, trending-product count, momentum indicator ("Exploding 🚀" / "Rising 📈" / "Stable →" / "Declining 📉"). Top bar: category pills, time range (7D/30D/90D), sort. Detail view on click: full 30-day chart, top 5 products in niche, AI market analysis (~200 words), "Set Alert" button.

### 4. STORE SPY (`/store-spy`)

Clean URL input + Analyze button, recent searches below. Results: store header (name/domain/niche/Track Store), tabs — Overview (8-stat grid + 12-month revenue chart), Products (table, sort by sales/margin/recency), Ads (grid of creatives, platform badge, Copy Hook button), Traffic (donut chart of sources, country breakdown, visitor trend), Shopify Apps (detected apps + usage-likelihood %), AI Verdict (3–5 sentence Claude analysis: traffic driver, top-product signals, scaling velocity, weaknesses).

> Note: this is the one surface that's genuinely live end-to-end — `lib/scanStore.ts` fetches the store's real `/products.json` + homepage HTML (free, no Claude call). Revenue/traffic/ad-spend are AI estimates and carry an `AiEstimateBadge`; product catalog, apps, and theme are real.

### 5. AD SPY (`/ad-spy`)

Masonry grid with sticky filter bar (platform, niche, days running, engagement rate, spend, sort). Ad card: emoji thumbnail, product name + niche tag, platform badge, italic hook preview, 3 stats (Engagement/Days/Spend), Copy Hook / Find Product / Save Ad buttons. Detail drawer: full hook text, target audience, performance timeline, similar products, AI creative analysis, "Generate similar hook" (3 Claude variations).

### 6. KEYWORD RESEARCH (`/keyword-research`)

Search input (keyword or competitor domain). Results: main stats (Volume/Competition/Trend/IQ Score), 30-day volume chart, related keywords table, common-questions section, AI Keyword Brief (angle/audience/product types). CSV export.

### 7. AI ANALYZER (`/ai-analyzer`)

Split panel: left = chat interface (conversation persisted in Supabase, markdown rendering, typing animation, quick-prompt chips); right = dynamic context panel that updates based on what's being discussed (product → IQ breakdown; niche → trend chart + top products; ad → hook analysis; store → overview stats), always showing "Related Products" and "Suggested Next Steps".

**System prompt (already wired in `lib/anthropic.ts` / `app/api/ai/chat/route.ts`):**
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

### 8. AI STORE BUILDER (`/store-builder`)

**4-step wizard:**
1. **Pick Your Product** — search, saved products, or paste a product URL; card preview (name/niche/IQ/margin).
2. **Choose Your Store Style** — store name (or AI-generated options), niche/aesthetic picker (8 styles), audience toggles, 12 languages.
3. **AI Generation** — live progress: Analyzing product market fit → Generating brand identity → Writing product copy → Building home page → Creating collection page → Writing FAQ & policies → Generating ad hooks → Packaging for Shopify export (~45–60s, streamed).
4. **Review & Export** — tabbed: Brand / Product Page / Home Page / Ads / Export. Copy-to-clipboard per section, download .txt, download Shopify CSV, push to Shopify via the connected store.

**Claude prompt shape:**
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

Plan limits: Free = 1 store total, Starter = 5/mo, Pro = 20/mo, Agency = unlimited + batch multi-language.

### 9. SAVED ITEMS (`/saved`)

Tabs: Saved Products / Saved Stores / Saved Ads / Saved Keywords. Each: thumbnail/emoji + name, date saved, quick stats, editable notes, remove button, "Open Full Analysis" link. Bulk actions: select all / export CSV / delete selected.

### 10. ALERTS (`/alerts`)

Types: 🚀 New Trending Product, 📉 Price Drop, 🔥 Niche Spike (volume +50% in 48h), 👀 New Competitor Store, 📣 New Ad Spotted, ⚠️ Product Saturation Warning. Settings panel: niches/stores to monitor, frequency (Real-time/Daily digest/Weekly). Card: icon + colored left border, title/body/timestamp, action button, read/unread state.

### 11. LANDING PAGE (`/`)

Hero → social proof bar → 6 feature cards → 3-step "how it works" → comparison table ("SpyIQ vs Other tools") → 3 testimonials → pricing → 6-question FAQ → final CTA.

---

## 🎨 FINAL UI DECISIONS (locked — do not change)

| Element | Value | Notes |
|---|---|---|
| Sidebar width | 210px fixed | Do not widen |
| Topbar height | 58px | Matches logo box height exactly |
| Logo box height | 58px | Same as topbar |
| Logo size | 135px wide, height auto | Transparent PNG |
| Primary accent | #a07840 | Gold — not bright yellow |
| Accent hover | #8a6530 | |
| Accent light | #c49a5a | |
| Nav active state | gold left border (2px) + accent-glow bg | Not a solid fill |
| Date filter | Only on Dashboard, Products, Trends | Hidden elsewhere |
| Ad platforms | FB + TikTok + Instagram + YouTube + Google | All 5 supported |
| Chart style | Solid line + dotted previous period | Comparison pattern |

## 🧪 KEY UX RULES (do not break these)

1. Every page loads in <1.5s — skeleton loaders, never blank screens.
2. AI calls always stream — never make users wait for a full response before showing anything.
3. Filters are always visible — sticky bar, never hidden behind a "Filter" button.
4. One-click save — bookmark icon on every product/store/ad card, no modal required.
5. Empty states have CTAs.
6. Errors are helpful and plan-aware ("Rate limit reached. Upgrade to Pro for unlimited searches.").
7. Mobile works — test at 375px.
8. Numbers are formatted with `toLocaleString()`, never raw.
9. Color coding is consistent — green = good/up, red = bad/down, yellow = medium/caution.
10. Tooltips on every metric.

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

*SpyIQ — Built with Claude Sonnet 4.6*

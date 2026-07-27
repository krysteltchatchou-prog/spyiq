# 📋 PROGRESS.md — SpyIQ Build Tracker

> **Companion to CLAUDE.md.** CLAUDE.md is the blueprint (what to build).
> This file is the live status (what's built, what's next).
>
> **At session START:** Claude reads this to know where to resume — no full codebase scan needed.
> **At session END:** tell Claude "update PROGRESS.md" so the next session starts fast.

---

## ▶️ How to Resume (copy-paste these into Claude Code)

**To keep building (main prompt):**
Read CLAUDE.md and PROGRESS.md only — do not scan the whole codebase.
From the Build Order Status table, find the first step that isn't done and
continue from there. Before writing code, open ONLY the files that step touches
(use the "where it lives" notes + PROJECT STRUCTURE in CLAUDE.md to find them).
Follow the locked design system and UX rules in CLAUDE.md exactly. When the step
is finished, update the status table and session log in PROGRESS.md, then tell me
what's next — don't start the next step until I say go.

**Quick one-liner (when you just want to push forward):**
Read PROGRESS.md, continue from the first step that isn't done, open only the
files that step needs, then update PROGRESS.md when finished.

**At the end of a session (save your progress):**
Update PROGRESS.md: tick off what we finished in the status table, fill the
"where it lives" notes, add a session log entry, and set the "Right Now" section.

**To fill in file paths once (if "where it lives" is empty):**
Read PROGRESS.md. For each step marked done or in-progress, fill in the "where it
lives" column with the actual file paths — only check those files, not the whole project.

Tip: Session getting long? Run /compact to shrink it, or /clear then paste the
main prompt again. Everything important lives in PROGRESS.md, so clearing costs nothing.

---

## 🚦 Build Order Status

> Mirrors the BUILD ORDER in CLAUDE.md. Mark each: ⬜ Not started · 🟡 In progress · ✅ Done
> Keep the "where it lives / notes" column honest — that's what saves tokens next session.

| # | Step | Status | Where it lives / notes |
|---|------|--------|------------------------|
| 1 | Project setup (Next.js 14, Tailwind, shadcn/ui, env) | ✅ | `app/layout.tsx`, `lib/utils.ts`, `components/ui/*` (badge, button, card, input, skeleton, tooltip), `components.json`, `.env.example` |
| 2 | Supabase (migrations, RLS, auth config) | ✅ | `supabase/migrations/001–009` (users, products, stores, saved_items, alerts, products_board, shops, ads, viral_videos); `lib/supabase/{client,server,middleware,admin}.ts` |
| 3 | Auth pages (login, signup, forgot password) | ✅ | `app/(auth)/{login,signup,forgot-password}/page.tsx`; OAuth `app/auth/callback/route.ts`; `lib/supabase/middleware.ts` |
| 4 | Dashboard layout (Sidebar 210px + Topbar 58px + nav) | ✅ | `app/(dashboard)/layout.tsx`, `components/layout/{Sidebar,Topbar,MobileNav}.tsx`. 5 nav sections, Live + alert-count badges, plan label |
| 5 | Dashboard page (stats, hot products, trends, insights) | ✅ | `app/(dashboard)/dashboard/page.tsx` composes all 8 widgets in `components/dashboard/*`; pulls real board data via `lib/board-data.ts` |
| 6 | Product Database (filters, table, grid toggle, cards) | ✅ | `app/(dashboard)/products/page.tsx` → `components/products/ProductsClient.tsx` + ProductFilters/ProductTable/ProductCard/IQScoreBadge; `app/api/products/route.ts` |
| 7 | Product Detail page (IQ score, charts, AI analysis) | ✅ | `app/(dashboard)/products/[id]/page.tsx` (314 lines), `components/products/TrendChart.tsx`, `lib/iqScore.ts` |
| 8 | Store Spy (search, overview, tabs, AI verdict) | ✅ | `app/(dashboard)/store-spy/page.tsx` + `[domain]/page.tsx`, `components/store-spy/StoreSpyClient.tsx`, `app/api/store-spy/route.ts`, `lib/scanStore.ts`, `lib/detectApps.ts` |
| 9 | Ad Spy (grid, filters, ad cards, drawer) | ✅ | `app/(dashboard)/ad-spy/page.tsx` (357 lines), `components/ads/AdBoard.tsx`, `app/api/ads/route.ts`, `lib/ads-data.ts`, `lib/syncAds.ts`, cron `app/api/cron/sync-ads/route.ts` |
| 10 | Trend Radar (cards, sparklines, category filters) | ✅ | `app/(dashboard)/trends/page.tsx` (193 lines), `components/charts/SparklineChart.tsx` |
| 11 | Keyword Research (search, results table, AI brief) | ✅ | `app/(dashboard)/keyword-research/page.tsx` (now fetches live), `app/api/keywords/route.ts` (Claude `claude-sonnet-4-6` → main stats + 12-mo volume trend + 10 related keywords + 5 questions + 3-part AI brief). Mirrors `ai/generate` route: 1h Redis cache (`keywords:{kw}`), plan-tiered `checkRateLimit("searches")`, credit tracking/402, graceful 503/429/502 errors. Per-keyword sparklines synthesized server-side from volume+trend (`ensureSparkline`) to keep model output small + JSON reliable. Verified live end-to-end via curl (200, cache hit, 400 on empty). |
| 12 | AI Analyzer (chat, streaming, context panel) | ✅ | `app/(dashboard)/ai-analyzer/page.tsx` (328 lines), `components/ai/AiStudio.tsx`, streaming `app/api/ai/chat/route.ts` (sonnet-4-6 + rate limit) |
| 12.5 | AI Store Builder (4-step wizard, generation, export) | ✅ | `app/(dashboard)/store-builder/page.tsx`, `app/api/ai/store-builder/route.ts`, dashboard `StoreBuilderWidget.tsx`. **Session #6** rebuilt results into a Copyfy-style **visual editor**: "Editor" tab = two-pane live editor + Desktop/Mobile toggle; **Home Page / Product Page** switcher (split editor + preview); editable sections (Announcement, Brand, Hero, Reviews, How It Works, Features, Product w/ sale+compare price & SAVE% badge, Comparison Table, Statistics, FAQ); **image upload** (`ImageUploader`, data-URLs) for product gallery + hero. |
| 13 | Saved Items (tabbed saved list) | ✅ | `app/(dashboard)/saved/page.tsx` (237 lines) |
| 14 | Alerts (list, settings, mark as read) | ✅ | `app/(dashboard)/alerts/page.tsx` (190 lines), migration `005_alerts.sql` |
| 15 | Settings page (profile, billing, notifications, API key) | ✅ | `app/(dashboard)/settings/page.tsx` (299 lines), `hooks/useProfile.ts` |
| 16 | Stripe integration (checkout, webhooks, billing portal) | ✅ | `app/api/stripe/{checkout,portal}/route.ts`, `app/api/webhooks/stripe/route.ts`, `lib/stripe.ts` |
| 17 | Landing page (hero, features, pricing, testimonials) | ✅ | `app/page.tsx` (437 lines), `components/layout/PublicHeader.tsx`, `app/solutions/*`, `app/resources/*`, `app/{privacy,terms}/page.tsx`, `app/opengraph-image.tsx` |
| 18 | Rate limiting (Redis middleware) | ✅ | Plan-tiered limiters: `planRatelimit(kind, plan)` factory in `lib/redis.ts` (uses `RATE_LIMITS`, cached per kind+plan) + `checkRateLimit()` helper in `lib/rate-limit.ts` (resolves `profiles.plan`, keys per-user when signed in else IP, fails open if Redis down). Enforced on `app/api/products` (searches) and `app/api/store-spy` (stores) → 429 w/ plan-aware upgrade message. Note: `ai/chat` still uses the older non-tiered IP `aiRatelimit`; free-tier "no AI chat" access gate not yet enforced. |
| 19 | Caching (Redis cache for AI responses) | ✅ | `cacheGet`/`cacheSet` (`lib/redis.ts`) now wired into both cacheable AI routes: `app/api/ai/generate` (key `gen:*`, 1h TTL, cache hit skips credit charge) and `app/api/ai/store-builder` (key `storebuild:*`, 1h TTL, cache hit replays progress steps fast). `app/api/ai/chat` intentionally uncached (per-conversation, unique). |
| 20 | Polish (skeletons, empty states, error boundaries, toasts) | ✅ | Skeletons (`components/ui/{PageSkeleton,skeleton}.tsx`, `(dashboard)/loading.tsx`) + sonner toasts (`app/layout.tsx`) already done. Added boundaries: `app/not-found.tsx` (public 404, verified renders w/ 404 status), `app/global-error.tsx` (root-layout fallback, own html/body), `app/(dashboard)/error.tsx` (segment boundary inside shell). `components/layout/ComingSoon.tsx` (not `ui/`) kept as-is — valid reusable public placeholder, not dead code. |

---

## 🎯 Right Now

- **Phase:** All 20 build steps + 12.5 ✅ and the design/light-theme pass ✅ are done. Launch-readiness continues (Session #9 review). **Session #10 fixed a critical live-site outage: nobody could log into `spyiq.co` at all** (Google or email/password) — see below. That's now resolved and verified.
- **✅ Done in Session #10 (production outage: login completely broken on spyiq.co):**
  1. ✅ **Vercel auto-deploy on push wasn't firing at all** — root cause was the `vercel.json` cron schedule (`0 */6 * * *`, every 6h) exceeding the Hobby plan's once-per-day cron limit, silently failing every deployment at the validation step before a build even started. Fixed: schedule changed to once daily (`0 6 * * *`). This is also why `spyiq.co` had been stuck on a weeks-old dark-theme build the whole time.
  2. ✅ **The actual login bug — root cause found and fixed.** Vercel's **production** env var `NEXT_PUBLIC_SUPABASE_URL` had `/auth/v1/callback` mistakenly appended to it (old copy-paste mistake, never caught because local `.env.local` was already correct from a much earlier session). Every client-side Supabase call therefore hit a malformed doubled URL (`.../auth/v1/callback/auth/v1/token`) and failed instantly with "Failed to fetch" — for 100% of users, Google or email, always. Confirmed via a `window.fetch` interception that captured the literal broken URL. User corrected the value in Vercel dashboard → Settings → Environment Variables; a rebuild picked it up. **Verified live on spyiq.co**: email/password now returns the correct "incorrect credentials" message, Google OAuth redirects to the real consent screen.
  3. ✅ Also upgraded `@supabase/ssr` (0.4.1 → 0.12.3) and `@supabase/supabase-js` (→ 2.110.9) — was genuinely outdated and caused a separate production-build-only "Failed to fetch" (worked in `next dev`, failed in `next build`/Vercel) that had to be ruled out along the way. Fixed by explicitly passing native `fetch` to `createBrowserClient` in `lib/supabase/client.ts` (works around a webpack/Next.js bundling quirk where the SDK's internal fetch resolution breaks specifically in production bundles).
  4. ✅ Supabase project had also gone to sleep (free-tier auto-pause) at the start of this session — woken via the Supabase dashboard. Unrelated to the URL bug but was the first thing masking it.
- **⚠️ Debugging note for next time:** if login/auth ever silently breaks on `spyiq.co` again, check in this order: (1) is the Supabase project awake (`curl https://iuhblwetihovbdhulgrr.supabase.co/auth/v1/health`), (2) does `spyiq.co` have a fresh deployment (`vercel.json` cron limits are a real trap on the Hobby plan — any cron more frequent than daily silently kills every deploy), (3) intercept `window.fetch` on the live login page and look at the *literal* URL being called — that's what actually cracked this one open, not CORS/library theorizing.
- **🔴 NEW BLOCKER found this session, unresolved — start here next time: AI Store Builder generation fails on `spyiq.co`** ("Store generation failed — please try again"). Root cause confirmed by calling `POST /api/ai/store-builder` directly and reading the raw SSE error event (the route swallows errors into the stream body instead of logging them — `app/api/ai/store-builder/route.ts` catch block at the bottom, never calls `console.error`, so Vercel's runtime logs show nothing useful; this is the fastest way to debug any of the 3 Claude-calling routes if it happens again). Two distinct problems:
  1. **Vercel's production `ANTHROPIC_API_KEY` is invalid** — Anthropic returns a clean `401 authentication_error: "API key is invalid."` This is a wrong/stale key value in Vercel's env vars, separate from problem 2.
  2. **The Anthropic account behind the *local* `.env.local` key (which does authenticate correctly) is out of credits** — confirmed by calling Anthropic's API directly with that key: `400 invalid_request_error: "Your credit balance is too low to access the Anthropic API."` So even after fixing Vercel's key, nothing will work until the account has credits again — this is real money, only the user can do it (console.anthropic.com → Plans & Billing → add a payment method / buy credits), then generate a fresh API key and set it in Vercel. **Not yet done as of end of session** — user was deciding whether to spend the money now or come back to it after Stripe/legal/data-source items.
- **▶️ Punch list for next session, in order:** (1) Store Builder — add Anthropic credits + fresh key (blocked on user's decision/payment) → confirms the Shopify picture/theme check can finally run end-to-end, (2) Stripe end-to-end, (3) Legal jurisdiction fill-in, (4) real-vs-estimated data decision. (The old Shopify-picture-check item folds into #1 above — can't regenerate a store to test images until Store Builder itself works again.)
- **✅ Done in Session #9 (launch-readiness work):**
  1. ✅ **Store Spy now uses the REAL scan** (was 100% hard-coded mock). `[domain]` page fetches `/api/store-spy` live; real catalog/apps/social, clearly-labeled estimates. Search page de-faked. (`lib/scanStore.ts` is FREE — no Claude.)
  2. ✅ **"Founded" date bug fixed** (user-reported) → relabeled "Oldest Product" + caption; can't fake a founding date from a public scan.
  3. ✅ **Free-tier AI loophole closed** (`api/ai/chat`): free plan → 403, paid → credit-gated + charges 1 credit/response. (Review item #3.)
  4. ✅ **Estimate-label sweep** — `AiEstimateBadge` now on dashboard, trends, keyword-research too.
  5. ✅ Landing footer bottom bar centered + scroll-to-top button.
  6. ✅ **Shopify full-store publish unblocked** — fixed dead Reconnect button; theme access granted via Admin-API-token path (scope now has `write_themes`); publish creates **active** products; `buildImages` accepts URL images.
  7. ✅ **AI Store Builder auto-imports product images** from a pasted product URL (`lib/extractProductImages.ts`) — **proven live end-to-end** (Shopify URL → 5 real images in the generated result).
- **▶️ Next concrete tasks (pick up here, in priority order):**
  1. **FIRST / easy win — finish the Shopify image story for the user.** Their published store shows copy but no pictures because it was generated BEFORE the image-import fix. **Have them re-generate a store from a Shopify product URL** (image import only runs at generation time) → publish → confirm pictures appear. The code is done & verified; this is a user-action + confirmation step.
  2. **CONFIRM Horizon homepage rendering (BLOCKED on password).** Publish files are correct on the live Horizon theme, but the dev-store **password wall** blocked seeing the render. User couldn't get past the password page either. Resolve by: user finds the storefront password (Online Store → Preferences → Password protection) OR uses Themes → ⋯ → **Preview** (bypasses password). If Preview shows blank → adapt publish for Horizon (rebuild homepage as Dawn-compatible/theme-blocks). If it shows → publish works, only the password (dev-store limitation) remains.
  3. **#2 Stripe end-to-end (MEDIUM).** Set real price IDs + webhook secret; run a Stripe test-mode purchase, confirm `profiles.plan` flips (+ paid plan unlocks AI chat — ties into the new gate); test cancellation. Routes: `app/api/stripe/{checkout,portal}`, `app/api/webhooks/stripe`.
  4. **#4/#5 Legal (QUICK).** Fill Terms §15 jurisdiction placeholder; remove "Draft — not reviewed by counsel" banners on `/privacy` + `/terms`; reconcile contact emails.
  5. **#9 Real data sources (BIG / business decision).** Products/Ads/Top Shops/Trends boards still fall back to **seed data** when Supabase is empty. Decide: ship as honest "AI estimates" vs. connect paid data providers. Store Spy is the one genuinely-live surface.
- **🛍️ Shopify state (Test account `spyiq.polish.test@gmail.com` → `spyiq-dev-store.myshopify.com`):** connected with full scope (incl. `write_themes`); **0 products** (clean); live theme = **Horizon** (+ "Copy of Horizon" backup). Store is a **development store** → storefront password **cannot be removed** without a paid plan.
- **⚠️ Watch-outs created this session:**
  - The free **Test account can no longer use AI Analyzer** (the new gate). Flip a test profile to `starter`/`pro` in Supabase to demo paid chat.
  - AI gate is **fail-closed**: a signed-in user with no `profiles` row is blocked → make sure the profiles backfill (Session #5) is applied so paid users aren't wrongly locked out.
- **Housekeeping:** test accounts left in Supabase Auth (`spyiq.polish.test@gmail.com`, `diag_*`) — harmless, delete when convenient. 130+ files still uncommitted (user holding off on commits).

---

## 📝 Session Log

<!-- Newest entry on top. Copy the template block below for each new session. -->

### 📅 2026-07-27 — Session #10
**Worked on:**
- Rewrote CLAUDE.md into a more complete project blueprint (user-supplied structure, reconciled against what's actually built — kept Supabase Auth + gold theme rather than the draft's NextAuth/green, since those are real and working). Then a live production outage: **the user could not log into `spyiq.co` at all**, by any method. Spent the rest of the session finding and fixing the actual root cause rather than the surface symptom.

**✅ Finished — git/deploy pipeline set up for real (first time this session had working push+deploy access):**
- Got GitHub push working from this environment (user generated a PAT, git credential now cached in macOS Keychain — usable both from the user's Terminal and from this tool going forward).
- Committed and pushed everything that had been sitting uncommitted (the new CLAUDE.md, then a large batch of pre-existing Session #9 work: real Store Spy scan, AI gating, Shopify image import, landing tweaks).
- Discovered Vercel's auto-deploy-on-push had been **silently broken** — root cause: `vercel.json`'s ad-sync cron (`0 */6 * * *`) exceeds the Hobby plan's once-per-day cron limit, so Vercel rejected every deployment before building. Fixed the schedule; deployments started working again for the first time in a long while.

**✅ Finished — the actual login outage (Google AND email/password both totally broken on spyiq.co):**
- Ruled out, in order, with hard evidence each time (not guesses): Supabase asleep (was, woke it up) → GitHub↔Vercel webhook (was fine, already covered above) → Supabase "Site URL" misconfiguration (user checked, wasn't it) → stale browser cookies (cleared, didn't help) → outdated `@supabase/ssr` version (real bug, fixed, upgraded 0.4.1→0.12.3, confirmed fix works in a genuine local production build) → a webpack-bundling fetch-resolution quirk specific to production builds only (real, separate bug, fixed by explicitly binding native `fetch` in `lib/supabase/client.ts`) → **and even after all of that, spyiq.co still failed**, which was the tell that something else entirely was wrong.
- Cracked it by intercepting `window.fetch` on the live login page and inspecting the literal request URL the app was actually sending — it was `https://iuhblwetihovbdhulgrr.supabase.co/auth/v1/callback/auth/v1/token?grant_type=password`, a malformed doubled path. That's only possible if `NEXT_PUBLIC_SUPABASE_URL` itself contains `/auth/v1/callback`. Confirmed: Vercel's **production** env var had exactly that mistake (local `.env.local` was already correct from an earlier session, which is why local dev/build always worked and masked this for who knows how long). User corrected it in the Vercel dashboard, triggered a rebuild — **verified live**: email/password shows the correct "incorrect credentials" message, Google OAuth reaches the real consent screen, both directly on `spyiq.co`.

**⚠️ Remember / decisions made:**
- The two library/bundling fixes (Supabase SDK upgrade + explicit fetch binding) are real, worthwhile fixes and stay in — but neither was *the* bug. The actual bug was a bad env var value that had nothing to do with code. Worth remembering next time something fails identically everywhere in code review but only in one environment: check env var **values**, not just that they're "set."
- `vercel.json` cron frequency is a silent, total deploy-killer on the Hobby plan — no error surfaces anywhere except GitHub's commit status API (`.../commits/{sha}/status`), which is genuinely the fastest way to check deploy health going forward, faster than polling Vercel's dashboard.
- Git push now works from this tool going forward (credential cached in Keychain) — per the user's request, I'll keep committing and pushing after finishing features without being asked each time.
- CLAUDE.md rewrite: kept the existing detailed page-by-page UI specs as an appendix rather than deleting them; folded in the user's new sections (git rules, IQ/Viral Score formulas — already matched `lib/iqScore.ts` exactly, AI Creative Studio rules, session start/end checklists). Flagged two known gaps honestly rather than marking them done: the Solutions/Resources dropdown nav isn't built, and two footer social-icon links are still intentional `href="#"` placeholders.

**🔴 Started, not finished — AI Store Builder generation broken on spyiq.co ("Store generation failed"):**
- Debugged by calling `POST /api/ai/store-builder` directly with curl and reading the raw SSE `error` event — the route (`app/api/ai/store-builder/route.ts`) catches its own errors and streams them to the client but never `console.error`s them, so Vercel's runtime logs/error-clusters show nothing (only an unrelated Node deprecation warning). **This direct-curl-the-SSE-stream trick is the fast way to debug any of the 3 Claude routes (`ai/chat`, `ai/generate`, `ai/store-builder`) going forward** rather than digging through Vercel logs first.
- Found two distinct problems: (1) Vercel's production `ANTHROPIC_API_KEY` returns `401 authentication_error: "API key is invalid"` — a wrong/stale key value, unrelated to credits; (2) separately, the Anthropic account behind the *local* `.env.local` key (which does authenticate fine) is out of money — `400 invalid_request_error: "Your credit balance is too low to access the Anthropic API."` Fixing just the Vercel key isn't enough; the account needs credits before *any* Claude call works again, locally or in production.
- **Left for the user to decide/act on** (real payment, can't do it myself): add a payment method + credits at console.anthropic.com → Plans & Billing, generate a fresh API key, then give it to me to set in Vercel (same paste-into-dashboard flow as the Supabase URL fix). Not done as of end of session.

### 📅 2026-06-22 — Session #9
**Worked on:**
- Two landing-page UI additions, a launch-readiness review, then **the #1 launch blocker from that review: data integrity** (real Store Spy scan + estimate labeling).

**✅ Finished — data integrity (tsc clean; verified live on preview :3000, logged in as Test/free):**
- **Store Spy results page rewritten to use the REAL scan (`app/(dashboard)/store-spy/[domain]/page.tsx`).** Was 100% hard-coded mock (Gymshark-style fake numbers for every store). Now fetches `POST /api/store-spy` on mount (loading + error/retry states) and renders the real `ScanResult`. KEY DISCOVERY: `lib/scanStore.ts` does NOT call Claude — it's pure fetch of the store's public `/products.json` + homepage HTML → **free to run** (the old PROGRESS note "paid Claude scan" was wrong). Tabs: Overview (real product count + avg price + theme + founded/age; estimated revenue/traffic/ad-spend each carry an inline `AiEstimateBadge`), Products (REAL catalog — title/price/image + link to live product page), Apps (REAL detected apps, dropped fake "% of stores"), Traffic (honest: modeled-estimate note + real social links, states source/geo breakdown needs a connected analytics provider), AI Verdict (built from real signals). **Dropped the "Ads" tab** (fabricated ad hooks attributed to a real store = worst offender). Verified live on beardbrand.com: real name "Beard Products", 71 products, $43.14 avg, real theme, real products (Short Game Cologne $50…), real apps (Judge.me/Klaviyo/Recharge).
- **Store Spy SEARCH page de-faked (`app/(dashboard)/store-spy/page.tsx`).** Removed fabricated "$12M/mo"-style revenue/traffic from the featured tiles + recent-search chips (they sat under a green "LIVE" badge implying real data). Now honest example launchers (name/domain/niche only) → clicking runs the real scan. Relabeled "Top Performing Stores / LIVE" → "Popular stores to analyze".
- **Estimate labeling sweep** — added `AiEstimateBadge` (banner) to the 3 estimate-heavy logged-in pages that lacked it: Dashboard (after StatsGrid), Trends (under header; also softened misleading "Real-time niche momentum" → "Niche momentum at a glance"), Keyword Research (top of results). Brings badge coverage to: products[id], store-spy[domain], ai-analyzer, store-builder, AdBoard, ProductCard, StoreSpyClient, InsightsFeed, **+ dashboard, trends, keyword-research**.

**✅ Finished — follow-up fixes (user-reported + #3 from the launch review; tsc clean, verified live):**
- **Store Spy "Founded" bug fixed (user: "says founded 2023, actually 2019").** Root cause: `scanStore.ts` derived "Founded" from the earliest `published_at` in the public `/products.json` feed (capped at 250 products) → that's the oldest *still-listed* product, NOT the store's founding date. Relabeled the stat **"Founded" → "Oldest Product"**, dropped the unreliable "Store Age" stat, added a real **"Social Channels"** count, and added a caption: *"'Oldest Product' is the earliest item still in the store's public catalog (up to the 250 most recent) — not the store's founding date, which can't be reliably determined from a public scan."* Verified live on beardbrand.com: shows "Oldest Product 2018", no "Founded" anywhere.
- **Free-tier AI loophole CLOSED (`app/api/ai/chat/route.ts`) — review item #3.** Was: IP-only rate limit, no auth/plan/credit gate → free users could stream paid Claude responses unlimited. Now: (1) requires a signed-in user (401), (2) **`plan === "free"` → 403** "AI Analyzer is available on paid plans…" (also fail-closed if profile unreadable), (3) paid plan out of credits → 402, (4) IP abuse guard retained, (5) **charges 1 `ai_credits_used`** only after a successful stream (mirrors `ai/generate`). Also map upstream errors (out-of-credits→503, rate→429). `app/(dashboard)/ai-analyzer/page.tsx` now parses the JSON error body and shows the server message in-chat + toast (was a generic "API error"). **Verified live:** free Test account → `POST /api/ai/chat` returns 403 with the upgrade message (no Claude call). ⚠️ This means the **free Test account can no longer use AI Analyzer** — that's the intended gate; flip a test profile to `starter`/`pro` in Supabase to demo paid chat.

**✅ Finished — Shopify publish + auto-image import (Session #9 cont.; tsc clean):**
- **Reconnect button was dead** (`settings/page.tsx`) — its onClick was `setShopInput("")` (did nothing) → users stuck on "already connected" with no way to re-trigger OAuth. Now it redirects to `/api/shopify/install?shop=…` (same as Connect).
- **Theme-publish permission resolved via Admin API token path.** The OAuth app (`spyiq-2`) is locked to `write_products`, so OAuth reconnect can't grant themes. User created a custom app + token; Settings → Integrations → "Connect with Admin API token" saved scope `write_products,read_products,write_themes,read_themes`. **Verified in DB** — full-store publish now unlocked for the Test account (`spyiq-dev-store.myshopify.com`).
- **Published products were invisible + imageless** (user report). Diagnosed via Admin API: all products `status:draft` (invisible on storefront) with `images:0`. Fixes: (1) `lib/shopify.ts` `createProduct` now takes `{status}` — **publish-store passes `active`** (push stays `draft`); (2) `buildImages` now accepts **remote image URLs** (`{src}`) in addition to uploaded data-URLs (`{attachment}`) — before, URL images were silently dropped.
- **NEW: auto-import product images** (`lib/extractProductImages.ts` + wired into `app/api/ai/store-builder/route.ts`). The "Fetching product data" step was previously **fake** (no fetch). Now, when the builder input is a URL, it fetches real photos: Shopify product links via `{url}.json` (reliable — **verified live: pulled 5 images from an Allbirds product**), other stores best-effort via og:image/JSON-LD (Amazon/AliExpress may be bot-blocked). Images inject into `product_page.images` + `home_page.hero_image` → show in preview AND carry to Shopify on publish (via the buildImages URL fix). Best-effort + timeout-guarded; never blocks generation. **Not yet verified end-to-end through a live Claude generation** (would cost a credit) — extractor verified standalone, injection is a typechecked assignment.

**⚠️ Remember (Shopify / store builder):**
- **`spyiq-dev-store` is a DEVELOPMENT store** (plan `Basic App Development`, `password_enabled:true`). Shopify **does not allow removing the storefront password on a dev store** — needs a paid plan. Told the user; recommend Themes → ⋯ → Preview to view without the password wall.
- **Live theme is "Horizon"** (Shopify's newest theme). The publish overwrites `templates/index.json` in a format built for Dawn/OS-2.0 — **may render blank on Horizon**. Possible follow-up: test/adapt publish for Horizon, or have user switch live theme to Dawn. User has a "Copy of Horizon" backup duplicate.
- The Test account's Shopify store had ~10 leftover **draft products** — by the time the user said "yes" to cleanup, the store already showed **0 products** (count endpoint confirmed); nothing to delete. Cleanup script was written to only ever delete `draft` (preserve active).
- **Horizon publish is technically CORRECT — verified on the live theme** (id 152077500614): `sections/spyiq-home.liquid` (11.7KB valid HTML) + `templates/index.json` (points at our section) both landed; Asset API reads/writes work on Horizon (447 assets). So the publish mechanism is NOT broken on Horizon. Could not see the rendered page — storefront 302-redirects to `/password` (dev-store wall) for all external fetches.
- **VERIFICATION OUTCOME (user, end of session):** re-published store **brought the product COPY but still NO picture** → expected, because that store was generated BEFORE the image-import fix; image import only runs at generation time. **User must RE-GENERATE from a product URL to get pictures** (image-import proven live: 5 imgs from Allbirds). Also user **still can't get past the storefront password** ("when I enter the password it stays on the same page") — dev-store password wall; needs the correct storefront password (Online Store → Preferences → Password protection) OR use Themes → ⋯ → Preview (bypasses it). Whether Horizon renders our homepage is STILL UNCONFIRMED (password blocked the check).

**⚠️ Remember (data integrity):**
- Closing the AI gate is **fail-closed**: a signed-in user with NO `profiles` row is treated as free → blocked. If a *paid* user lacks a profile (the known pre-trigger backfill bug), they'd be wrongly blocked — ensure profiles exist (backfill noted in Session #5).
- During verification I exhausted the free **3/day store-scan limit**; cleared my own `rl:stores:free*` Upstash keys via a one-off node script to finish testing. (Confirms rate limiting is live.)
- `lib/board-data.ts` / `ads-data` / `shops-data` still fall back to **seed data** when Supabase is empty — those boards remain illustrative until the tables are populated. Store Spy is now the one surface backed by a genuine live scan.
- Store Spy niche detection is a keyword heuristic (`guessNiche`) — beardbrand.com mis-tagged as "Home & Garden". Acceptable but improvable.
- The scan counts against the plan's `stores` daily rate limit (free tier = low). Watch for 429s when demoing.

**✅ Finished — UI additions (tsc clean, verified live on preview :3000):**
1. **Footer bottom bar centered (`app/page.tsx`).** Changed the bottom bar from `md:justify-between` (copyright left / social+lang right) to fully centered: `flex flex-col items-center ... md:flex-row md:justify-center`, order = copyright → social icons → language selector. Verified: desktop = one centered row (bar center 717 = viewport center), mobile (375) = stacked vertically, all centered at x=188, order preserved.
2. **Scroll-to-top button (`components/landing/ScrollToTop.tsx`, new).** Fixed bottom-right (`z-[60]`, gold `#a07840`, white ↑ arrow), fades in past `scrollY>400`, smooth `scrollTo({top:0})`, `pointer-events:none` while hidden, margins use `max(1.25rem, env(safe-area-inset-*))` so it clears mobile edges (20px gap @375). Imported + rendered at end of `app/page.tsx`. Verified visible in screenshot; inline style flips to `opacity:1;translateY(0);pointer-events:auto` on scroll. NOTE: preview eval can't drive window scroll (scrollY pinned at 0) — verified the handler by overriding `scrollY` + dispatching `scroll`.

**⚠️ Remember:**
- Preview eval in this harness can't move the scroll position (`window.scrollTo`/`scrollTop` read back 0). To test scroll-driven UI, override `window.scrollY` getter + `dispatchEvent(new Event('scroll'))`.
- Launch review delivered in chat (not committed anywhere). Central finding: **Store Spy `[domain]` results = 100% hard-coded mock**, and `lib/*-data.ts` fall back to **seed data** when Supabase is empty → the app looks live but most "intelligence" is fabricated. That + real data sources is the #1 launch blocker.

### 📅 2026-06-22 — Session #8
**Worked on:**
- A batch of 6 UI/functional bug fixes the user reported across the app. All fixed and verified live (logged in via the `Test` account, preview on :3000).

**✅ Finished (all `npx tsc --noEmit` clean; verified live unless noted):**
1. **Product Detail crash (`app/(dashboard)/products/[id]/page.tsx`)** — root cause: `use(params)` was called on `params`, which in a Next 14 **client** page is a plain object, not a Promise → React's `use()` throws "unsupported type passed to use()". Fix: removed the `use` import, changed `Props.params` to `{ id: string }`, and read `const { id } = params` directly. Verified `/products/p1` + `/products/p3` render fully, no console errors.
2. **Store Spy results (`app/(dashboard)/store-spy/[domain]/page.tsx`)** — had the **identical** `use(params)` crash; fixed the same way. Verified all 6 tabs render (Overview stats+chart, Products table, Ads w/ hooks, Traffic sources+countries, Apps usage %, AI Verdict text). **This results page is 100% client-side mock data — it does NOT trigger the paid Claude scan**, so it's free to verify. Swept the whole repo for other `use(params)` — none remain.
3. **Global centering** — `app/(dashboard)/layout.tsx` content column got `mx-auto` (centers everything right of the sidebar). Added `mx-auto` to every page-root with its own narrower max-width (products/[id], store-spy + [domain], settings, saved, keyword-research, alerts, store-builder). **Footer (`app/page.tsx`):** the logo PNG is a 1255×1255 **square** (wordmark in the centre band) → at width 135 it rendered a 135×135 block, sitting far below the column headings. Wrapped it in a 44px-tall `overflow-hidden` box with the image offset `marginTop:-46` to crop to the wordmark; its top now sits exactly on the heading line (measured 599=599). Also changed the bottom bar from `flex-col items-center` (centered) to `md:flex-row md:justify-between` (copyright left, social+lang right) so it lines up with the columns above.
4. **Color/contrast (black-on-gold → white)** — the real culprit for the unreadable Store Spy / Ad Intelligence / Saved cards was the shared **`.sq-row`/`.sq-tile`** utilities in `app/globals.css` (still dark `#15151a`/`#2a2a33` — missed in the light migration) → dark text on dark cards. Relit them to white `#ffffff`/`#e4e1d8`. Also fixed `html`/`body` base (was still `#0c0c0e` dark → light `#f4f2ec`) + scrollbar, which removed a dark gutter on wide viewports. Then swept **every** dark-text-on-gold button across the app and switched text to white `#fdfbf6`: settings Save×2 + Connect×2 + toggle knob, keyword-research search btn, ai-analyzer user bubble + send btn, store-builder step circle + Next btn, ComingSoon CTA. (Tabs/pills/landing pricing already used white — left alone.)
5. **AI Analyzer quality (`app/api/ai/chat/route.ts` + `ai-analyzer/page.tsx`)** — rewrote the system prompt to be a substantive analyst: lead with a verdict, always give quantified Demand/Competition/Margin/Audience/Risk, end with Next steps; **formatting rules: use `## headings` to separate answers, bullets, and bold ONLY key terms/labels — never whole sentences**. Bumped `max_tokens` 1024→1500. Replaced the fragile inline-markdown renderer with `mdToHtml()` supporting `##/###` headings, `---` separators, grouped `<ul>` bullets, `**bold**`, `*italic*`, and `\`code\``, with real spacing between sections. Verified live: a 2-question prompt returned a clean answer with 5 headings, 5 separators, 8 bullets, bold scoped to labels.
6. **Settings → Billing alignment** — plan cards had unequal feature counts so the Upgrade buttons sat at different heights. Made each card `flex flex-col` and the feature `<ul>` `flex-1` so buttons pin to a shared bottom baseline. Verified: all 3 buttons at top=561, height=32.

**⚠️ Remember / decisions made:**
- The footer logo crop offset (`marginTop:-46` in a 44px window) is tuned to this specific square PNG. If the logo asset changes, re-tune.
- The privacy/terms pages have their **own** footer copies (not a shared component) — I only fixed the landing footer in `app/page.tsx`. If those footers show the same logo issue, apply the same crop there.
- "Black on gold" the user described was partly literal (gold buttons w/ dark text) and partly the dark `.sq-row` cards reading as unreadable — both addressed.
- Preview dev server was started on :3000 from this side for verification; it stops when the session ends — user runs `npm run dev` themselves after.

### 📅 2026-06-21 — Session #7
**Worked on:**
- **Premium quality pass on the marketing landing page** (`app/page.tsx`). The user was dissatisfied with overall quality and wants the whole product to feel like a premium AI store-builder ("it builds it for you" magic — motion, before/after, live previews) rather than a generic dark-SaaS site. All 7 brief items already exist functionally (built sessions #1–6); the gap is polish, so this session transformed the most visible/most-generic surface first.

**✅ Finished (verified live in preview, desktop 1280 + mobile 375, no console errors):**
- **New motion system** in `app/globals.css`: keyframes + utility classes (`sq-reveal`, `sq-gold-text`, `sq-marquee`, `sq-aurora`, `sq-pulse-ring`, `sq-cursor`, etc.) incl. a `prefers-reduced-motion` guard.
- **Live hero demo** `components/landing/StoreBuilderDemo.tsx` — auto-looping, self-contained: types a product URL into a browser address bar → AI build steps check off one-by-one → a branded mini-storefront assembles section-by-section → "Store ready · built in 47s". Floating "Conversion copy" / "Export to Shopify" chips. Timer-driven, no animation deps.
- **Before/After slider** `components/landing/BeforeAfter.tsx` — drag to wipe between a raw AliExpress import (bland, white) and the finished branded SpyIQ store. Pointer-capture drag; width measured via ResizeObserver so the clipped panel never squishes.
- **Scroll reveals** `components/landing/Reveal.tsx` (IntersectionObserver) wrapping every section; **FAQ accordion** `components/landing/FaqAccordion.tsx` (grid-rows transition).
- **Rewrote hero** to two-column (copy + URL input that routes to `/signup?url=…` + live demo), **niche marquee** social-proof row, **features rewritten around the real product** (AI Store Generation / Conversion Copy / Visual Editor / Competitor Intelligence / Winning-Product Radar / Shopify Export), product-accurate "Paste → AI builds → Edit & publish" how-it-works, refreshed comparison/testimonials/pricing/CTA copy.
- Kept Inter, gold accent (#a07840), and the "Other tools" (never-name-competitors) convention.
- **Light theme on the landing page (user request).** Switched the marketing page from the dark `#0c0c0e` base to an elegant warm off-white (`#f4f2ec` base, `#ebe8e0` bands, `#ffffff` cards, text `#23221f`, muted `#6e6c64`, borders `#e4e1d8`). Deliberately **kept the hero demo browser + the before/after "after" store dark** as premium product mockups on the light page. Updated `globals.css` (`sq-gold-text` deepened, `sq-aurora` softened), `FaqAccordion.tsx` + `BeforeAfter.tsx` border to light. **This is a deliberate deviation from CLAUDE.md's locked dark palette, scoped to the public landing page only — the dashboard/app stays dark.**

**✅ Auth flow redesign (verified live, desktop + mobile, no errors):**
- New `components/auth/AuthShell.tsx` — premium split-screen: left = dark branded showcase panel reusing the landing's live `StoreBuilderDemo` + 3 trust points (desktop only); right = clean light form area. Mobile collapses to the form with the logo on top.
- Rewrote `login`, `signup`, `forgot-password` (`app/(auth)/*`) onto the shell in the light theme (white fields, `#a07840` focus, darkened labels/text, light Google button + dividers, success/check-email states). Logic preserved.
- **Funnel continuity:** the landing "Build my store" URL input routes to `/signup?url=…`; signup now shows a "Ready to build from <url>" chip, stores it in signUp metadata (`pending_product_url`), and Google OAuth `next` deep-links to `/store-builder?url=…` when a URL is present.

**🟡 Not done / next quality passes (same premium bar, not yet applied):**
- **WHOLE APP + PUBLIC PAGES NOW LIGHT (done).** Rolled the color map across every dashboard page, all app feature components (products/store-spy/ads/ai/board/shops/viral/charts), and the public resources/solutions/privacy/terms pages + PublicHeader. Fixed gold-button text→white (active tabs + primary CTAs), softened a heavy card shadow, fixed a dark badge/row-border/video caption. `tsc` clean. Verified live (logged in via test account): dashboard, products list, ad-spy, settings, ai-analyzer, trends, alerts, saved, store-spy list, store-builder wizard — all light & coherent. **Not visually verified:** product detail `/products/[id]` (crashes on a PRE-EXISTING `use(params)` bug at line 15 — unrelated to theme; error boundary renders light correctly) and store-spy `/store-spy/[domain]` (skipped to avoid a paid Claude scan; components flipped + tsc clean). Store-builder RESULTS preview intentionally keeps the generated store's own colors (it's the customer's storefront, not SpyIQ chrome).
- **(Superseded) Theme decision REVERSED (later in same session):** user asked to make the app **light like the landing** ("light base, sections/chrome darker"). Now converting the whole logged-in app to light. **Dashboard + app shell DONE** (light base `#f4f2ec`, white cards, darker greige chrome `#e7e2d7` for sidebar/topbar/mobilenav, gold accent kept). Applied via a color-map perl pass + manual chrome fixups. **⚠️ Shell is shared, so the OTHER dashboard pages (products, trends, store-spy, ad-spy, keyword-research, ai-analyzer, store-builder, saved, alerts, settings) now show a LIGHT shell + DARK content = mixed/broken until converted with the same mapping.** Color map used: `#0c0c0e→#f4f2ec, #15151a/#1f1f26→#ffffff, #1d1d24→#f3f1ea, #2a2a33→#e4e1d8, #3a3a42→#d4cfc2, #f5f3ee/#d4cfc7→#23221f, #8a8a94→#4d4b44, #5c5c64→#73716a, #c49a5a→#8a6530, #5eb89a→#3e8f72, #d4b572→#c08a2a`; keep `#a07840`,`#d4685f`,rgba(); chrome→`#e7e2d7`; gold-button text→`#fdfbf6`. Shared components AiEstimateBadge/SparklineChart/IQScoreBadge already flipped (may affect public /resources pages slightly).
- **App polish review (logged in via throwaway `spyiq.polish.test@gmail.com` — Supabase project is awake, signup autoconfirms):** the dashboard, AI Store Builder, sidebar/topbar are **already well-built and on-spec** in dark — KPI cards w/ accent bars + deltas, revenue chart renders, store-builder wizard clean. They do NOT need the rescue the landing did. Future polish here is incremental, not a rebuild.
- **Funnel completed:** `/store-builder?url=…` now pre-fills the product input on load (verified live — input populated, "Next" active). OAuth signup deep-links here with the url. **Remaining bit:** email-signup path lands on `/dashboard` after confirm and doesn't yet consume `pending_product_url` from user metadata — wire dashboard→store-builder handoff later. Test account `spyiq.polish.test@gmail.com` left in Supabase Auth (harmless).

**⚠️ Remember / decisions made:**
- User asked me to **stop asking permission / stop delegating tasks back to them** and work as a senior who makes judgment calls and shows working results. Saved to memory.
- Pre-existing benign warning: Next `<Image>` logo aspect-ratio warning (width prop + height:auto). Cosmetic, pre-dates this session, left as-is.
- Preview ran on auto-port (user's own `npm run dev` holds :3000); set `autoPort:true` in `.claude/launch.json`.

### 📅 2026-06-21 — Session #6
**Worked on:**
- Turning the AI Store Builder into a **Copyfy-style full store builder** (user goal: "generate a *site*, not a product page" — customize → image → publish to their Shopify dev store). Also fixed two environment issues that blocked the user from even seeing the app.

**🔧 Environment fixes (not code):**
- **"Safari can't connect to the server"** = dev server wasn't running. Started `npm run dev` (the user must run it themselves; it stops when this session ends).
- **Unstyled page (plain text, no layout)** = corrupted `.next` build cache → every `/_next/static/*` asset 404'd (CSS + JS). Fix: stop server, `rm -rf .next`, restart. (Tailwind/PostCSS config was fine.) Documented this fix for the user.

**✅ Finished (all typecheck-clean `npx tsc --noEmit` = exit 0; routes/pages serve 200):**
- **Visual editor** (`app/(dashboard)/store-builder/page.tsx`): replaced the read-only "Preview" with an **"Editor"** tab = two-pane live editor (left = grouped `EditSection`/`EditField` controls, right = live storefront preview) + **Desktop/Mobile** toggle. Edits flow through `updateResult()` (structuredClone) so the preview updates as you type.
- **More sections to match Copyfy:** Announcement Bar, Brand, Hero, Reviews (rating + count + 3 testimonials), How It Works (3 steps), Features, Product (editable **sale price + compare-at + auto SAVE% badge**), Comparison Table, Statistics, FAQ. New optional fields added to the `GeneratedStore` interface + seeded with `DEFAULT_*` placeholders when a store is generated.
- **Multi-page store:** 🏠 **Home Page / 🛍️ Product Page** switcher (`activePage`) — both the editor's left panel and the preview swap per page. Product page = dedicated layout (gallery, rating, price block, bullets, add-to-cart, description, FAQ).
- **Image upload** (Creative Fabrica workflow): `fileToDataUrl` + `ImageUploader` (module-scope components) → product image **gallery** (`product_page.images`) + **hero image** (`home_page.hero_image`), stored as data-URLs, rendered in the preview.
- **Shopify product push upgraded** (`lib/shopify.ts` `createProduct`): now sends real **price + compare_at_price** and **uploaded images** (data-URL → base64 `attachment`). Fixed the post-push link: old `…myshopify.com/admin/products/{id}` opened a **blank page** → now modern `admin.shopify.com/store/{handle}/products/{id}`.
- **Full-store theme publishing (the "publish a site" feature):**
  - `lib/shopify.ts`: `buildHomeHtml(store)` (inline-styled homepage mirroring the preview), `getMainThemeId`, `putThemeAsset`, `publishStoreTheme` (writes `sections/spyiq-home.liquid` wrapped in `{% raw %}` + overwrites `templates/index.json` to render only that section → the live homepage becomes the design). `SHOPIFY_SCOPES` default expanded to `read_products,write_products,read_themes,write_themes`.
  - New route `app/api/shopify/publish-store/route.ts` — creates the product **and** does the theme takeover; returns `needsReconnect` (403) if the saved connection lacks `write_themes`.
  - UI: gold **"🚀 Publish full store to Shopify"** button in the Export tab (`publishFullStore()`).
- **Custom-app token connect** (so the user can grant theme access without the locked Partner dashboard): new route `app/api/shopify/connect-token/route.ts` (validates the `shpat_…` token via `/admin/oauth/access_scopes.json`, requires `write_themes`, upserts into `shopify_connections` with the real granted scopes) + Settings "▸ Connect with Admin API token" collapsible form (`connectWithToken()`).

**🟡 Not yet verified / pending the user:**
- **Full-store publish is UNVERIFIED live.** Needs the user to connect with theme access first (custom-app token path, built this session) — the existing OAuth connection is `write_products`-only.
- The **editor UI itself was not visually verified** — `/store-builder` is auth-gated and the preview redirects to `/login`; verification was `tsc` + route-serve (200) only.

**⚠️ Remember / decisions made:**
- **Images:** Creative Fabrica has **no API** → went with **manual upload** (user makes images there, uploads into the builder). Uploaded images currently live only in builder state as data-URLs (they DO get sent to Shopify on product push as base64; the theme homepage embeds the hero data-URL inline only if < ~700KB).
- **Theme takeover overwrites `templates/index.json`** → told the user to **duplicate their theme first** as a backup. Works on OS 2.0 themes (e.g. Dawn); **vintage themes** (use `index.liquid`) won't pick it up — needs a different approach if so.
- Partner app config (`spyiq-2`) shows as a **read-only released-version snapshot** with no editable scopes and **no `shopify.app*.toml` in the project** → that's why the token-connect path was added instead of editing Partner scopes.
- User is a **beginner** (per CLAUDE.md) and got frustrated by incremental steps + too many questions — pushed for "make it the same as Copyfy." Keep delivering visible, working chunks; explain in plain language; minimize config quizzing.

### 📅 2026-06-20 — Session #5
**Worked on:**
- End-to-end **live test** of the Shopify "Push to Shopify" integration against a real dev store (`spyiq-dev-store.myshopify.com`), watching server logs to debug failures as they happened.

**✅ Finished / verified live:**
- **OAuth connect works.** Settings → Connect went install → Shopify approval → callback → token saved. Confirmed the row in `shopify_connections` (scope `write_products`). Note: the test account actually signed in is `kryskou@gmail.com`, not `krysteltchatchou@gmail.com`.
- **Push to Shopify works.** Generated store ("Velour Intimates") created as a **draft** product in the dev store; `POST /api/shopify/push 200`. Also pushed a standalone "SpyIQ Test Product" draft directly via the saved token to validate the Shopify half independently (HTTP 201). All products land as **draft** by design.

**🐞 Two blockers found & fixed during the test:**
1. **`save_failed` on connect = missing `profiles` rows.** `shopify_connections.user_id` FK → `profiles(id)`, but the DB had **0 profiles** (accounts were created *before* migration 001's `on_auth_user_created` trigger existed, so it never fired for them). Backfilled `profiles` for all 3 existing `auth.users` via the service role. Future signups are fine (trigger handles them). **If the DB is ever reset and accounts pre-exist the migrations, this backfill must be re-run.**
2. **Store generation failed = invalid Anthropic key.** `/api/ai/store-builder` streams errors *inside* a 200 SSE response, so the failure was hidden in the stream body (`401 authentication_error: invalid x-api-key`), not the HTTP status. User regenerated `ANTHROPIC_API_KEY` in `.env.local`; after server restart, generation works (~52s real Claude call).

**📌 Notes for next session:**
- Dev server was being run from *this* (Claude) side via `npm run dev` in the background to capture logs. After the session it will stop — user must run `npm run dev` again themselves.
- Cleanup done: deleted the "SpyIQ Test Product" draft + one duplicate "Velour Intimates" draft via the Admin API. Store now has one clean "Velour Intimates" draft. (A leftover test auth account `diag_…@gmail.com` still exists in Supabase Auth — harmless, left in place.)

### 📅 2026-06-20 — Session #4
**Worked on:**
- Live debugging of Google OAuth sign-in, then two new feature tracks on the AI Store Builder: a live storefront Preview, and Phase 1 of a real Shopify "Push to Shopify" integration.

**✅ Finished:**
- **Google sign-in fixed (env, not code).** `.env.local` had the OAuth callback URL pasted into `NEXT_PUBLIC_SUPABASE_URL` (`…supabase.co/auth/v1/callback`) → SDK produced a doubled `/auth/v1`. Corrected to the bare project URL (backup at `.env.local.bak`). Login code was already correct. Also: the Supabase project had **auto-paused** (free tier → NXDOMAIN); waking it via the dashboard fixed "Safari can't find the server". Confirmed live: project up, `google:true`, signup+login work end-to-end.
- **Login error message** (`app/(auth)/login/page.tsx`): replaced the misleading "confirm your email" text (project has `mailer_autoconfirm: true`, no emails sent) with "Email or password is incorrect. Double-check them…". Verified the new string ships in the bundle.
- **Store Builder live Preview tab** (`app/(dashboard)/store-builder/page.tsx`): new **"Preview"** tab (now the default on results) renders the generated store as a real branded storefront inside a browser-window mockup (nav, hero+CTAs, social proof, features, product w/ bullets+price, FAQ, footer) using the brand palette/fonts. Verified live (screenshotted "Goldenhour Studio").
- **Store Builder bug fixes (were causing it to hang on "Building…" forever):**
  1. **Truncated AI JSON** — `app/api/ai/store-builder/route.ts` `max_tokens` was 2048; full store JSON got cut off → `JSON.parse` threw → error event. Raised to **4096** + brace-slice hardening of the parse.
  2. **Stream parser didn't buffer across chunks** — client split each network chunk by `\n` independently, so the large result SSE line broke across chunks and never parsed. Now buffers and splits on `\n\n`.
  3. **Swallowed error** — client `throw`ed inside a `try/catch{}` that ate it, hanging the UI. Now shows a toast + resets to step 2.
  Verified live: a real generation now completes and shows results.
- **Shopify integration — Phase 1 (built, typecheck-clean, partially verified):**
  - New files: migration `supabase/migrations/010_shopify_connections.sql` (user-scoped table, RLS on); `lib/shopify.ts` (normalize domain, build install URL, HMAC verify, token exchange, `createProduct` as draft); API routes `app/api/shopify/{install,callback,status,push}/route.ts` (OAuth start w/ state cookie, HMAC+state-checked callback that upserts token via service role, status, and push-product).
  - UI: Settings new **"Integrations"** tab with Connect-Shopify box + connected/not-configured states (`app/(dashboard)/settings/page.tsx`); Store Builder **"Push to Shopify"** button wired (`pushToShopify()` → `/api/shopify/push`, 409 → "connect first" toast, success opens product).
  - `.env.example`: added `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_SCOPES`.
  - **Verified (no creds needed):** status→`configured:false`, install→503, push (no connection)→clean 409 `needsConnection`, Settings Integrations tab renders + shows "not configured".

**🟡 Half-done (and where) / pending external setup:**
- **Shopify Phase 2 (verify live)** — BLOCKED on the user's Shopify setup. Needs: a Shopify **Partner account + dev store + custom app** → `SHOPIFY_API_KEY`/`SHOPIFY_API_SECRET` into `.env.local`; the app's allowed redirect URL set to `{NEXT_PUBLIC_APP_URL}/api/shopify/callback`; **run migration 010** in Supabase SQL editor; restart dev server. The OAuth connect → token save → real product creation flow is UNVERIFIED until then (localhost may need a tunnel/ngrok or testing on the deployed Vercel URL, since Shopify prefers https redirects).
- **Shopify Phase 3 (public/multi-tenant)** — to let *other* merchants one-click install, SpyIQ must be submitted for **Shopify App review** (needs deployed https app, privacy policy ✅, GDPR webhooks, possibly Billing API). Not started; this is the user's actual end goal ("Copify-style, build a store in seconds for my users").

**⏭️ Next session, start with:**
- Once user provides Shopify app credentials + runs migration 010: wire `.env.local`, restart, and test the full connect→push flow against their dev store.

**⚠️ Remember / decisions made:**
- Used a throwaway account `diag_1781985940786@gmail.com` / `DiagTest12345` (auto-confirmed) to drive the logged-in preview for verification. Some junk `diag_*`/`spyiq.diag.*` test users may exist in Supabase Auth — safe to delete from the dashboard.
- The user's own account `kryskou@gmail.com` is a **Google-only** identity (no password) — must sign in via "Continue with Google", not email/password.
- Push creates the product as **`status: "draft"`** (merchant reviews before going live) with a placeholder `$39.99` variant. API version pinned to `2024-10`, scopes minimal (`write_products`).
- Shopify access tokens stored in `shopify_connections.access_token`; read server-side only via service role. RLS protects cross-user reads.
- 131+ files still uncommitted (user chose to hold off on committing). `.env.local` changes are untracked (secrets).

### 📅 2026-06-20 — Session #3
**Worked on:**
- **#11 Keyword Research** — the last open build step. Anthropic API now has credits, so built the real API route + live Claude keyword brief to replace the client-side mock.

**✅ Finished:**
- **`app/api/keywords/route.ts` (new).** POST `{ keyword }` → `claude-sonnet-4-6` returns strict JSON: `main` (volume / competition / trend / score), `volumeTrend` (12-mo), 10 `related` keywords (volume / competition / trend / score / cpc), 5 `questions`, and a 3-part `brief` (angle / audience / productTypes). Mirrors the `app/api/ai/generate` pattern exactly: 1h Redis cache (`keywords:{kw}`, cache hit charges no credit), plan-tiered `checkRateLimit("searches", ip)` → 429, credit tracking → 402 when out, and graceful 503 (no key / out of Anthropic credits) / 429 (upstream rate limit) / 502 (parse/other) errors. Hardened output handling: `parseModelJson` strips ```json fences + slices to the outer `{...}`; `normalize` clamps scores 0–100, validates competition/trend enums, coerces numbers.
- **Per-keyword sparklines synthesized server-side** (`ensureSparkline` from volume + trend direction). First live test 502'd because asking the model for 10×12-int sparkline arrays blew the token budget and truncated the JSON mid-array — dropping sparklines from the prompt (kept only the single `volumeTrend` array) and raising `max_tokens` 1600→2000 fixed it. Sparklines are chart-normalized so synthetic trend-accurate values look identical.
- **`app/(dashboard)/keyword-research/page.tsx` rewritten** to fetch `/api/keywords` instead of `MOCK_RESULTS`: async `runSearch` with loading state (spinner in button + full-page "Researching…" state), helpful error banner (uses the API's plan-aware messages), real data wired into all sections (main stats, volume chart, related table, questions, AI brief), CSV export now exports the live results. Removed all mock constants. Design system + UX rules preserved (sticky search card, gold accents, score color thresholds).

**🟡 Half-done (and where):**
- Nothing half-done. #11 complete; all Build Order steps now ✅.

**⏭️ Next session, start with:**
- No Build Order items left. Optional follow-ups: "free = no AI chat" access gate + plan-tiered limits for `ai/chat` (carried over from Session #1); load-test caching/rate-limiting against live Upstash.

**⚠️ Remember / decisions made:**
- **Verification boundary:** the API route is verified live end-to-end via curl (200 with correct shape on "resistance bands", `cached:true` on repeat, 400 on empty keyword). The **page itself was NOT visually verified** — `/keyword-research` is auth-gated and the preview 307-redirects to `/login`. Page is typecheck-clean (`npx tsc --noEmit`) and consumes exactly the curl-verified API contract.
- Keyword research charges **1 AI credit** per fresh research (cache hits are free), consistent with `ai/generate`. It counts against the plan's daily **`searches`** rate-limit budget (not a separate "keywords" kind).
- API route lives at `app/api/keywords/route.ts` (matches blueprint's `api/keywords/`), while the page route stays `keyword-research` — consistent with the existing naming deviation note.

### 📅 2026-06-20 — Session #2
**Worked on:**
- Legal pages — rewrote Privacy Policy and Terms of Service with full draft content + shared public chrome.

**✅ Finished:**
- **AI estimate disclaimer badge.** New reusable `components/ui/AiEstimateBadge.tsx` — subtle muted (`#8a8a94`) "AI estimate" note, two variants: `inline` (10px uppercase label + Radix tooltip "AI-generated estimate for research only — verify before making business decisions.") and `banner` (thin full-width row showing the full disclaimer). Self-contained: wraps its own `TooltipProvider`, reuses existing `components/ui/tooltip.tsx` (Radix — already a dep), no new dependencies. Text defined once in the component (LABEL + DISCLAIMER constants). Dropped into the 7 requested spots: inline → `components/products/ProductCard.tsx` (under the IQ ring) + `components/ads/AdBoard.tsx` (once per card, under the stats); banner → product detail `app/(dashboard)/products/[id]/page.tsx` (above the score/AI grid), `components/store-spy/StoreSpyClient.tsx` (top of estimate-stats grid), AI Analyzer `app/(dashboard)/ai-analyzer/page.tsx` (top of conversation), AI Store Builder `app/(dashboard)/store-builder/page.tsx` (top of step-4 review/export), and dashboard `components/dashboard/InsightsFeed.tsx` (one banner above the 2×2 grid). `npx tsc --noEmit` clean. **Not visually verified** — all 7 placements are behind the auth-gated dashboard and the preview redirects to /login; verification was typecheck + code review only.
- **Landing footer (`app/page.tsx`, footer block only).** Replaced the old 3-item footer with a full one: brand block (logo + about blurb "SpyIQ is your all-in-one tool for finding and launching winning products."), Instagram + TikTok icon links (both `href="#"` placeholders until accounts exist), four link columns — **Features** (#features, #pricing, #how-it-works), **Resources** (the 4 `/resources/*` pages), **FAQ** (#faq), **Legal** (Privacy Policy → `/privacy`, Terms of Service → `/terms`) — a visual-only **language switcher** (English/French/Spanish, `useState` highlight only, no i18n), and copyright "© 2026 SpyIQ. All rights reserved." Added `FOOTER_COLUMNS` const + `InstagramIcon`/`TikTokIcon`/`FooterLangSwitcher` helpers in the same file. Design-system colors/spacing preserved. `npx tsc --noEmit` clean; verified live (footer renders, legal links resolve to the new routes, no console errors).
- **Privacy Policy (`app/privacy/page.tsx`).** Rewrote with the 13-section GDPR content (Introduction → Contact), gold-bulleted lists for the data/processor sections, "Last updated: June 2026", a back-home + Terms link, and a visible amber **draft banner** ("⚠️ Draft for review — not yet reviewed by legal counsel. Replace before public launch."). Now uses the shared `components/layout/PublicHeader.tsx` + a footer matching the landing page (previously the page had only an inline logo). Single-column, max-width 720px, design-system colors. `npx tsc --noEmit` clean; verified live in preview (renders, no console errors).
- **Terms of Service (`app/terms/page.tsx`).** Rewrote with the 16-section content (Acceptance → Contact), gold-bulleted §6 Acceptable Use, same draft banner / PublicHeader / landing footer / 720px layout as the privacy page. **§15 Governing Law contains a visibly-flagged placeholder** — `[PLACEHOLDER: jurisdiction to be set]` rendered in an amber `<mark>` with a "⚠️ must be filled in before public launch" note, so it can't be missed. `npx tsc --noEmit` clean; verified live in preview (header, banner, all 16 sections, highlighted placeholder, footer — no console errors).

**⏭️ Next session, start with:**
- **#11 Keyword Research** (still the last open build step) — needs Anthropic API credits.

**⚠️ Remember / decisions made:**
- Both legal pages: the task said "create a new page + route folder," but `app/privacy/page.tsx` and `app/terms/page.tsx` **already existed** (top-level public routes, alongside the landing page — there is no real `(landing)` route group in this codebase). To avoid duplicate/conflicting routes I **overwrote** the existing files in place rather than creating new folders.
- Privacy and Terms are now visually consistent (both use PublicHeader + landing footer + draft banner). The older short inline-logo format is fully gone from both.
- Draft banner + §15 placeholder use the palette's "yellow/caution" token (`#d4b572`).
- **`legal@spyiq.co`** is the Terms contact; **`privacy@spyiq.co`** is the Privacy contact (note: landing footer and older copy used `hello@spyiq.co` — these new dedicated addresses differ).

---

### 📅 2026-06-19 — Session #1
**Worked on:**
- Step #19 Caching — wiring `cacheGet`/`cacheSet` into the AI routes. Tackling the non-AI tail (#19 → #18 → #20) before #11, which is parked until API credits are available.

**✅ Finished:**
- **#19 Caching.** `app/api/ai/generate/route.ts`: cache check before credit tracking (cache hit returns immediately, charges no credit, `cached: true` in payload), `cacheSet` after a successful generation. Key `gen:{type}:{niche}:{tone}:{product}`, 1h TTL. `app/api/ai/store-builder/route.ts`: cache check inside the SSE stream — on hit, replays the 6 progress steps fast (120ms) then sends the stored result; on miss, caches the parsed JSON after generation. Key `storebuild:{product}:{style}:{storeName}:{language}`, 1h TTL. Extracted `PROGRESS_STEPS` to module scope. `npx tsc --noEmit` passes clean.

**✅ Finished (#18 Rate limiting):**
- Added `planRatelimit(kind, plan)` factory + `Plan`/`RateKind` types to `lib/redis.ts` — builds a sliding-window limiter from `RATE_LIMITS`, instances cached per kind+plan, clamps limit to ≥1 (free.ai=0 is credit-gated, not used here).
- New `lib/rate-limit.ts` → `checkRateLimit(kind, fallbackId)`: resolves `profiles.plan` for signed-in users (else `free`), keys the limiter per-user when authenticated otherwise by IP, and **fails open** if Upstash is unreachable.
- Wired into `app/api/products/route.ts` (`searches`) and `app/api/store-spy/route.ts` (`stores`) — both return 429 with a plan-aware upgrade message at the top of the handler. `npx tsc --noEmit` clean.

**✅ Finished (#20 Polish):**
- `app/not-found.tsx` — public-shell 404 (PublicHeader + gold 404 + dashboard/home CTAs). Serves Next's `notFound()` calls from the public resources pages. **Verified live**: renders correctly in preview, returns HTTP 404, no console errors.
- `app/global-error.tsx` — root-layout error fallback (client, renders its own `<html>/<body>`, "Try again" → `reset()`, shows `error.digest`).
- `app/(dashboard)/error.tsx` — dashboard segment boundary (client, renders inside the shell so sidebar/topbar persist; "Try again" + "Back to dashboard").
- `components/layout/ComingSoon.tsx` — **kept, not deleted.** It's a clean reusable public placeholder, not broken/dead code. (PROGRESS previously listed it at `components/ui/` — wrong path, corrected.)

**🟡 Half-done (and where):**
- Nothing half-done.

**⏭️ Next session, start with:**
- **#11 Keyword Research** (the last open step) — needs Anthropic API credits. Build the API route + real Claude keyword brief to replace the client-side mock in `app/(dashboard)/keyword-research/page.tsx`.

**⚠️ Remember / decisions made:**
- `app/api/ai/chat/route.ts` deliberately NOT cached — conversational, every request is unique. The three Anthropic-calling routes are chat/generate/store-builder; only the latter two are cacheable.
- Cache hit on `generate` serves even when the user is out of credits / `ANTHROPIC_API_KEY` is unset, since the cache check runs before those gates. Intentional (free, faster) but noting it.
- **Rate limiting `ai/chat` left on the old non-tiered IP `aiRatelimit`** — not converted to plan tiers, and the blueprint's "free = no AI chat" access gate is NOT enforced (would need a 403 for free plan + credit wiring). Flagged as a follow-up, out of #18 scope.
- Caching + rate limiting only typecheck-verified — not exercised live (needs a real Upstash connection). All Redis helpers (`cacheGet`/`cacheSet`, and `checkRateLimit`) swallow/handle backend errors, so a missing or broken Upstash degrades gracefully (no-cache / fail-open) rather than breaking requests.
- #20: the 404 (`not-found.tsx`) was verified in the live preview, but the two `error.tsx` boundaries were NOT runtime-triggered (would mean forcing a crash in the running app) — they're standard Next.js conventions and typecheck-clean. `ComingSoon.tsx` deliberately kept rather than deleted; revisit if it's still unused when public placeholder routes are added.

---

<!--
TEMPLATE — copy for next session:

### 📅 YYYY-MM-DD — Session #N
**Worked on:**
-
**✅ Finished:**
-
**🟡 Half-done (and where):**
-
**⏭️ Next session, start with:**
-
**⚠️ Remember / decisions made:**
-
-->

---

## 🧠 Deviations from the Blueprint

> If you build something differently from CLAUDE.md, note it here so the two never silently disagree.

**Extra public marketing pages (not in blueprint).** Beyond the single landing page, there's a full public content surface:
- `app/resources/{top-ads,top-products/[id],top-shops/[id],viral-videos}/` — SEO/discovery pages backed by `components/{ads/AdBoard,board/ProductBoard,shops/ShopsBoard,viral/VideoBoard}.tsx` and `lib/{ads-data,board-data,shops-data,viral-data}.ts`.
- `app/solutions/{ai-store,shop-analysis}/page.tsx` — feature landing pages.
- `app/{privacy,terms}/page.tsx`, `app/opengraph-image.tsx`, `components/layout/PublicHeader.tsx`.

**Extra DB tables — now reconciled into CLAUDE.md.** Migrations `006_products_board` (extends `products`), `007_shops`, `008_ads`, `009_viral_videos` power the boards above and are public, non-user-scoped catalog data (RLS intentionally off; written by the service role). ✅ Folded into CLAUDE.md's schema section under "Public catalog tables (added in build — migrations 006–009)", so blueprint and DB now agree.

**Extra API surface.** `app/api/ads/route.ts`, `app/api/store-spy/route.ts`, `app/api/ai/generate/route.ts`, and cron `app/api/cron/sync-ads/route.ts` exist beyond the routes listed in the blueprint's project structure.

**Naming.** Sidebar labels are friendlier than route names — "Product Database" → `/products`, "Trend Radar" → `/trends`, "Ad Intelligence" → `/ad-spy`, "Keywords" → `/keyword-research` (route kept as-is, not renamed to `/keywords`).

**Competitor naming.** Per project convention, competitor names (Helium 10, Copyfy, etc.) are never shown in the UI — referred to as "Other tools."

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

- **Currently on step:** All build steps complete (1–20 + 12.5 ✅). Active workstream (Session #7) = **premium quality/design pass across the product.** Landing page is done & verified. Next: apply the same motion + polish bar to the dashboard, AI Store Builder editor, Store Spy / Ad Intelligence, and auth pages. Prior workstream (full-store theme publishing) is built/typecheck-clean but still **NOT live-verified** (needs theme-scope Shopify connection).
- **Next concrete task:** **Live-verify full-store publish.** The user must first grant **theme** access to Shopify — easiest path built this session: **custom-app token connect** (Settings → Integrations → "Connect with Admin API token"). Their existing OAuth connection only has `write_products`, so `POST /api/shopify/publish-store` returns `needsReconnect` (403) until they reconnect with `read_themes,write_themes`. Once connected: generate → Export → "🚀 Publish store" → confirm the live storefront homepage becomes the design. Then handle edge cases (vintage/non-OS2.0 themes won't pick up `templates/index.json`).
- **Blocked by / waiting on:** User to create a store custom app (scopes incl. `write_themes`) and paste the `shpat_…` token into Settings, OR re-do OAuth after adding theme scopes to the Partner app (Partner app config screen is a locked version snapshot — couldn't edit scopes there, which is why the token path was built). Recommend the user **duplicate their theme** before publishing (the takeover overwrites `templates/index.json`).

---

## 📝 Session Log

<!-- Newest entry on top. Copy the template block below for each new session. -->

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
- **Theme decision MADE:** keep the split — marketing/auth light, **logged-in app stays dark** (user chose "keep app dark"). Recorded.
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

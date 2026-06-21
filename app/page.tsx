"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/landing/Reveal";
import StoreBuilderDemo from "@/components/landing/StoreBuilderDemo";
import BeforeAfter from "@/components/landing/BeforeAfter";
import FaqAccordion from "@/components/landing/FaqAccordion";

const FEATURES = [
  { emoji: "⚡", title: "AI Store Generation", desc: "Paste any product link and get a complete, branded store — homepage, product page, and theme — generated in under a minute." },
  { emoji: "✍️", title: "Conversion Copywriting", desc: "Headlines, product descriptions, benefit bullets, FAQs and ad hooks — all written to sell, not just to fill space." },
  { emoji: "🎨", title: "Live Visual Editor", desc: "Adjust colors, copy, images and sections in a two-pane editor. Every change previews instantly, desktop and mobile." },
  { emoji: "🕵️", title: "Competitor Intelligence", desc: "Drop in any store URL to reveal revenue, traffic, ad spend, top products and the apps powering their funnel." },
  { emoji: "📈", title: "Winning-Product Radar", desc: "Surface trending and proven products ranked by demand, margin and viral momentum — before they saturate." },
  { emoji: "🛍️", title: "One-Click Shopify Export", desc: "Push your finished store straight to Shopify, or export the assets. From idea to live storefront without leaving SpyIQ." },
];

const STEPS = [
  { num: "01", title: "Paste a link", desc: "Drop any AliExpress, Amazon, or Shopify product URL. That's the only input we need." },
  { num: "02", title: "AI builds it", desc: "SpyIQ generates the branding, copy, homepage and product page — every block tuned for conversion." },
  { num: "03", title: "Edit & publish", desc: "Fine-tune in the visual editor, then export to Shopify and start taking orders." },
];

const COMPARISON = [
  { feature: "Generate a full store from one link", spyiq: true,  other: false },
  { feature: "Conversion copy written for you",     spyiq: true,  other: false },
  { feature: "Live visual editor",                  spyiq: true,  other: false },
  { feature: "Competitor & ad intelligence",        spyiq: true,  other: true  },
  { feature: "Winning-product radar",               spyiq: true,  other: true  },
  { feature: "One-click Shopify export",            spyiq: true,  other: false },
  { feature: "Clean, non-overwhelming UX",          spyiq: true,  other: false },
];

const TESTIMONIALS = [
  { name: "Alex K.",  role: "Shopify store owner",  text: "Pasted a product link, had a branded store with real copy in two minutes. Went from $0 to $14k in month one.", metric: "$14k first month" },
  { name: "Sarah M.", role: "Ecommerce coach",      text: "The copy it writes actually converts. I've stopped paying a copywriter and my students launch in a day.", metric: "3 stores launched" },
  { name: "James T.", role: "6-figure operator",    text: "The competitor breakdown alone is worth it. I reverse-engineer any store's funnel in under two minutes.", metric: "$280k revenue" },
];

const PLANS = [
  { name: "Free",    price: "$0",    period: "/mo",  features: ["1 store generation", "3 competitor scans", "Basic product data", "Watermarked export"], cta: "Get Started",     highlight: false, href: "/signup?plan=free" },
  { name: "Starter", price: "$29",   period: "/mo",  features: ["5 stores / month", "20 competitor scans", "Full conversion copy", "Visual editor", "Ad intelligence"], cta: "Start Free Trial", highlight: false, href: "/signup?plan=starter" },
  { name: "Pro",     price: "$79",   period: "/mo",  features: ["20 stores / month", "Unlimited scans", "Shopify export", "Winning-product radar", "Trend alerts", "Priority AI"], cta: "Start Free Trial", highlight: true, badge: "Most Popular", href: "/signup?plan=pro" },
  { name: "Agency",  price: "$199",  period: "/mo",  features: ["Unlimited stores", "5 team seats", "API access", "White-label", "Batch generation", "Priority support"], cta: "Contact Sales",   highlight: false, href: "mailto:hello@spyiq.co?subject=SpyIQ%20Agency%20Plan" },
];

const FAQ = [
  { q: "How does SpyIQ build a store from a link?",          a: "Paste any product URL and our AI reads the product, then generates a complete store around it — brand identity, homepage, product page, conversion copy, FAQs and ad hooks. You get an editable store, not a template." },
  { q: "Is there a free trial?",                             a: "Yes — every new account gets 5 days of full Pro access with no credit card required. Generate stores and run competitor scans before you commit." },
  { q: "Can I edit what the AI generates?",                  a: "Always. The visual editor lets you change colors, copy, images and sections with a live preview on desktop and mobile. Nothing is locked." },
  { q: "How accurate are the competitor estimates?",         a: "Estimates combine ad-spend signals, traffic patterns and market benchmarks. They're directional research tools to guide decisions — not exact financials." },
  { q: "Do I need a Shopify account?",                       a: "Only to publish. You can generate, edit and export stores without one — connect Shopify when you're ready to push the store live and start selling." },
  { q: "Can I cancel anytime?",                              a: "Yes. Cancel from your billing settings whenever you like — no long-term contracts and no cancellation fees." },
];

function Check() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(78,158,130,0.16)"/><path d="M5 8l2 2 4-4" stroke="#3e8f72" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function X() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0.05)"/><path d="M6 6l4 4M10 6l-4 4" stroke="#c2bfb4" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const SOLUTIONS = [
  { label: "AI Store Builder", href: "/solutions/ai-store",      desc: "Generate a full store from any product link" },
  { label: "Shop Analysis",    href: "/solutions/shop-analysis", desc: "Reverse-engineer any competitor store" },
];

const RESOURCES = [
  { label: "Top Products",  href: "/resources/top-products", desc: "Winning products ranked by IQ Score" },
  { label: "Top Shops",     href: "/resources/top-shops",    desc: "Highest-earning stores right now" },
  { label: "Top Ads",       href: "/resources/top-ads",      desc: "Best-performing ads across platforms" },
  { label: "Viral Videos",  href: "/resources/viral-videos", desc: "Product videos going viral right now" },
];

const FOOTER_COLUMNS = [
  { title: "Product", links: [
    { label: "Features",     href: "#features" },
    { label: "Pricing",      href: "#pricing" },
    { label: "How it works", href: "#how-it-works" },
  ] },
  { title: "Resources", links: [
    { label: "Top Products", href: "/resources/top-products" },
    { label: "Top Shops",    href: "/resources/top-shops" },
    { label: "Top Ads",      href: "/resources/top-ads" },
    { label: "Viral Videos", href: "/resources/viral-videos" },
  ] },
  { title: "Company", links: [
    { label: "FAQ", href: "#faq" },
  ] },
  { title: "Legal", links: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ] },
];

const MARQUEE = [
  "🧥 Heated apparel", "💄 Skincare", "🐾 Pet tech", "🏋️ Home fitness",
  "🔌 Gadgets", "🛏️ Home & sleep", "🚗 Car accessories", "👶 Baby essentials",
  "🌿 Wellness", "💍 Jewelry", "🎧 Audio", "🍳 Kitchen",
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.6v3a8.4 8.4 0 0 1-4.5-1.3v6.4a6.2 6.2 0 1 1-6.2-6.2c.31 0 .61.02.9.06v3.1a3.1 3.1 0 1 0 2.2 2.96V3h3.1z" />
    </svg>
  );
}

function FooterLangSwitcher() {
  const [lang, setLang] = useState("English");
  const langs = ["English", "French", "Spanish"];
  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
      {langs.map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)}
          className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
          style={{
            background: lang === l ? "rgba(160,120,64,0.14)" : "transparent",
            color:      lang === l ? "#8a6530" : "#4d4b44",
          }}>
          {l}
        </button>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(menu: string) {
    setOpenMenu((cur) => (cur === menu ? null : menu));
  }

  function startBuild(e: React.FormEvent) {
    e.preventDefault();
    const q = url.trim() ? `?url=${encodeURIComponent(url.trim())}` : "";
    router.push(`/signup${q}`);
  }

  return (
    <div style={{ background: "#f4f2ec", color: "#23221f", fontFamily: "Inter, sans-serif" }}>

      {/* ── Nav ─────────────────────────────── */}
      <header className="sticky top-0 z-50"
        style={{ background: "rgba(231,226,215,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid #dcd7cb" }}>
      <nav ref={navRef} className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
        <Link href="/" aria-label="SpyIQ home">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={135} height={46} style={{ height: "auto" }} priority />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#4d4b44" }}>
          <div className="relative">
            <button onClick={() => toggle("solutions")}
              className="flex items-center gap-1 transition-colors hover:text-[#23221f]"
              style={{ color: openMenu === "solutions" ? "#23221f" : "#4d4b44" }}>
              Solutions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: openMenu === "solutions" ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openMenu === "solutions" && (
              <div className="absolute top-full left-0 mt-3 w-[280px] rounded-2xl p-2 z-50"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 16px 40px -16px rgba(60,50,30,0.3)" }}>
                {SOLUTIONS.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setOpenMenu(null)}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#f3f1ea]">
                    <p className="text-sm font-semibold" style={{ color: "#23221f" }}>{s.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#4d4b44" }}>{s.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggle("resources")}
              className="flex items-center gap-1 transition-colors hover:text-[#23221f]"
              style={{ color: openMenu === "resources" ? "#23221f" : "#4d4b44" }}>
              Resources
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: openMenu === "resources" ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openMenu === "resources" && (
              <div className="absolute top-full left-0 mt-3 w-[280px] rounded-2xl p-2 z-50"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 16px 40px -16px rgba(60,50,30,0.3)" }}>
                {RESOURCES.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setOpenMenu(null)}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#f3f1ea]">
                    <p className="text-sm font-semibold" style={{ color: "#23221f" }}>{s.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#4d4b44" }}>{s.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="#features" className="transition-colors hover:text-[#23221f]">Features</a>
          <a href="#pricing" className="transition-colors hover:text-[#23221f]">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-[#23221f]">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium transition-colors hover:text-[#8a6530]"
            style={{ color: "#4d4b44" }}>Sign in</Link>
          <Link href="/signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "#a07840", color: "#fdfbf6" }}>
            Start Free Trial
          </Link>
        </div>
      </nav>
      </header>

      {/* ── Hero ────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="sq-aurora" />
        <div className="relative max-w-[1200px] mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-6"
              style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.28)", color: "#8a6530" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3e8f72" }} />
              AI store builder · powered by Claude
            </div>
            <h1 className="font-extrabold mb-5" style={{ fontSize: "clamp(36px,5vw,58px)", letterSpacing: "-1.8px", lineHeight: 1.05 }}>
              Paste a product link.<br />
              <span className="sq-gold-text">Get a store that sells.</span>
            </h1>
            <p className="text-lg mb-8 max-w-[520px]" style={{ color: "#4d4b44", lineHeight: 1.65 }}>
              SpyIQ turns any product URL into a fully branded, conversion-optimized store —
              copy, design, and homepage written for you. Edit it visually, then publish to Shopify.
            </p>

            {/* URL input — the core action */}
            <form onSubmit={startBuild} className="flex flex-col sm:flex-row gap-2.5 max-w-[520px]">
              <div className="flex items-center gap-2 flex-1 rounded-xl px-3.5"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 2px 8px -4px rgba(60,50,30,0.18)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#73716a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste an AliExpress, Amazon or Shopify link…"
                  className="flex-1 bg-transparent py-3.5 text-sm outline-none"
                  style={{ color: "#23221f" }}
                  aria-label="Product URL"
                />
              </div>
              <button type="submit"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 whitespace-nowrap"
                style={{ background: "#a07840", color: "#fdfbf6", letterSpacing: "-0.2px", boxShadow: "0 8px 20px -8px rgba(160,120,64,0.55)" }}>
                ⚡ Build my store
              </button>
            </form>
            <p className="text-xs mt-3" style={{ color: "#73716a" }}>
              5-day full Pro trial · No card needed · First store in ~60 seconds
            </p>

            {/* mini trust row */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {["#a07840", "#3e8f72", "#8b8da0", "#c08a2a"].map((c, i) => (
                  <span key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: c, border: "2px solid #f4f2ec", color: "#fdfbf6" }}>
                    {["A", "S", "J", "M"][i]}
                  </span>
                ))}
              </div>
              <div className="text-xs" style={{ color: "#4d4b44" }}>
                <span style={{ color: "#c08a2a" }}>★★★★★</span> 4.9/5 ·{" "}
                <strong style={{ color: "#23221f" }}>2,400+</strong> founders building with SpyIQ
              </div>
            </div>
          </div>

          {/* right — live demo */}
          <div className="relative">
            <StoreBuilderDemo />
          </div>
        </div>
      </section>

      {/* ── Marquee social proof ────────────── */}
      <div className="py-5 border-y" style={{ borderColor: "#e4e1d8", background: "#ebe8e0" }}>
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#73716a" }}>
          Stores generated across every niche
        </p>
        <div className="sq-marquee-mask overflow-hidden">
          <div className="sq-marquee-track gap-3">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="rounded-full px-4 py-1.5 text-xs whitespace-nowrap"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Before / After ──────────────────── */}
      <section className="px-6 py-24 max-w-[1000px] mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>The transformation</p>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            From raw link to ready-to-sell
          </h2>
          <p className="text-base max-w-[520px] mx-auto" style={{ color: "#4d4b44" }}>
            Drag the slider. Left is what you start with — right is what SpyIQ ships. Same product, completely different store.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <BeforeAfter />
        </Reveal>
      </section>

      {/* ── Features ────────────────────────── */}
      <section id="features" className="px-6 py-24 max-w-[1200px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Everything in one place</p>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            Build, spy, and launch —<br />without juggling six tools.
          </h2>
          <p className="text-base max-w-[500px] mx-auto" style={{ color: "#4d4b44" }}>
            The store builder and the intelligence to know what to sell, in one clean platform.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div className="rounded-2xl p-6 h-full transition-all group"
                style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 1px 2px rgba(60,50,30,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 40px -22px rgba(160,120,64,0.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(60,50,30,0.04)"; }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4"
                  style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.20)" }}>
                  {f.emoji}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: 16, color: "#23221f" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4d4b44" }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────── */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: "#ebe8e0" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>How it works</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              Three steps. About a minute.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 110}>
                <div className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px"
                      style={{ background: "linear-gradient(90deg, #a07840, transparent)" }} />
                  )}
                  <div className="rounded-2xl p-6 h-full" style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 1px 2px rgba(60,50,30,0.04)" }}>
                    <div className="text-4xl font-black mb-4 sq-gold-text inline-block" style={{ letterSpacing: "-2px" }}>{s.num}</div>
                    <h3 className="font-bold text-xl mb-2" style={{ color: "#23221f" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4d4b44" }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ──────────────────────── */}
      <section className="px-6 py-24 max-w-[900px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Comparison</p>
          <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            How SpyIQ stacks up
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e4e1d8", boxShadow: "0 12px 36px -24px rgba(60,50,30,0.3)" }}>
            <table className="w-full" style={{ background: "#ffffff" }}>
              <thead>
                <tr style={{ background: "#f0ede5", borderBottom: "1px solid #e4e1d8" }}>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#73716a", width: "55%" }}>Capability</th>
                  <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: "#a07840" }}>SpyIQ</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#73716a" }}>Other tools</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature}
                    style={{ background: i % 2 === 0 ? "#faf9f5" : "#ffffff", borderBottom: i < COMPARISON.length - 1 ? "1px solid #efece4" : undefined }}>
                    <td className="px-5 py-3.5 text-sm" style={{ color: "#23221f" }}>{row.feature}</td>
                    <td className="px-5 py-3.5 text-center"><div className="flex justify-center">{row.spyiq ? <Check /> : <X />}</div></td>
                    <td className="px-5 py-3.5 text-center"><div className="flex justify-center">{row.other ? <Check /> : <X />}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section className="px-6 py-24" style={{ background: "#ebe8e0" }}>
        <div className="max-w-[1100px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Testimonials</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              Founders are shipping faster
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="rounded-2xl p-6 h-full" style={{ background: "#ffffff", border: "1px solid #e4e1d8", boxShadow: "0 1px 2px rgba(60,50,30,0.04)" }}>
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map((n) => <span key={n} style={{ color: "#c08a2a" }}>★</span>)}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#23221f" }}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #e4e1d8" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#23221f" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "#73716a" }}>{t.role}</p>
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{ background: "rgba(78,158,130,0.12)", border: "1px solid rgba(78,158,130,0.28)", color: "#3e8f72" }}>
                      {t.metric}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section id="pricing" className="px-6 py-24 max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Pricing</p>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-base" style={{ color: "#4d4b44" }}>Start free. Upgrade when you&apos;re ready.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 70}>
              <div className="rounded-2xl p-5 relative h-full flex flex-col"
                style={{
                  background: p.highlight ? "#fffdf8" : "#ffffff",
                  border: `1px solid ${p.highlight ? "#a07840" : "#e4e1d8"}`,
                  boxShadow: p.highlight ? "0 24px 56px -26px rgba(160,120,64,0.5)" : "0 1px 2px rgba(60,50,30,0.04)",
                }}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap"
                      style={{ background: "#a07840", color: "#fdfbf6" }}>
                      {p.badge}
                    </span>
                  </div>
                )}
                <p className="font-bold text-sm mb-1" style={{ color: "#23221f" }}>{p.name}</p>
                <div className="flex items-baseline gap-0.5 mb-4">
                  <span className="font-black" style={{ fontSize: 32, color: p.highlight ? "#a07840" : "#23221f", letterSpacing: "-1px" }}>{p.price}</span>
                  <span className="text-xs" style={{ color: "#73716a" }}>{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#4d4b44" }}>
                      <span style={{ color: "#3e8f72", flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {p.href.startsWith("mailto:") ? (
                  <a href={p.href}
                    className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all hover:brightness-105"
                    style={{
                      background: p.highlight ? "#a07840" : "#f0ede5",
                      border:     p.highlight ? "none" : "1px solid #e4e1d8",
                      color:      p.highlight ? "#fdfbf6" : "#4d4b44",
                    }}>
                    {p.cta}
                  </a>
                ) : (
                  <Link href={p.href}
                    className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all hover:brightness-105"
                    style={{
                      background: p.highlight ? "#a07840" : "#f0ede5",
                      border:     p.highlight ? "none" : "1px solid #e4e1d8",
                      color:      p.highlight ? "#fdfbf6" : "#4d4b44",
                    }}>
                    {p.cta}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section id="faq" className="px-6 py-24" style={{ background: "#ebe8e0" }}>
        <div className="max-w-[720px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>FAQ</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              Common questions
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <FaqAccordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────── */}
      <section className="px-6 py-28 text-center relative overflow-hidden">
        <div className="sq-aurora" style={{ opacity: 0.7 }} />
        <Reveal className="max-w-[640px] mx-auto relative">
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(30px,4.5vw,48px)", letterSpacing: "-1px" }}>
            Your next store is one link away
          </h2>
          <p className="text-base mb-8" style={{ color: "#4d4b44" }}>
            Paste a product, watch SpyIQ build the store, and publish to Shopify. 5-day full Pro trial — no credit card.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:brightness-110 sq-pulse-ring"
            style={{ background: "#a07840", color: "#fdfbf6", boxShadow: "0 12px 30px -10px rgba(160,120,64,0.6)" }}>
            ⚡ Build my first store free
          </Link>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="px-6 pt-16 pb-8" style={{ borderTop: "1px solid #d8d3c7", background: "#e7e2d7" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
            <div className="col-span-2">
              <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={135} height={46} style={{ height: "auto" }} />
              <p className="text-sm mt-4 max-w-[260px] leading-relaxed" style={{ color: "#4d4b44" }}>
                SpyIQ turns any product link into a store that sells — and shows you exactly what&apos;s working in your market.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#23221f" }}>{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 flex flex-col items-center gap-4"
            style={{ borderTop: "1px solid #d8d3c7" }}>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="SpyIQ on Instagram"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#ffffff] border border-[#e4e1d8] text-[#4d4b44] transition-colors hover:text-[#8a6530] hover:border-[#d4cfc2]">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="SpyIQ on TikTok"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#ffffff] border border-[#e4e1d8] text-[#4d4b44] transition-colors hover:text-[#8a6530] hover:border-[#d4cfc2]">
                <TikTokIcon />
              </a>
            </div>
            <p className="text-xs" style={{ color: "#73716a" }}>© 2026 SpyIQ. All rights reserved.</p>
            <FooterLangSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
}

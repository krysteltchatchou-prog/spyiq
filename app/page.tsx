"use client";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  { emoji: "🗃️", title: "Product Database",  desc: "12,000+ winning products ranked by IQ Score — demand, competition, margin, and viral potential." },
  { emoji: "🕵️", title: "Store Spy",         desc: "Enter any Shopify URL and get revenue, traffic, top products, ad spend, and apps in seconds." },
  { emoji: "📣", title: "Ad Intelligence",   desc: "Spy on winning ads across TikTok, Facebook, Instagram, YouTube and Google. Copy hooks in one click." },
  { emoji: "📈", title: "Trend Radar",       desc: "Live niche momentum tracking. Set alerts to catch the next spike before everyone else." },
  { emoji: "🤖", title: "AI Analyzer",       desc: "Ask Claude anything about your product, niche, or competitor. Get specific, data-driven answers instantly." },
  { emoji: "🔑", title: "Keyword Research",  desc: "Find high-volume, low-competition keywords for your Shopify store and paid ads." },
];

const STEPS = [
  { num: "01", title: "Find",   desc: "Search 12,000+ winning products by niche, IQ Score, margin, and trend velocity." },
  { num: "02", title: "Spy",    desc: "Analyze any competitor store, ad, or keyword in seconds. See exactly what's working." },
  { num: "03", title: "Launch", desc: "Use AI to write your store copy, ad hooks, and product descriptions — then go live." },
];

const COMPARISON = [
  { feature: "Built for Shopify/Dropshipping", spyiq: true,  helium: false, copyfy: true  },
  { feature: "AI woven into every tool",       spyiq: true,  helium: false, copyfy: false },
  { feature: "Store Spy + Revenue estimates",  spyiq: true,  helium: false, copyfy: true  },
  { feature: "AI Store Builder",               spyiq: true,  helium: false, copyfy: false },
  { feature: "Ad Intelligence (5 platforms)", spyiq: true,  helium: false, copyfy: true  },
  { feature: "Clean, non-overwhelming UX",     spyiq: true,  helium: false, copyfy: true  },
  { feature: "Keyword Research",               spyiq: true,  helium: true,  copyfy: false },
  { feature: "Trend Radar with alerts",        spyiq: true,  helium: true,  copyfy: false },
];

const TESTIMONIALS = [
  { name: "Alex K.",  role: "Shopify store owner",    text: "Found my first winning product in 4 hours using SpyIQ. Went from $0 to $14k in month one.", metric: "$14k first month" },
  { name: "Sarah M.", role: "Dropshipping coach",      text: "I've tried Helium 10 and Minea. SpyIQ is the only tool that actually feels built for 2025.", metric: "3 winning stores" },
  { name: "James T.", role: "6-figure dropshipper",    text: "The Store Spy alone is worth the subscription. I reverse-engineer any competitor in under 2 minutes.", metric: "$280k revenue" },
];

const PLANS = [
  { name: "Free",    price: "$0",    period: "/mo",  features: ["5 product searches/day", "3 store analyses", "Basic product data", "No AI features"], cta: "Get Started",     highlight: false },
  { name: "Starter", price: "$29",   period: "/mo",  features: ["50 searches/day", "20 store analyses", "100 AI credits/mo", "Ad Intelligence", "Trend Radar"], cta: "Start Free Trial", highlight: false },
  { name: "Pro",     price: "$79",   period: "/mo",  features: ["Unlimited searches", "100 stores/mo", "500 AI credits", "Alerts & notifications", "Keyword Research", "AI Store Builder"], cta: "Start Free Trial", highlight: true, badge: "Most Popular" },
  { name: "Agency",  price: "$199",  period: "/mo",  features: ["Everything unlimited", "5 team seats", "API access", "White-label", "Batch generation", "Priority support"], cta: "Contact Sales",   highlight: false },
];

const FAQ = [
  { q: "What makes SpyIQ different from Helium 10?",         a: "Helium 10 is built for Amazon FBA. SpyIQ is designed specifically for Shopify and dropshipping — with AI woven into every feature, not bolted on as an afterthought." },
  { q: "Is there a free trial?",                             a: "Yes — every new account gets 5 days of full Pro access with no credit card required. You can explore every feature before committing." },
  { q: "How accurate are the revenue and traffic estimates?", a: "Our estimates are AI-powered and based on multiple signals including ad spend data, keyword traffic, and market benchmarks. They are estimates, not exact figures." },
  { q: "Can I cancel anytime?",                              a: "Yes. You can cancel your subscription at any time from your billing settings. No long-term contracts, no cancellation fees." },
  { q: "Does SpyIQ work for Amazon sellers?",               a: "SpyIQ is optimised for Shopify and dropshipping. While some features like keyword research can be used broadly, the product database and store spy are Shopify-focused." },
  { q: "What AI model powers SpyIQ?",                       a: "SpyIQ is powered by Claude Sonnet 4.6 from Anthropic — one of the most capable AI models available, known for accuracy and nuanced analysis." },
];

function Check() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(94,184,154,0.15)"/><path d="M5 8l2 2 4-4" stroke="#5eb89a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function X() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(90,90,100,0.15)"/><path d="M6 6l4 4M10 6l-4 4" stroke="#3a3a42" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export default function LandingPage() {
  return (
    <div style={{ background: "#0c0c0e", color: "#f5f3ee", fontFamily: "Inter, sans-serif" }}>

      {/* ── Nav ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
        <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={100} height={34} style={{ height: "auto" }} />
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#8a8a94" }}>
          {["Features", "How it works", "Pricing", "FAQ"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="transition-colors hover:text-[#f5f3ee]">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium transition-colors hover:text-[#c49a5a]"
            style={{ color: "#8a8a94" }}>Sign in</Link>
          <Link href="/signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#a07840", color: "#f5f3ee" }}>
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────── */}
      <section className="text-center px-6 pt-20 pb-24 max-w-[860px] mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-6"
          style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.25)", color: "#5eb89a" }}>
          ✦ Powered by Claude Sonnet 4.6
        </div>
        <h1 className="font-bold mb-5" style={{ fontSize: "clamp(36px,6vw,64px)", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
          Find Winning Products<br />
          <span style={{ color: "#a07840" }}>Before Everyone Else</span>
        </h1>
        <p className="text-lg mb-10 max-w-[580px] mx-auto" style={{ color: "#8a8a94", lineHeight: 1.7 }}>
          The Shopify & dropshipping intelligence platform that combines deep competitor research,
          trend tracking, and AI-powered analysis — in one clean tool.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/signup"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#a07840", color: "#f5f3ee", letterSpacing: "-0.2px" }}>
            ⚡ Start for Free — No credit card
          </Link>
          <Link href="/login"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#15151a", border: "1px solid #2a2a33", color: "#f5f3ee" }}>
            Sign in →
          </Link>
        </div>
        <p className="text-xs mt-4" style={{ color: "#5c5c64" }}>5-day full Pro trial · No card needed · Cancel anytime</p>
      </section>

      {/* ── Social proof bar ────────────────── */}
      <div className="border-y py-4" style={{ borderColor: "#2a2a33", background: "#15151a" }}>
        <div className="flex items-center justify-center gap-8 flex-wrap px-6 text-xs" style={{ color: "#5c5c64" }}>
          <span>⭐⭐⭐⭐⭐ <strong style={{ color: "#8a8a94" }}>4.9/5</strong> from 2,400+ users</span>
          <span style={{ color: "#2a2a33" }}>|</span>
          <span>🏆 <strong style={{ color: "#8a8a94" }}>$2.4M+</strong> in revenue tracked monthly</span>
          <span style={{ color: "#2a2a33" }}>|</span>
          <span>🤖 Powered by <strong style={{ color: "#8a8a94" }}>Claude Sonnet 4.6</strong></span>
          <span style={{ color: "#2a2a33" }}>|</span>
          <span>🚀 <strong style={{ color: "#8a8a94" }}>12,000+</strong> products in database</span>
        </div>
      </div>

      {/* ── Features ────────────────────────── */}
      <section id="features" className="px-6 py-24 max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Features</p>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            Every tool you need.<br />Nothing you don&apos;t.
          </h2>
          <p className="text-base max-w-[480px] mx-auto" style={{ color: "#8a8a94" }}>
            SpyIQ replaces 6 separate tools with one clean platform — powered by AI throughout.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 transition-all group"
              style={{ background: "#15151a", border: "1px solid #2a2a33" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}>
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="font-bold mb-2" style={{ fontSize: 16, color: "#f5f3ee" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────── */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: "#15151a" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>How it works</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              From idea to first sale in 3 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px"
                    style={{ background: "linear-gradient(90deg, #a07840, transparent)" }} />
                )}
                <div className="rounded-2xl p-6" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                  <div className="text-4xl font-black mb-4" style={{ color: "rgba(160,120,64,0.2)", letterSpacing: "-2px" }}>{s.num}</div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: "#f5f3ee" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ──────────────────────── */}
      <section className="px-6 py-24 max-w-[900px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Comparison</p>
          <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            How SpyIQ stacks up
          </h2>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2a2a33" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#15151a", borderBottom: "1px solid #2a2a33" }}>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#5c5c64", width: "40%" }}>Feature</th>
                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: "#a07840" }}>SpyIQ</th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#5c5c64" }}>Helium 10</th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#5c5c64" }}>Copyfy</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature}
                  style={{ background: i % 2 === 0 ? "#15151a" : "transparent", borderBottom: i < COMPARISON.length - 1 ? "1px solid #1d1d24" : undefined }}>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#f5f3ee" }}>{row.feature}</td>
                  <td className="px-5 py-3.5 text-center"><div className="flex justify-center">{row.spyiq  ? <Check /> : <X />}</div></td>
                  <td className="px-5 py-3.5 text-center"><div className="flex justify-center">{row.helium ? <Check /> : <X />}</div></td>
                  <td className="px-5 py-3.5 text-center"><div className="flex justify-center">{row.copyfy ? <Check /> : <X />}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section className="px-6 py-24" style={{ background: "#15151a" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Testimonials</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              Real results from real dropshippers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                <div className="flex mb-3">
                  {[1,2,3,4,5].map((i) => <span key={i} style={{ color: "#a07840" }}>★</span>)}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#f5f3ee" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #2a2a33" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#5c5c64" }}>{t.role}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ background: "rgba(94,184,154,0.12)", border: "1px solid rgba(94,184,154,0.25)", color: "#5eb89a" }}>
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section id="pricing" className="px-6 py-24 max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>Pricing</p>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-base" style={{ color: "#8a8a94" }}>Start free. Upgrade when you&apos;re ready.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((p) => (
            <div key={p.name} className="rounded-2xl p-5 relative"
              style={{
                background: p.highlight ? "rgba(160,120,64,0.08)" : "#15151a",
                border: `1px solid ${p.highlight ? "#a07840" : "#2a2a33"}`,
              }}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold"
                    style={{ background: "#a07840", color: "#f5f3ee" }}>
                    {p.badge}
                  </span>
                </div>
              )}
              <p className="font-bold text-sm mb-1" style={{ color: "#f5f3ee" }}>{p.name}</p>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className="font-black" style={{ fontSize: 32, color: p.highlight ? "#c49a5a" : "#f5f3ee", letterSpacing: "-1px" }}>{p.price}</span>
                <span className="text-xs" style={{ color: "#5c5c64" }}>{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#8a8a94" }}>
                    <span style={{ color: "#5eb89a", flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: p.highlight ? "#a07840" : "#1d1d24",
                  border:     p.highlight ? "none" : "1px solid #2a2a33",
                  color:      p.highlight ? "#f5f3ee" : "#8a8a94",
                }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section id="faq" className="px-6 py-24" style={{ background: "#15151a" }}>
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a07840" }}>FAQ</p>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl p-5" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                <p className="font-semibold text-sm mb-2" style={{ color: "#f5f3ee" }}>{item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.8px" }}>
            Start finding winning products today
          </h2>
          <p className="text-base mb-8" style={{ color: "#8a8a94" }}>
            5-day full Pro trial. No credit card required. Cancel anytime.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all"
            style={{ background: "#a07840", color: "#f5f3ee" }}>
            ⚡ Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="px-6 py-8" style={{ borderTop: "1px solid #2a2a33" }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={80} height={28} style={{ height: "auto" }} />
          <p className="text-xs" style={{ color: "#5c5c64" }}>
            © 2026 SpyIQ · Built with Claude Sonnet 4.6
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: "#5c5c64" }}>
            <Link href="/login" className="hover:text-[#8a8a94] transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-[#8a8a94] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

export const metadata: Metadata = {
  title: "Terms of Service — SpyIQ",
  description: "The terms and conditions for using SpyIQ.",
};

type Section = {
  h: string;
  intro?: string;
  bullets?: string[];
  outro?: string;
  node?: ReactNode;
};

const SECTIONS: Section[] = [
  {
    h: "1. Acceptance of Terms",
    intro:
      'By accessing or using SpyIQ ("SpyIQ", "we", "us", or "our") through spyiq.co or associated applications (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
  },
  {
    h: "2. Description of Service",
    intro:
      "SpyIQ is an ecommerce intelligence platform that provides product research, store and ad analysis, keyword research, trend tracking, and AI-powered insights for Shopify and dropshipping entrepreneurs. Features include IQ Scores, store and revenue estimates, an AI Analyzer, and an AI Store Builder.",
  },
  {
    h: "3. Eligibility and Accounts",
    intro:
      "You must be at least 18 years old to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate and current information.",
  },
  {
    h: "4. Subscription Plans and Billing",
    intro:
      "SpyIQ offers Free, Starter, Pro, and Agency plans. Paid subscriptions are billed through Stripe on a recurring basis and renew automatically until cancelled. Each plan includes usage limits (searches, store analyses, AI credits); AI credit overages may be billed at the rate shown at checkout. You may cancel anytime via your account billing portal; access continues until the end of the current billing period. Fees are non-refundable except where required by law.",
  },
  {
    h: "5. Free Trial",
    intro:
      "New users may receive a 5-day Pro trial. If you do not cancel before the trial ends, your selected plan begins and billing starts. We reserve the right to modify or withdraw trial offers.",
  },
  {
    h: "6. Acceptable Use",
    intro: "You agree not to:",
    bullets: [
      "scrape, copy, or resell SpyIQ's platform or data",
      "share your account or resell access",
      "use the Service for unlawful purposes",
      "attempt to bypass rate limits or security",
      "abuse, jailbreak, or attempt to extract underlying models from the AI features",
      "use the Service to develop a competing product",
    ],
  },
  {
    h: "7. AI-Generated Content Disclaimer",
    intro:
      "IMPORTANT: SpyIQ's AI features — including IQ Scores, demand/competition/margin/viral scores, monthly sales and revenue estimates, store traffic figures, ad spend estimates, product data, and AI Analyzer and AI Store Builder outputs — are AI-generated estimates produced for research and informational purposes only. They are NOT guaranteed to be accurate, complete, current, or error-free, and are NOT guarantees of sales, profit, or business outcomes. AI systems can produce incorrect or fabricated information. You are solely responsible for independently verifying any AI-generated output before making business, financial, or purchasing decisions based on it. SpyIQ is not a financial, legal, or business advisor.",
  },
  {
    h: "8. Intellectual Property",
    intro:
      "SpyIQ and its platform, branding, and software are owned by us and protected by applicable laws. You retain ownership of the data and content you submit. AI Store Builder outputs generated for you may be used by you for your own business; you are responsible for ensuring such outputs do not infringe third-party rights.",
  },
  {
    h: "9. Third-Party Data and Services",
    intro:
      "Analysis of competitor stores, products, and ads is provided for informational purposes only. SpyIQ relies on third-party services (including Supabase, Stripe, Anthropic, Upstash, and Vercel); we are not responsible for their availability or performance.",
  },
  {
    h: "10. Service Availability and Changes",
    intro:
      'The Service is provided "as is" and "as available." We may modify, suspend, or discontinue features, including AI model versions, at any time. We aim to give reasonable notice of material changes where practicable.',
  },
  {
    h: "11. Disclaimer of Warranties",
    intro:
      "To the maximum extent permitted by law, the Service is provided without warranties of any kind, express or implied, including accuracy, fitness for a particular purpose, and non-infringement, particularly with respect to AI-generated outputs.",
  },
  {
    h: "12. Limitation of Liability",
    intro:
      "To the maximum extent permitted by law, SpyIQ shall not be liable for any indirect, incidental, consequential, or punitive damages, or for any business decisions, lost profits, or losses arising from reliance on AI-generated content or estimates. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.",
  },
  {
    h: "13. Termination",
    intro:
      "We may suspend or terminate accounts that violate these Terms or for any unlawful or abusive activity. You may stop using the Service at any time.",
  },
  {
    h: "14. Changes to These Terms",
    intro:
      'We may update these Terms from time to time. The "Last updated" date reflects the most recent version. Continued use after changes constitutes acceptance.',
  },
  {
    h: "15. Governing Law",
    node: (
      <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>
        These Terms are governed by the laws of{" "}
        <mark
          className="rounded px-1.5 py-0.5 font-semibold"
          style={{
            background: "rgba(212,181,114,0.16)",
            color: "#d4b572",
            border: "1px solid rgba(212,181,114,0.35)",
          }}
        >
          [PLACEHOLDER: jurisdiction to be set]
        </mark>
        . ⚠️ This must be filled in before public launch.
      </p>
    ),
  },
  {
    h: "16. Contact",
    intro: "For questions about these Terms: legal@spyiq.co",
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#0c0c0e", color: "#f5f3ee", fontFamily: "Inter, sans-serif" }}>
      <PublicHeader />

      {/* ── Draft banner ─────────────────────── */}
      <div className="px-6">
        <div
          className="max-w-[720px] mx-auto mt-4 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(212,181,114,0.10)",
            border: "1px solid rgba(212,181,114,0.30)",
            color: "#d4b572",
          }}
        >
          ⚠️ Draft for review — not yet reviewed by legal counsel. Replace before public launch.
        </div>
      </div>

      {/* ── Terms content ────────────────────── */}
      <main className="px-6 py-12">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-bold mb-2" style={{ fontSize: 32, letterSpacing: "-1px" }}>
            Terms of Service
          </h1>
          <p className="text-sm mb-10" style={{ color: "#8a8a94" }}>
            Last updated: June 2026
          </p>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="font-semibold mb-2" style={{ fontSize: 17, color: "#f5f3ee" }}>
                  {s.h}
                </h2>
                {s.node}
                {s.intro && (
                  <p className="text-sm leading-relaxed" style={{ color: "#8a8a94" }}>
                    {s.intro}
                  </p>
                )}
                {s.bullets && (
                  <ul className="mt-2 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "#8a8a94" }}>
                        <span style={{ color: "#a07840", flexShrink: 0 }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.outro && (
                  <p className="text-sm leading-relaxed mt-3" style={{ color: "#8a8a94" }}>
                    {s.outro}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div
            className="mt-12 pt-6 flex items-center gap-5 text-sm"
            style={{ borderTop: "1px solid #2a2a33" }}
          >
            <Link href="/" className="transition-colors hover:text-[#c49a5a]" style={{ color: "#8a8a94" }}>
              ← Back home
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#c49a5a]" style={{ color: "#8a8a94" }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer (matches landing) ─────────── */}
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

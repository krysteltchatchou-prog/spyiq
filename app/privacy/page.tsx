import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";

export const metadata: Metadata = {
  title: "Privacy Policy — SpyIQ",
  description: "How SpyIQ collects, uses, stores, and protects your personal data.",
};

type Section = {
  h: string;
  intro?: string;
  bullets?: string[];
  outro?: string;
};

const SECTIONS: Section[] = [
  {
    h: "1. Introduction",
    intro:
      'This Privacy Policy explains how SpyIQ ("SpyIQ", "we", "us", or "our") collects, uses, stores, and protects personal data when you access or use our services through spyiq.co or associated applications (the "Service"). By accessing the Service, you acknowledge that you have read and accepted this Privacy Policy. SpyIQ is the Data Controller responsible for processing your personal data.',
  },
  {
    h: "2. Personal Data We Collect",
    bullets: [
      "Identification data: Full name",
      "Contact data: Email address",
      "Account information: Subscription plan (Free/Starter/Pro/Agency), billing status, AI credits usage",
      "Technical data: IP address, device type, OS version, browser type, session logs",
      "Usage data: Product searches, store/ad analyses, saved items, AI Analyzer queries, feature usage, time spent, crash reports",
      "Support communication: messages, attachments",
    ],
    outro:
      "Payment information is processed securely by Stripe. We do not store full credit card numbers.",
  },
  {
    h: "3. Legal Basis for Processing (GDPR)",
    bullets: [
      "Performance of a contract: to provide, manage, and maintain your account and subscription",
      "Consent: for marketing communications and non-essential cookies",
      "Legitimate interest: product improvement, fraud prevention, analytics",
      "Legal compliance: tax, accounting, and regulatory obligations",
    ],
  },
  {
    h: "4. How We Use Your Data",
    bullets: [
      "Provide and operate the Service (product research, store/ad intelligence, AI insights)",
      "Authenticate access and manage subscriptions",
      "Process payments",
      "Generate AI-powered analysis and insights",
      "Send alerts you've configured",
      "Offer support and communicate product updates",
      "Improve functionality and user experience",
      "Detect and prevent fraud or abuse",
      "Comply with applicable laws",
    ],
  },
  {
    h: "5. Third-Party Processors",
    bullets: [
      "Supabase (authentication and database hosting)",
      "Stripe (payment processing)",
      "Anthropic (Claude AI API — powers AI Analyzer, IQ Scores, and store/ad analysis; your AI queries are sent to Anthropic to generate responses)",
      "Upstash (Redis caching and rate limiting)",
      "Vercel (application hosting)",
    ],
    outro:
      "These providers act under binding confidentiality and data protection agreements.",
  },
  {
    h: "6. International Data Transfers",
    intro:
      "Your data may be transferred and stored outside your country, including the United States. When processing data from the EEA, UK, or Switzerland, we rely on the EU-US Data Privacy Framework, Standard Contractual Clauses (SCCs), and other legally recognized safeguards.",
  },
  {
    h: "7. Cookies",
    intro:
      "We use essential cookies (required for authentication and functionality), analytics cookies, and marketing/advertising cookies. You may manage consent via your browser settings or our cookie banner.",
  },
  {
    h: "8. Data Retention",
    intro:
      "We retain your personal data only as long as necessary for the purposes outlined above or as required by applicable law. Billing and legal data may be stored up to 7 years.",
  },
  {
    h: "9. User Rights",
    intro:
      'Depending on your jurisdiction (GDPR, CCPA), you may request access, correction, deletion ("Right to be Forgotten"), restriction or objection to processing, withdrawal of consent, and data portability (export). To exercise these rights, contact: privacy@spyiq.co',
  },
  {
    h: "10. Children's Privacy",
    intro:
      "The Service is not intended for individuals under 18 years old, and we do not knowingly collect their data.",
  },
  {
    h: "11. Data Security",
    intro:
      "We apply commercially reasonable security measures including encryption and Supabase Row Level Security, but no electronic storage or transmission is fully secure.",
  },
  {
    h: "12. Changes to This Policy",
    intro:
      'We may update this Policy from time to time. The "Last updated" date indicates the most recent modification.',
  },
  {
    h: "13. Contact",
    intro: "For privacy inquiries or rights requests: privacy@spyiq.co",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#f4f2ec", color: "#23221f", fontFamily: "Inter, sans-serif" }}>
      <PublicHeader />

      {/* ── Draft banner ─────────────────────── */}
      <div className="px-6">
        <div
          className="max-w-[720px] mx-auto mt-4 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(212,181,114,0.10)",
            border: "1px solid rgba(212,181,114,0.30)",
            color: "#c08a2a",
          }}
        >
          ⚠️ Draft for review — not yet reviewed by legal counsel. Replace before public launch.
        </div>
      </div>

      {/* ── Policy content ───────────────────── */}
      <main className="px-6 py-12">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-bold mb-2" style={{ fontSize: 32, letterSpacing: "-1px" }}>
            Privacy Policy
          </h1>
          <p className="text-sm mb-10" style={{ color: "#4d4b44" }}>
            Last updated: June 2026
          </p>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="font-semibold mb-2" style={{ fontSize: 17, color: "#23221f" }}>
                  {s.h}
                </h2>
                {s.intro && (
                  <p className="text-sm leading-relaxed" style={{ color: "#4d4b44" }}>
                    {s.intro}
                  </p>
                )}
                {s.bullets && (
                  <ul className="mt-2 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "#4d4b44" }}>
                        <span style={{ color: "#a07840", flexShrink: 0 }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.outro && (
                  <p className="text-sm leading-relaxed mt-3" style={{ color: "#4d4b44" }}>
                    {s.outro}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div
            className="mt-12 pt-6 flex items-center gap-5 text-sm"
            style={{ borderTop: "1px solid #e4e1d8" }}
          >
            <Link href="/" className="transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
              ← Back home
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#8a6530]" style={{ color: "#4d4b44" }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer (matches landing) ─────────── */}
      <footer className="px-6 py-8" style={{ borderTop: "1px solid #e4e1d8" }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={80} height={28} style={{ height: "auto" }} />
          <p className="text-xs" style={{ color: "#5d5b54" }}>
            © 2026 SpyIQ · Built with Claude Sonnet 4.6
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: "#5d5b54" }}>
            <Link href="/login" className="hover:text-[#4d4b44] transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-[#4d4b44] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

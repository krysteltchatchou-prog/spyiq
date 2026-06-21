"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import StoreBuilderDemo from "@/components/landing/StoreBuilderDemo";

const TRUST = [
  "Generate a full store from any product link",
  "Branding, copy & homepage — written for you",
  "Edit visually, then export to Shopify",
];

/**
 * Shared split-screen layout for the auth flow (signup / login / reset).
 * Left = branded showcase panel with the live store-build demo (desktop only),
 * so the funnel feels continuous with the landing page.
 * Right = clean light form area; `children` is the form for each page.
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen lg:grid lg:grid-cols-[1.04fr_1fr]"
      style={{ background: "#f4f2ec", color: "#23221f", fontFamily: "Inter, sans-serif" }}
    >
      {/* ── Left brand panel (desktop only) ── */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12"
        style={{ background: "linear-gradient(160deg, #17171c 0%, #0d0d10 100%)" }}
      >
        <div className="sq-aurora" style={{ opacity: 0.5 }} />

        <Link href="/" aria-label="SpyIQ home" className="relative inline-block w-fit">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={135} height={46} style={{ height: "auto" }} priority />
        </Link>

        <div className="relative">
          <h2 className="font-extrabold mb-8" style={{ fontSize: 32, letterSpacing: "-1px", lineHeight: 1.1, color: "#f5f3ee" }}>
            Paste a product link.<br />
            <span className="sq-gold-text">Get a store that sells.</span>
          </h2>
          <div className="flex justify-center scale-[0.88] origin-top">
            <StoreBuilderDemo />
          </div>
        </div>

        <ul className="relative space-y-2.5">
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-sm" style={{ color: "#c8c6bf" }}>
              <span
                className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                style={{ background: "rgba(94,184,154,0.16)" }}
              >
                <Check size={11} color="#5eb89a" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right form area ── */}
      <div className="flex flex-col items-center justify-center px-5 py-12">
        {/* mobile logo */}
        <Link href="/" aria-label="SpyIQ home" className="lg:hidden mb-8">
          <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={135} height={46} style={{ height: "auto" }} priority />
        </Link>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}

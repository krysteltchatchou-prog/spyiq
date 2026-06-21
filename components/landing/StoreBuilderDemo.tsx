"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero "magic" element. Self-contained, auto-playing, looping demo that
 * shows SpyIQ turning a pasted product link into a finished, branded store:
 *   1. types a product URL into the address bar
 *   2. runs AI build steps that check off one by one
 *   3. assembles a mini branded storefront section-by-section, in sync
 *   4. shows a "store live" state, pauses, then loops
 *
 * No external animation deps — driven by timers + CSS keyframes in globals.css.
 */

const URL_TEXT = "aliexpress.com/item/aurora-heated-vest";

const BUILD_STEPS = [
  "Reading product data",
  "Generating brand identity",
  "Writing conversion copy",
  "Designing the homepage",
  "Optimizing for sales",
];

type Phase = "typing" | "building" | "done";

export default function StoreBuilderDemo() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [done, setDone] = useState(0); // number of completed build steps
  const [cycle, setCycle] = useState(0); // bump to remount revealed sections each loop
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(() => !cancelled && fn(), ms));
    };

    function run() {
      setTyped("");
      setPhase("typing");
      setDone(0);
      setCycle((c) => c + 1);

      const TYPE_START = 600;
      const TYPE_SPEED = 52;
      URL_TEXT.split("").forEach((_, i) => {
        push(() => setTyped(URL_TEXT.slice(0, i + 1)), TYPE_START + i * TYPE_SPEED);
      });

      const afterType = TYPE_START + URL_TEXT.length * TYPE_SPEED + 550;
      push(() => setPhase("building"), afterType);

      const STEP_GAP = 760;
      BUILD_STEPS.forEach((_, i) => {
        push(() => setDone(i + 1), afterType + 350 + i * STEP_GAP);
      });

      const afterSteps = afterType + 350 + BUILD_STEPS.length * STEP_GAP + 450;
      push(() => setPhase("done"), afterSteps);

      // hold the finished store, then loop
      push(() => run(), afterSteps + 4200);
    }

    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const buildingDone = phase === "done";
  // storefront sections appear progressively as steps complete
  const showStore = done >= 1 || buildingDone;
  const showHero = done >= 2 || buildingDone;
  const showProduct = done >= 3 || buildingDone;
  const showReviews = done >= 4 || buildingDone;

  return (
    <div
      className="relative w-full max-w-[520px] mx-auto sq-float"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* glow behind the window */}
      <div
        className="absolute -inset-6 rounded-[28px] -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(160,120,64,0.20), transparent 70%)",
        }}
      />

      {/* browser window */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#0e0e12",
          border: "1px solid #2a2a33",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
        }}
      >
        {/* chrome / address bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: "#15151a", borderBottom: "1px solid #2a2a33" }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#d4685f" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#d4b572" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#5eb89a" }} />
          </div>
          <div
            className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs min-w-0"
            style={{ background: "#0c0c0e", border: "1px solid #2a2a33", color: "#8a8a94" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5c5c64" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className={`truncate ${phase === "typing" ? "sq-cursor" : ""}`} style={{ color: "#c8c8d0" }}>
              {typed || " "}
            </span>
          </div>
          <span
            className="hidden sm:inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap"
            style={{ background: "#a07840", color: "#f5f3ee" }}
          >
            ⚡ Generate
          </span>
        </div>

        {/* canvas */}
        <div className="relative" style={{ height: 340, background: "#0c0c0e" }}>
          {/* empty / scanning state before the first section lands */}
          {!showStore && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sq-grid-bg">
              <div
                className="w-10 h-10 rounded-full sq-spin"
                style={{ border: "3px solid #2a2a33", borderTopColor: "#a07840" }}
              />
              <p className="text-xs" style={{ color: "#8a8a94" }}>
                {phase === "typing" ? "Paste any product link…" : "Reading the product…"}
              </p>
            </div>
          )}

          {/* assembling storefront */}
          {showStore && (
            <div key={cycle} className="absolute inset-0 overflow-hidden">
              {/* announcement bar */}
              <div
                className="sq-reveal-up text-center py-1.5 text-[10px] font-semibold tracking-wide"
                style={{ background: "#a07840", color: "#f5f3ee" }}
              >
                ✦ FREE EXPRESS SHIPPING · 30-DAY RETURNS
              </div>

              {/* store nav */}
              <div
                className="sq-reveal-up flex items-center justify-between px-4 py-2.5"
                style={{ animationDelay: "0.08s", borderBottom: "1px solid #1d1d24" }}
              >
                <span className="text-xs font-black tracking-tight" style={{ color: "#f5f3ee" }}>
                  AURORA<span style={{ color: "#a07840" }}>·</span>WEAR
                </span>
                <div className="flex gap-3 text-[9px]" style={{ color: "#8a8a94" }}>
                  <span>Shop</span>
                  <span>Tech</span>
                  <span>🛒</span>
                </div>
              </div>

              {showHero && (
                <div className="sq-reveal-up flex gap-3 px-4 py-3 items-center" style={{ animationDelay: "0.05s" }}>
                  {/* product image block */}
                  <div
                    className="sq-scale-in flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 92,
                      height: 92,
                      background: "linear-gradient(150deg, #1d1d24, #15151a)",
                      border: "1px solid #2a2a33",
                      fontSize: 38,
                    }}
                  >
                    🧥
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight" style={{ color: "#f5f3ee", letterSpacing: "-0.3px" }}>
                      Stay Warm Anywhere,<br />All Winter Long
                    </p>
                    <p className="text-[9px] mt-1 leading-snug" style={{ color: "#8a8a94" }}>
                      Carbon-fibre heating, 12-hour battery, machine washable.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="rounded-md px-2.5 py-1 text-[9px] font-bold"
                        style={{ background: "#a07840", color: "#f5f3ee" }}
                      >
                        Add to cart — $89
                      </span>
                      <span className="text-[9px] line-through" style={{ color: "#5c5c64" }}>$149</span>
                    </div>
                  </div>
                </div>
              )}

              {showProduct && (
                <div className="sq-reveal-up grid grid-cols-3 gap-2 px-4 pb-1">
                  {[
                    { t: "🔋", l: "12h battery" },
                    { t: "🌡️", l: "3 heat zones" },
                    { t: "💧", l: "Water-proof" },
                  ].map((f) => (
                    <div
                      key={f.l}
                      className="rounded-lg px-2 py-2 text-center"
                      style={{ background: "#15151a", border: "1px solid #1d1d24" }}
                    >
                      <div className="text-[15px]">{f.t}</div>
                      <div className="text-[8px] mt-0.5" style={{ color: "#8a8a94" }}>{f.l}</div>
                    </div>
                  ))}
                </div>
              )}

              {showReviews && (
                <div
                  className="sq-reveal-up mx-4 mt-2 rounded-lg px-3 py-2"
                  style={{ background: "#15151a", border: "1px solid #1d1d24" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: "#d4b572" }}>★★★★★</span>
                    <span className="text-[9px] font-semibold" style={{ color: "#f5f3ee" }}>4.9</span>
                    <span className="text-[9px]" style={{ color: "#8a8a94" }}>· 2,148 reviews</span>
                  </div>
                  <p className="text-[9px] mt-1 italic leading-snug" style={{ color: "#8a8a94" }}>
                    “Wore it skiing at -10°C and stayed toasty the whole day.”
                  </p>
                </div>
              )}
            </div>
          )}

          {/* status overlay (build steps / done badge) */}
          <div className="absolute left-0 right-0 bottom-0">
            {phase === "building" && (
              <div
                className="m-3 rounded-xl p-3 backdrop-blur sq-scale-in"
                style={{ background: "rgba(15,15,18,0.92)", border: "1px solid #2a2a33" }}
              >
                {BUILD_STEPS.map((label, i) => {
                  const complete = done > i;
                  const active = done === i;
                  if (!complete && !active) return null;
                  return (
                    <div key={label} className="flex items-center gap-2 py-0.5">
                      {complete ? (
                        <span
                          className="flex items-center justify-center w-4 h-4 rounded-full sq-scale-in"
                          style={{ background: "rgba(94,184,154,0.18)" }}
                        >
                          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8l2.5 2.5L12 5" stroke="#5eb89a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full sq-spin"
                          style={{ border: "2px solid #2a2a33", borderTopColor: "#a07840" }}
                        />
                      )}
                      <span
                        className="text-[11px]"
                        style={{ color: complete ? "#8a8a94" : "#f5f3ee", fontWeight: active ? 600 : 400 }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {buildingDone && (
              <div
                className="m-3 rounded-xl px-3 py-2.5 flex items-center justify-between sq-scale-in"
                style={{
                  background: "rgba(94,184,154,0.12)",
                  border: "1px solid rgba(94,184,154,0.32)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center w-5 h-5 rounded-full sq-pulse-ring"
                    style={{ background: "#5eb89a" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8l2.5 2.5L12 5" stroke="#0c0c0e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: "#f5f3ee" }}>
                    Store ready to sell
                  </span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: "#5eb89a" }}>
                  built in 47s
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* floating stat chips */}
      <div
        className="absolute -left-4 top-[38%] hidden md:flex items-center gap-2 rounded-xl px-3 py-2 sq-scale-in"
        style={{
          background: "#15151a",
          border: "1px solid #2a2a33",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          animationDelay: "0.4s",
        }}
      >
        <span className="text-base">📈</span>
        <div>
          <p className="text-[10px] leading-none" style={{ color: "#8a8a94" }}>Conversion copy</p>
          <p className="text-xs font-bold leading-tight" style={{ color: "#5eb89a" }}>+ written for you</p>
        </div>
      </div>
      <div
        className="absolute -right-3 bottom-[20%] hidden md:flex items-center gap-2 rounded-xl px-3 py-2 sq-scale-in"
        style={{
          background: "#15151a",
          border: "1px solid #2a2a33",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          animationDelay: "0.6s",
        }}
      >
        <span className="text-base">🛍️</span>
        <div>
          <p className="text-[10px] leading-none" style={{ color: "#8a8a94" }}>One click</p>
          <p className="text-xs font-bold leading-tight" style={{ color: "#c49a5a" }}>Export to Shopify</p>
        </div>
      </div>
    </div>
  );
}

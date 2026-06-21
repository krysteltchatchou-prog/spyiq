"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draggable before/after reveal. "Before" = a raw, unstyled product import.
 * "After" = the same product as a finished, branded SpyIQ storefront.
 * Both panels are absolutely stacked at equal size; the after-panel is
 * clipped by the slider position so dragging wipes between the two.
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(52); // percent revealed of "after"
  const [width, setWidth] = useState(0); // measured wrapper width (px)
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  function setFromClientX(clientX: number) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{ height: 420, border: "1px solid #e4e1d8", boxShadow: "0 24px 60px -30px rgba(60,50,30,0.35)", cursor: "ew-resize", touchAction: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      {/* ── BEFORE (raw import) ── */}
      <div className="absolute inset-0" style={{ background: "#f3f1ec" }}>
        <div className="px-6 py-4 h-full flex flex-col" style={{ color: "#3a3a42" }}>
          <p className="text-[11px] font-mono" style={{ color: "#9a9a9a" }}>raw import · aliexpress</p>
          <div className="flex gap-4 mt-4">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 110, height: 110, background: "#e2ded6", color: "#b8b2a6", fontSize: 40 }}
            >
              🧥
            </div>
            <div className="min-w-0">
              <p className="text-sm font-normal leading-snug" style={{ color: "#555" }}>
                2023 New Men&apos;s Women&apos;s Winter Warm Heated Vest USB Electric Heating Jacket Waistcoat
              </p>
              <p className="text-lg font-bold mt-2" style={{ color: "#c0392b" }}>US $23.74 - $41.18</p>
              <p className="text-[11px] mt-1" style={{ color: "#999" }}>4.6 ★ · 1k+ sold · Free shipping</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {[
              "Material: Polyester + Carbon Fiber",
              "Voltage: 5V USB (power bank not included)",
              "Note: please choose size according to chart",
            ].map((t) => (
              <p key={t} className="text-[11px]" style={{ color: "#888" }}>• {t}</p>
            ))}
          </div>
          <div className="mt-auto text-[10px]" style={{ color: "#bbb" }}>
            No branding · no story · no reason to buy here.
          </div>
        </div>
        <span
          className="absolute top-3 left-3 rounded-md px-2 py-1 text-[10px] font-bold"
          style={{ background: "rgba(0,0,0,0.06)", color: "#8a8a8a" }}
        >
          BEFORE
        </span>
      </div>

      {/* ── AFTER (branded SpyIQ store) — clipped by slider ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%`, background: "#0c0c0e", borderRight: "2px solid #a07840" }}
      >
        {/* fixed inner width so content doesn't squish while clipping */}
        <div className="h-full" style={{ width: width || "100%" }}>
          <div className="text-center py-2 text-[10px] font-semibold tracking-wide" style={{ background: "#a07840", color: "#f5f3ee" }}>
            ✦ WINTER DROP IS LIVE — FREE SHIPPING TODAY
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-black tracking-tight" style={{ color: "#f5f3ee" }}>
                AURORA<span style={{ color: "#a07840" }}>·</span>WEAR
              </span>
              <div className="flex gap-4 text-[11px]" style={{ color: "#8a8a94" }}>
                <span>Shop</span><span>Technology</span><span>Reviews</span><span>🛒</span>
              </div>
            </div>
            <div className="flex gap-5 items-center">
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 130, height: 130,
                  background: "linear-gradient(150deg, #1d1d24, #15151a)",
                  border: "1px solid #2a2a33", fontSize: 54,
                }}
              >
                🧥
              </div>
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-1 text-[9px] font-bold mb-2"
                  style={{ background: "rgba(94,184,154,0.14)", border: "1px solid rgba(94,184,154,0.3)", color: "#5eb89a" }}
                >
                  ❄️ BEST-SELLER · LIMITED STOCK
                </span>
                <p className="text-xl font-black leading-tight" style={{ color: "#f5f3ee", letterSpacing: "-0.6px" }}>
                  Outsmart The Cold.<br />Anywhere You Go.
                </p>
                <p className="text-[11px] mt-2 max-w-[260px] leading-snug" style={{ color: "#8a8a94" }}>
                  Carbon-fibre heat in 3 seconds, 12-hour battery, machine washable. Built for the people who refuse to stay inside.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="rounded-lg px-4 py-2 text-[11px] font-bold" style={{ background: "#a07840", color: "#f5f3ee" }}>
                    Add to cart — $89
                  </span>
                  <span className="text-[11px]" style={{ color: "#8a8a94" }}>
                    <span className="line-through" style={{ color: "#5c5c64" }}>$149</span> · Save 40%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { t: "🔋", l: "12-hour battery" },
                { t: "🌡️", l: "3 heat zones" },
                { t: "⭐", l: "4.9 · 2,148 reviews" },
              ].map((f) => (
                <div key={f.l} className="rounded-xl px-3 py-2.5 text-center" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                  <div className="text-lg">{f.t}</div>
                  <div className="text-[9px] mt-1" style={{ color: "#8a8a94" }}>{f.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <span
          className="absolute top-3 left-3 rounded-md px-2 py-1 text-[10px] font-bold"
          style={{ background: "rgba(160,120,64,0.2)", border: "1px solid rgba(160,120,64,0.35)", color: "#c49a5a" }}
        >
          AFTER · SPYIQ
        </span>
      </div>

      {/* drag handle */}
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 flex items-center justify-center rounded-full sq-pulse-ring"
          style={{ width: 38, height: 38, background: "#a07840", border: "2px solid #c49a5a", color: "#f5f3ee" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

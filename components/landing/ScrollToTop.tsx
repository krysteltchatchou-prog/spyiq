"use client";
import { useEffect, useState } from "react";

/**
 * Floating "scroll to top" button.
 * - Fixed in the bottom-right corner, above other content.
 * - Hidden near the top of the page; fades in once the user scrolls down.
 * - Smoothly scrolls back to the top when clicked.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll(); // set initial state in case the page loads already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Scroll back to top"
      className="fixed z-[60] flex items-center justify-center rounded-full transition-all hover:brightness-110"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        width: 48,
        height: 48,
        background: "#a07840",
        color: "#fdfbf6",
        boxShadow: "0 10px 26px -8px rgba(160,120,64,0.6)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

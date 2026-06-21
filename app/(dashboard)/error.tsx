"use client";

import { useEffect } from "react";

// Error boundary for the dashboard segment. Renders inside the layout shell
// (sidebar + topbar stay put), so it returns just the content-area card.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard] route error:", error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "60vh", padding: "2rem" }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
      <h1 className="font-bold mb-3" style={{ fontSize: 22, letterSpacing: "-0.5px", color: "#f5f3ee" }}>
        This page ran into a problem
      </h1>
      <p className="mb-6" style={{ color: "#8a8a94", lineHeight: 1.7, maxWidth: 440 }}>
        We couldn&apos;t load this view. It&apos;s usually temporary — try again, and the rest of SpyIQ stays right where you left it.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: "#a07840", color: "#f5f3ee" }}
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#15151a", border: "1px solid #2a2a33", color: "#f5f3ee" }}
        >
          Back to dashboard
        </a>
      </div>
      {error?.digest && (
        <p style={{ color: "#5c5c64", fontSize: 12, marginTop: 24 }}>Error ref: {error.digest}</p>
      )}
    </div>
  );
}

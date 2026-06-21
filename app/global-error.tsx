"use client";

// Catches errors thrown in the root layout itself. Must render its own
// <html>/<body> because it replaces the root layout when it fires.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0c0c0e",
          color: "#f5f3ee",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem", maxWidth: 520 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#8a8a94", lineHeight: 1.7, margin: "0 0 24px" }}>
            SpyIQ hit an unexpected error. Try again — if it keeps happening, refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#a07840",
              color: "#f5f3ee",
              border: "none",
              padding: "12px 24px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error?.digest && (
            <p style={{ color: "#5c5c64", fontSize: 12, marginTop: 20 }}>Error ref: {error.digest}</p>
          )}
        </main>
      </body>
    </html>
  );
}

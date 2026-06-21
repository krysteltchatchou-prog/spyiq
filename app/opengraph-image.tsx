import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SpyIQ — AI Ecommerce Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically generated Open Graph image (used for og: and twitter: cards).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0c0e",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#a07840",
              fontSize: "40px",
              fontWeight: 800,
              color: "#0c0c0e",
            }}
          >
            🔍
          </div>
          <div style={{ display: "flex", fontSize: "44px", fontWeight: 800, color: "#f5f3ee", letterSpacing: "-1px" }}>
            SpyIQ
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "76px", fontWeight: 800, color: "#f5f3ee", lineHeight: 1.05, letterSpacing: "-2px" }}>
          Find Winning Products
        </div>
        <div style={{ display: "flex", fontSize: "76px", fontWeight: 800, color: "#a07840", lineHeight: 1.05, letterSpacing: "-2px" }}>
          Before Everyone Else
        </div>

        <div style={{ display: "flex", fontSize: "30px", color: "#8a8a94", marginTop: "36px", maxWidth: "900px" }}>
          The Shopify &amp; dropshipping intelligence platform — competitor research, trend tracking, and AI woven throughout.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "44px" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              background: "rgba(94,184,154,0.12)",
              border: "1px solid rgba(94,184,154,0.3)",
              color: "#5eb89a",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            ✨ Powered by Claude Sonnet 4.6
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

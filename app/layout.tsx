import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://spyiq.co";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SpyIQ — AI Ecommerce Intelligence",
  description: "Find winning products, spy on competitors, and launch your Shopify store faster with AI.",
  keywords: ["dropshipping", "Shopify", "product research", "ad spy", "ecommerce intelligence", "AI"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "SpyIQ",
    title: "SpyIQ — AI Ecommerce Intelligence",
    description: "Find winning products, spy on competitors, and launch your Shopify store faster with AI.",
    // og:image is provided automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "SpyIQ — AI Ecommerce Intelligence",
    description: "Find winning products, spy on competitors, and launch your Shopify store faster with AI.",
    // twitter:image falls back to the generated opengraph-image
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}

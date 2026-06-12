import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SpyIQ — AI Ecommerce Intelligence",
  description: "Find winning products, spy on competitors, and launch your Shopify store faster with AI.",
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

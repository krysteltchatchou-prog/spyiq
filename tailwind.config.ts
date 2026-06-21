import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        bg: "#0c0c0e",
        surface: "#15151a",
        surface2: "#1d1d24",
        surface3: "#1f1f26",
        "border-color": "#2a2a33",
        accent: {
          DEFAULT: "#a07840",
          hover: "#8a6530",
          light: "#c49a5a",
        },
        secondary: "#8b8da0",
        success: "#5eb89a",
        danger: "#d4685f",
        warning: "#d4b572",
        "text-primary": "#f5f3ee",
        "text-muted": "#8a8a94",
        "disabled-bg": "#3a3a42",
        "disabled-text": "#5c5c64",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "card-hover": "0 4px 24px rgba(0,0,0,0.4)",
        "accent-glow": "0 0 20px rgba(160,120,64,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;

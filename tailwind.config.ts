import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        ui: ["var(--font-manrope)", "ui-sans-serif", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.5rem", { lineHeight: "1.25" }],
        "3xs": ["0.625rem", { lineHeight: "1.25" }],
        "4xs": ["0.6875rem", { lineHeight: "1.25" }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--border)",
        "muted-foreground": "var(--muted-foreground)",
        "heading-foreground": "var(--heading-foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

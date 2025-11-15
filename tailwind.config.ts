import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#fdfaf6",
        "bg-secondary": "#f5ede4",
        "bg-card": "#ffffff",
        "text-primary": "#1a1814",
        "text-secondary": "#6b6559",
        "text-muted": "#9b9389",
        "accent-primary": "#d97757",
        "accent-secondary": "#8b5e3c",
        "accent-tertiary": "#c9a690",
        "border-color": "#e8dfd5",
        success: "#6b9b7a",
        warning: "#d4a574",
        danger: "#c97766",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(139, 94, 60, 0.08)",
        md: "0 4px 16px rgba(139, 94, 60, 0.12)",
        lg: "0 8px 32px rgba(139, 94, 60, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;

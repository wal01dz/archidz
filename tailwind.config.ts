// tailwind.config.ts
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
        gold: {
          DEFAULT: "#b8922a",
          light: "#d4aa4a",
          pale: "#f5e9c8",
          bright: "#e8c870",
        },
        rust: "#c0481e",
        ink: {
          DEFAULT: "#12100e",
          2: "#3a3630",
        },
        sand: {
          DEFAULT: "#f7f4ee",
          2: "#edeae2",
        },
        muted: "#8a8070",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        instrument: ["Instrument Sans", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        float: "float 4s ease-in-out infinite",
        pulse: "pulseGold 2s infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.75)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        gold: "0 4px 20px rgba(184,146,42,0.3)",
        "gold-lg": "0 8px 40px rgba(184,146,42,0.45)",
        card: "0 4px 32px rgba(18,16,14,0.08)",
        "card-hover": "0 16px 50px rgba(18,16,14,0.12)",
      },
      backgroundImage: {
        "grid-gold":
          "linear-gradient(rgba(184,146,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,146,42,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [],
};

export default config;

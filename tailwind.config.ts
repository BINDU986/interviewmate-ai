import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#070B16",
          900: "#0B1020",
          850: "#0E1528",
          800: "#121A2D",
          700: "#182338",
          600: "#22324D",
          500: "#32486A",
        },
        cyan: {
          400: "#38E1F6",
          500: "#27D3E8",
          600: "#1AB4C8",
          glow: "rgba(39, 211, 232, 0.35)",
        },
        violet: {
          400: "#A295FF",
          500: "#8B7CFF",
          600: "#7362EE",
          glow: "rgba(139, 124, 255, 0.35)",
        },
        muted: {
          DEFAULT: "#A8B4C8",
          foreground: "#8493AB",
        },
        softwhite: "#F4F7FB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 4s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { filter: "drop-shadow(0 0 12px rgba(39, 211, 232, 0.3))" },
          "100%": { filter: "drop-shadow(0 0 24px rgba(139, 124, 255, 0.6))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 25px rgba(39, 211, 232, 0.25)",
        "neon-violet": "0 0 25px rgba(139, 124, 255, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;

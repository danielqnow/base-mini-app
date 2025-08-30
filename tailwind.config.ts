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
        background: "var(--app-background)",
        foreground: "var(--app-foreground)",
      },
      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
        glow: "glowPulse 2.4s ease-in-out infinite",
        "grid-drift": "gridDrift 30s linear infinite",
        neon: "neonPulse 2.2s ease-in-out infinite",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(0,184,212,0.25), 0 0 28px rgba(123,47,247,0.18)" },
          "50%": { boxShadow: "0 0 18px rgba(0,184,212,0.35), 0 0 44px rgba(123,47,247,0.28)" },
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0, 0 0, 0 0, 0 0" },
          "100%": { backgroundPosition: "120px 120px, 120px 0, 0 0, 0 0" },
        },
        neonPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(0,229,255,0.4))" },
          "50%": { filter: "drop-shadow(0 0 12px rgba(123,47,247,0.55))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

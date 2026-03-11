import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 importante

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        delos: {
          surface: "var(--delos-surface)",
          black: "var(--delos-black)",
          amber: "var(--delos-amber)",
          grey: "var(--delos-grey)",
          indigo: "var(--delos-indigo)",
          red: "var(--delos-red)",

          border: "var(--delos-border)",
          subtext: "var(--delos-subtext)",
        },
      },
      animation: {
        'pulse-slow': 'pulse-custom 10s ease-in-out infinite',
        'float': 'float-custom 15s linear infinite',
        'scan-slow': 'scan-custom 8s linear infinite',
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: '0.1', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '0.3', transform: 'translate(-50%, -50%) scale(1.05)' },
        },
        'float-custom': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.5' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        'scan-custom': {
          '0%': { top: '-10%' },
          '100%': { top: '110%' },
        }
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "monospace",
        ],
      },
    },
  },

  plugins: [],
};

export default config;
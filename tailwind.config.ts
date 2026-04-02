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
          // Adição: superfície elevada para cards no dark mode
          "surface-elevated": "var(--delos-surface-elevated)",
          black: "var(--delos-black)",
          amber: "var(--delos-amber)",
          container: "var(--delos-container)",
          item: "var(--delos-item)",
          green: "var(--delos-green)",
          // Adições: Variações de Âmbar para UI moderna
          "amber-soft": "var(--delos-amber-soft)",
          "amber-glow": "var(--delos-amber-glow)",
          grey: "var(--delos-grey)",
          // Adições: Variações de Cinza
          "grey-light": "var(--delos-grey-light)",
          "grey-dark": "var(--delos-grey-dark)",
          muted: "var(--delos-muted)",
          indigo: "var(--delos-indigo)",
          // Adições: Variações de Indigo
          "indigo-soft": "var(--delos-indigo-soft)",
          "indigo-bright": "var(--delos-indigo-bright)",
          red: "var(--delos-red)",
          // Adição: Status de Sucesso (Terminal OK)
          success: "var(--delos-success)",
          texto: "var(--delos-texto)",
          border: "var(--delos-border)",
          subtext: "var(--delos-subtext)",
        },
        // Adicionando a paleta Tropical como opção secundária
        tropical: {
          surface: "var(--tropical-surface)",
          sun: "var(--tropical-sun)",
          ocean: "var(--tropical-ocean)",
          leaf: "var(--tropical-leaf)",
          rain: "var(--tropical-rain)",
          accent: "var(--tropical-accent)",
        }
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
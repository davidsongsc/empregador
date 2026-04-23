import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        delos: {
          // SUPERFÍCIES PRINCIPAIS (Westworld Monocromático)
          surface: "var(--delos-surface)", // #050505
          "surface-elevated": "var(--delos-surface-elevated)", // #0a0a0a
          black: "var(--delos-black)", // #000000
          
          // ACENTOS TÉCNICOS
          amber: "var(--delos-amber)", // Cor de calibração padrão
          "amber-glow": "var(--delos-amber-glow)",
          red: "var(--delos-red)", // Cor de erro/alerta crítico (Rehoboam)
          green: "var(--delos-green)",
          success: "var(--delos-success)",
          indigo: "var(--delos-indigo)",
          
          // ELEMENTOS DE INTERFACE
          container: "var(--delos-container)",
          item: "var(--delos-item)",
          border: "var(--delos-border)", // Transparência branca ou cinza escuro
          
          // TIPOGRAFIA
          texto: "var(--delos-texto)",
          grey: "var(--delos-grey)",
          "grey-light": "var(--delos-grey-light)",
          "grey-dark": "var(--delos-grey-dark)",
          subtext: "var(--delos-subtext)",
          muted: "var(--delos-muted)",
        },
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
        'spin-slow': 'spin 6s linear infinite', // Adicionado para os anéis de scanner
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.05)' },
        },
        'float-custom': {
          '0%': { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.5' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-10vh) translateX(20px)', opacity: '0' },
        },
        'scan-custom': {
          '0%': { top: '-10%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { top: '110%', opacity: '0' },
        }
      },
      fontFamily: {
        // Fontes limpas e técnicas para o Delos OS
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "monospace",
        ],
      },
      letterSpacing: {
        'delos-widest': '0.4em',
        'delos-tight': '-0.05em',
      }
    },
  },

  plugins: [
    // Plugins úteis podem ser adicionados aqui (ex: tailwind-scrollbar)
  ],
};

export default config;
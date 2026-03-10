import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        delos: {
          // As variáveis abaixo serão definidas no seu globals.css
          black: 'var(--delos-black)',    // Texto principal / Fundo inverso
          surface: 'var(--delos-surface)', // Fundo principal da página
          amber: 'var(--delos-amber)',    // Estruturas e realces
          red: 'var(--delos-red)',        // Alertas
          grey: 'var(--delos-grey)',      // Descrições e detalhes
          indigo: 'var(--delos-indigo)',  // Destaques especiais
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
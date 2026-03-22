import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.50", "localhost:3000"],

  // --- DISPOSITIVOS DE SEGURANÇA (HEADERS) ---
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // Liberamos apenas o que você está usando: Google Analytics e Clarity
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms;"
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Impede que seu site seja colocado em iframes (Anti-Clickjacking)
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Impede que o navegador tente adivinhar o tipo de arquivo
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://192.168.1.50/api/v1/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.50',
      },
    ],
  },
};

export default withPWA(nextConfig);
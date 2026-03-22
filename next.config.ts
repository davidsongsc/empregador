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

const nextConfig = { // Remova o tipo ': NextConfig' aqui temporariamente para testar
  allowedDevOrigins: ["192.168.1.50", "localhost:3000"],

  // 1. SOLUÇÃO PARA O ERRO DE BUILD
  // Se o Next.js reclamar que não existe no tipo, usamos o objeto vazio
  // para sinalizar que aceitamos o conflito Webpack/Turbopack
  experimental: {
    // @ts-ignore - Ignora o erro de tipagem no build
    turbopack: {}, 
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
} as any; // Cast para any resolve o problema do 'known properties'

export default withPWA(nextConfig as NextConfig);
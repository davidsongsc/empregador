import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.50", "localhost:3000"],

  async rewrites() {
    return [
      {
        // Redirecionamento para o seu backend FastAPI
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

export default nextConfig;
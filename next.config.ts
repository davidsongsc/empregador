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
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Quando o Next.js vir uma chamada para /api/v1/..., 
        // ele vai redirecionar "por baixo dos panos" para o seu FastAPI
        source: "/api/v1/:path*",
        destination: "http://192.168.1.50/api/v1/:path*",
      },
    ];
  },
  // Opcional: Se você for usar imagens de perfis vindas do seu backend, 
  // adicione o IP aqui para o componente <Image /> do Next funcionar
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
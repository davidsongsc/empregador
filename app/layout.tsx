import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from 'next/script';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Notification } from "@/components/Notification";
import CookieBanner from "@/components/CookieBanner";

// Importações para Autenticação SSR
import { AuthInitializer } from "@/components/AuthInitializer";
import { cookies } from "next/headers";
import { checkSession } from "@/services/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empregado - Portal de vagas",
  description: "Encontre as melhores oportunidades de emprego e impulsione sua carreira.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Buscamos o cookie diretamente no Servidor
  const cookieStore = await cookies();
  const token = cookieStore.get("access");

  let user = null;

  // 2. Se houver token, validamos a sessão antes de renderizar o HTML
  if (token) {
    try {
      // Importante: sua função checkSession deve ser capaz de lidar com SSR
      const data = await checkSession();
      user = data?.user || null;
    } catch (error) {
      user = null;
    }
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 3. Injetamos o usuário do servidor no Zustand do cliente imediatamente */}
        <AuthInitializer serverUser={user} />

        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Notification />
          <Footer />
        </AuthProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from 'next/script';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Notification } from "@/components/Notification";
import CookieBanner from "@/components/CookieBanner";

import { AuthInitializer } from "@/components/AuthInitializer";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { UserData } from "@/interfaces/userData";
// Importamos redirect para o lado do servidor
import { redirect } from "next/navigation"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  let serverUser: UserData | null = null;

  if (token) {
    try {
      serverUser = jwtDecode<UserData>(token);
    } catch (e) {
      serverUser = null;
    }
  }

  // --- LÓGICA DE PROTEÇÃO SSR ---
  // Como o RootLayout envolve TODO o app, precisamos ser cuidadosos.
  // O ideal é que o Middleware cuide das rotas, mas se quiser reforçar aqui:
  
  const userRole = serverUser?.profile?.role || "GUEST";

  // Exemplo: Se o cara cair no RootLayout sem perfil e não for uma página pública
  // Nota: Geralmente fazemos isso em layouts específicos (ex: dashboard/layout.tsx)
  // para não quebrar a Home ou o Login.

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
        <AuthInitializer serverUser={serverUser} />

        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {/* Se você quiser aplicar a lógica de "não renderizar" aqui:
               Poderíamos filtrar o {children}, mas o ideal é que páginas 
               específicas tenham seus próprios layouts de proteção.
            */}
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
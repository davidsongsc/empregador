import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from 'next/script';
import "./globals.css";
import Header from "@/components/Header";
import { Notification } from "@/components/Notification";
import CookieBanner from "@/components/CookieBanner";
import { AuthInitializer } from "@/components/AuthInitializer";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { UserData } from "@/interfaces/userData";
import { ThemeProvider } from "@/components/Theme/Provider";
import { CompanySwitcher } from "@/components/Company/Switcher";

// 1. IMPORTAÇÃO DO HELPER DE SEO
import { constructMetadata } from "@/lib/metadata";

// Configuração de Fontes
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
})
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// 2. APLICAÇÃO DOS METADADOS GLOBAIS (Lado do Servidor)
// Isso substitui o objeto Metadata estático por um gerado pelo seu JSON
export const metadata = constructMetadata();

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

  return (
    <html lang="pt-BR" className={montserrat.className} suppressHydrationWarning>
      <head>
        {/* Scripts de terceiros como AdSense continuam aqui */}
        <Script 
          id="adsbygoogle-init" 
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthInitializer serverUser={serverUser} />

          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
              <CompanySwitcher />
            </main>
            <Notification />
          </AuthProvider>
          
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
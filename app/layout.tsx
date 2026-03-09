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
import { CompanySwitcher } from "@/components/Company/Switcher";
import { Montserrat } from 'next/font/google'

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
})
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// RootLayout (Server Component)
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
        <Script id="adsbygoogle-init" strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Inicializa o Zustand com os dados do servidor */}
        <AuthInitializer serverUser={serverUser} />

        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}

            {/* O switcher agora é um Client Component isolado */}
            <CompanySwitcher />
          </main>
          <Notification />
    
        </AuthProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
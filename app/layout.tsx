import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext";
import Script from 'next/script';
import "./globals.css"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Empregado - Portal de vagas",
  description: "Encontre as melhores oportunidades de emprego e impulsione sua carreira com nosso portal de vagas. Cadastre-se, explore ofertas e conquiste seu próximo desafio profissional.",
}
// incluso para evitar erros de CORS em rotas públicas, já que o frontend e backend estão em portas diferentes durante o desenvolvimento.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <AuthProvider>{children}</AuthProvider>

      </body>
    </html>
  )
}

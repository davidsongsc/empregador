import type { Metadata, Viewport } from "next";
import siteConfig from "@/config/site.json"

export const viewport: Viewport = {
  themeColor: "#FFB800", // Sua cor Delos Amber
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: "FreelaCerto Team" }],
    creator: "Delos System",

    // --- CONFIGURAÇÃO PWA CRÍTICA ---
    manifest: "/manifest.json", // O arquivo que criaremos na public
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: title,
    },
    formatDetection: {
      telephone: false, // Evita que o Safari mude a cor de números de telefone
    },
    // --------------------------------

    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteConfig.url,
      title,
      description,
      siteName: title,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@freelacerto",
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
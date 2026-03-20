import { Metadata } from "next"
import siteConfig from "@/config/site.json"

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`
    },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: "Sua Empresa ou Nome" }],
    creator: "Delos System",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteConfig.url,
      title,
      description,
      siteName: title,
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@freelacerto"
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png"
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
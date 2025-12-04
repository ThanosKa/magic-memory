import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ConditionalClerkProvider } from "@/components/providers/clerk-provider"
import { WebVitalsTracker } from "@/components/web-vitals-tracker"
import { CookieConsent } from "@/components/cookie-consent"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Added font-display: swap for performance
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://restorephotos.app"),
  title: {
    default: "RestorePhotos - Restore Your Old Photos with AI",
    template: "%s | RestorePhotos",
  },
  description:
    "Bring your memories back to life with AI-powered photo restoration. Get 1 free restoration daily or buy credits for unlimited restorations. Powered by GFPGAN.",
  keywords: [
    "photo restoration",
    "AI photo repair",
    "old photo restore",
    "GFPGAN",
    "image enhancement",
    "face restoration",
    "vintage photo repair",
    "photo enhancement",
    "restore old photos",
    "AI image restoration",
  ],
  authors: [{ name: "RestorePhotos Team" }],
  creator: "RestorePhotos",
  publisher: "RestorePhotos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://restorephotos.app",
    siteName: "RestorePhotos",
    title: "RestorePhotos - Restore Your Old Photos with AI",
    description: "Bring your memories back to life with AI-powered photo restoration. Get 1 free restoration daily.",
    images: [
      {
        url: "/og-image-magic-memory.png",
        width: 1200,
        height: 630,
        alt: "RestorePhotos - AI Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RestorePhotos - Restore Your Old Photos with AI",
    description: "Bring your memories back to life with AI-powered photo restoration. Get 1 free restoration daily.",
    images: ["/og-image-magic-memory.png"],
    creator: "@restorephotos",
  },
  alternates: {
    canonical: "https://restorephotos.app",
  },
  category: "Technology",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConditionalClerkProvider>
      <html lang="en" className={inter.variable}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "RestorePhotos",
                description: "AI-powered photo restoration service that brings your old memories back to life.",
                url: "https://restorephotos.app",
                applicationCategory: "PhotographyApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "1 free restoration per day",
                },
                featureList: [
                  "AI-powered face restoration",
                  "GFPGAN model",
                  "Free daily restoration",
                  "Credit packages available",
                  "Instant results",
                ],
              }),
            }}
          />
        </head>
        <body className={`${inter.className} antialiased`}>
          <WebVitalsTracker />
          {children}
          <CookieConsent />
          <Analytics />
        </body>
      </html>
    </ConditionalClerkProvider>
  )
}

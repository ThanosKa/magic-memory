import type React from "react";
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { AnalyticsProvider } from "@/app/analytics-provider";

const ConditionalClerkProvider = dynamic(
  () =>
    import("@/components/providers/clerk-provider").then(
      (m) => m.ConditionalClerkProvider
    ),
  {
    ssr: true,
    loading: () => <LoadingSpinner className="mx-auto my-6" />,
  }
);

const WebVitalsTracker = dynamic(
  () =>
    import("@/components/web-vitals-tracker").then((m) => m.WebVitalsTracker),
  {
    ssr: true,
    loading: () => <LoadingSpinner className="mx-auto my-4" />,
  }
);

const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((m) => m.CookieConsent),
  {
    ssr: true,
    loading: () => <LoadingSpinner className="mx-auto my-4" />,
  }
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Added font-display: swap for performance
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const BRAND = "Magic Memory";
const OG_IMAGE = "/og-image-restore.png";
const TITLE_DEFAULT = `${BRAND} — AI Photo Restoration`;
const DESCRIPTION =
  "Magic Memory uses GFPGAN to restore and enhance your photos with safe-by-default uploads, no persistent image storage, and transparent credits.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE_DEFAULT,
    template: `%s | ${BRAND}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Magic Memory",
    "AI photo restoration",
    "AI photo enhancer",
    "GFPGAN",
    "restore old photos",
    "old photo restore",
    "old photo enhancer",
    "vintage photo repair",
    "photo enhancement",
    "image enhancement",
    "deblur photos",
    "face restoration",
    "portrait enhancer",
    "family photo restoration",
    "image upscaling",
    "HD upscaling",
    "before after photo",
    "before after slider",
    "secure photo restoration",
    "no photo storage",
    "NSFW safe upload",
    "credit based photo restore",
  ],
  authors: [{ name: `${BRAND} Team` }],
  creator: BRAND,
  publisher: BRAND,
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
    url: APP_URL,
    siteName: BRAND,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE_DEFAULT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@TODO_set_twitter_handle",
  },
  alternates: {
    canonical: APP_URL,
  },
  category: "Technology",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
                name: BRAND,
                description: DESCRIPTION,
                url: APP_URL,
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
          <AnalyticsProvider />
        </body>
      </html>
    </ConditionalClerkProvider>
  );
}

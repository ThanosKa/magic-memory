import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import {
  getCanonicalUrl,
  getOgImageUrl,
  offerCatalogJsonLd,
} from "@/lib/seo/metadata-helpers";
import { LoadingSpinner } from "@/components/ui/loading-states";

const Header = dynamic(
  () => import("@/components/header").then((m) => m.Header),
  {
    ssr: true,
  }
);

const Footer = dynamic(
  () => import("@/components/footer").then((m) => m.Footer),
  {
    ssr: true,
  }
);

const PricingCards = dynamic(
  () =>
    import("@/components/pricing/pricing-cards").then((m) => m.PricingCards),
  {
    ssr: true,
  }
);

const PRICING_OFFERS = [
  {
    name: "Free Daily",
    description: "1 free restoration every day",
    price: 0,
    credits: 1,
  },
  {
    name: "Starter Plan",
    description: "30 restoration credits that never expire",
    price: 9.99,
    credits: 30,
  },
  {
    name: "Growth Plan",
    description: "120 restoration credits that never expire",
    price: 19.99,
    credits: 120,
  },
  {
    name: "Premium Plan",
    description: "350 restoration credits that never expire",
    price: 29.99,
    credits: 350,
  },
];

export const metadata: Metadata = {
  title: "Pricing - Get Credits for Photo Restoration",
  description:
    "Choose the perfect plan for your photo restoration needs. Get 1 free restoration daily or purchase credits that never expire. Starter from €9.99, Premium package available.",
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  openGraph: {
    title: "Pricing — AI Photo Restoration Credits | Magic Memory",
    description:
      "Get 1 free AI photo restoration daily or purchase credits that never expire. Starter from \u20ac9.99. Powered by GFPGAN — instant results in under 15 seconds.",
    url: getCanonicalUrl("/pricing"),
    type: "website",
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Magic Memory Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — AI Photo Restoration Credits | Magic Memory",
    description:
      "Get 1 free AI photo restoration daily or purchase credits that never expire. Starter from \u20ac9.99. Powered by GFPGAN — instant results in under 15 seconds.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PricingPage() {
  const { userId } = await auth();

  const jsonLd = offerCatalogJsonLd(PRICING_OFFERS);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<PricingPageFallback />}>
        <Header />
        <main className="flex-1 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                AI Photo Restoration Pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that works best for you. Credits never expire.
              </p>
            </div>
            <PricingCards isSignedIn={!!userId} />
          </div>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

function PricingPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

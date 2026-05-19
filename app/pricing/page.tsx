import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  getCanonicalUrl,
  getOgImageUrl,
  offerCatalogJsonLd,
  faqPageJsonLd,
} from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";
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

const pricingFaqs: FAQItem[] = [
  {
    question: "Is Magic Memory a subscription?",
    answer:
      "No. Magic Memory uses one-time credit packages — not a subscription. You pay once, use the credits whenever you want, and they never expire. Competitors like Remini charge $9.99 per week; you can buy 30 Magic Memory credits for €9.99 and keep them forever.",
  },
  {
    question: "Do my credits ever expire?",
    answer:
      "Paid credits never expire. Once you buy a Starter, Growth, or Premium pack, those restorations stay in your account until you use them — no monthly deadline, no forced renewal. Free daily credits reset at midnight UTC and don't roll over.",
  },
  {
    question: "Which plan is right for me?",
    answer:
      "If you only need to restore a few photos, start with the free daily tier — 1 restoration per day, no card required. If you have a batch of 10-30 family photos to get through, Starter (30 credits for €9.99) is the cheapest per-photo option for small projects. Growth (120 credits for €19.99, €0.17 per restoration) covers a full album. Premium (350 credits for €29.99, €0.09 per restoration) is best for photographers, genealogists, or anyone digitizing decades of prints.",
  },
  {
    question: "How much does each restoration cost?",
    answer:
      "The per-restoration cost drops as you buy larger packs. Starter: €0.33/photo. Growth: €0.17/photo. Premium: €0.09/photo. Compared to manual professional restoration ($25-$150 per photo) or Remini's $9.99/week subscription, even our smallest pack is significantly cheaper for most users.",
  },
  {
    question: "Why is pricing in Euros instead of USD?",
    answer:
      "Magic Memory is based in the EU, so we price in Euros for transparency and tax purposes. Your bank will convert to your local currency at the time of purchase — for most users, the displayed EUR price is close to the USD equivalent (€9.99 ≈ $10.80).",
  },
  {
    question: "Can I get a refund on unused credits?",
    answer:
      "No. All sales are final and we do not issue refunds under any circumstances, whether credits are used or unused. Purchased credits never expire, so you can use them whenever you're ready. If a restoration fails on our end, the credit is not deducted from your balance.",
  },
  {
    question: "What if a restoration doesn't look good?",
    answer:
      "We don't deduct credits for failed restorations. If the result doesn't meet your expectations, you can try again on the same photo, try a different scan or version of the photo, or contact support. AI face restoration works best on portraits with clearly visible faces — heavily damaged or non-face photos may be limited.",
  },
  {
    question: "Can I share credits with family members?",
    answer:
      "Credits are tied to the account that purchased them, but there's no limit on how many photos from different sources you can restore. A single Growth pack (120 credits) is enough for a whole family's photo archive. If you need separate accounts for privacy reasons, each account starts with its own free daily credit.",
  },
  {
    question: "How does Magic Memory compare to Remini or MyHeritage on price?",
    answer:
      "Remini costs $9.99/week ($519/year if used continuously). MyHeritage bundles photo tools into a $119-$259/year genealogy subscription. Magic Memory's Premium pack is €29.99 for 350 never-expiring credits — roughly the same as 3 weeks of Remini, but with no recurring charge. See our full comparison against Remini, MyHeritage, and VanceAI on the alternatives page.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. Payments are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security. We never see or store your card details. Your photos are processed on secure servers and are not stored after your session ends.",
  },
];

export const metadata: Metadata = {
  title: "AI Photo Restoration Pricing — From Free to €29.99 (No Subscription)",
  description:
    "Pay once, restore forever. Credits never expire — €9.99 for 30 restorations, down to €0.09/photo. Or 1 free per day, no card required. No subscription.",
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  openGraph: {
    title: "AI Photo Restoration Pricing — From Free to €29.99 (No Subscription)",
    description:
      "Pay once, restore forever. Credits never expire \u2014 \u20ac9.99 for 30 restorations. Or 1 free per day, no card required. No subscription, no monthly fees.",
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
    title: "AI Photo Restoration Pricing — From Free to €29.99 (No Subscription)",
    description:
      "Pay once, restore forever. Credits never expire \u2014 \u20ac9.99 for 30 restorations. Or 1 free per day, no card required. No subscription, no monthly fees.",
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
  const faqJsonLd = faqPageJsonLd(pricingFaqs);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Magic Memory AI Photo Restoration Credits",
    description:
      "One-time credit packs for AI photo restoration using GFPGAN. Credits never expire. Three pack sizes from €9.99 (€0.33/photo) to €29.99 (€0.09/photo). Free 1/day tier available with no credit card.",
    image: [getOgImageUrl()],
    brand: { "@type": "Brand", name: "Magic Memory" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "0",
      highPrice: "29.99",
      offerCount: PRICING_OFFERS.length,
      offers: PRICING_OFFERS.map((offer) => ({
        "@type": "Offer",
        name: offer.name,
        description: offer.description,
        price: offer.price.toString(),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: getCanonicalUrl("/pricing"),
        priceValidUntil: "2026-12-31",
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "126",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Photo Restoration",
    serviceType: "AI Photo Restoration",
    provider: {
      "@type": "Organization",
      name: "Magic Memory",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.dev",
    },
    areaServed: "Worldwide",
    description:
      "AI-powered photo restoration using the GFPGAN face restoration model. Restores old, blurry, faded, and damaged portrait photos in 5–15 seconds.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "1 free restoration per day, no credit card required.",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                One-time credits that never expire. No subscription. Start free.
              </p>
            </div>
            <PricingCards isSignedIn={!!userId} />

            <section className="mx-auto mt-24 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
                Not a subscription
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Most AI photo tools charge you every month — even when you&apos;re not using them. Magic Memory is different.
              </p>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">Buy once, use anytime</h3>
                  <p className="text-sm text-muted-foreground">
                    Credits stay in your account until you use them. No monthly reset, no forced renewal.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">As low as €0.09 per photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Larger packs mean cheaper per-restoration cost. Premium works out to €0.09 per photo — a fraction of professional retouching.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">Free daily, no card</h3>
                  <p className="text-sm text-muted-foreground">
                    1 restoration every day, free — no credit card required. Good for trying Magic Memory on a real photo before you buy.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-24 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
                Which plan is right for you?
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Pick based on how many photos you plan to restore — not how often.
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">Just trying it out? → Free daily</h3>
                  <p className="text-sm text-muted-foreground">
                    1 photo per day, no card required. Enough to restore a single important photo or test results before committing.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">A small batch of family photos? → Starter (€9.99)</h3>
                  <p className="text-sm text-muted-foreground">
                    30 credits. Good for a single shoebox of old prints or your immediate family&apos;s portraits.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">A full photo album? → Growth (€19.99)</h3>
                  <p className="text-sm text-muted-foreground">
                    120 credits at €0.17 each. Covers an entire wedding album, a decade of school photos, or a multi-generation family archive.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">A photographer or genealogist? → Premium (€29.99)</h3>
                  <p className="text-sm text-muted-foreground">
                    350 credits at €0.09 each — the cheapest per-photo rate. Best for anyone digitizing a long family archive or running client projects.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-24 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
                Pricing FAQ
              </h2>
              <div className="space-y-6">
                {pricingFaqs.map((faq, i) => (
                  <div key={i} className="border-b border-border pb-6 last:border-0">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-24 max-w-4xl text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Compared to other tools
              </h2>
              <p className="text-muted-foreground mb-8">
                See how Magic Memory pricing stacks up against the alternatives before you buy.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/vs/remini" className="text-primary hover:underline">
                  vs Remini
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/vs/myheritage" className="text-primary hover:underline">
                  vs MyHeritage
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/vs/vanceai" className="text-primary hover:underline">
                  vs VanceAI
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/alternatives" className="text-primary hover:underline">
                  Full alternatives comparison
                </Link>
              </div>
            </section>
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

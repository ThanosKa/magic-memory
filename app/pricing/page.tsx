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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageContainer } from "@/components/layout/page-container";
import { StackedSection } from "@/components/layout/stacked-section";
import { Reveal } from "@/components/layout/reveal";
import { SectionLabel } from "@/components/layout/section-label";

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

const NOT_SUBSCRIPTION = [
  {
    title: "Buy once, use anytime",
    body: "Credits stay in your account until you use them. No monthly reset, no forced renewal.",
  },
  {
    title: "As low as €0.09 per photo",
    body: "Larger packs mean cheaper per-restoration cost. Premium works out to €0.09 per photo — a fraction of professional retouching.",
  },
  {
    title: "Free daily, no card",
    body: "1 restoration every day, free — no credit card required. Good for trying Magic Memory on a real photo before you buy.",
  },
];

const WHICH_PLAN = [
  {
    title: "Just trying it out? → Free daily",
    body: "1 photo per day, no card required. Enough to restore a single important photo or test results before committing.",
  },
  {
    title: "A small batch of family photos? → Starter (€9.99)",
    body: "30 credits. Good for a single shoebox of old prints or your immediate family's portraits.",
  },
  {
    title: "A full photo album? → Growth (€19.99)",
    body: "120 credits at €0.17 each. Covers an entire wedding album, a decade of school photos, or a multi-generation family archive.",
  },
  {
    title: "A photographer or genealogist? → Premium (€29.99)",
    body: "350 credits at €0.09 each — the cheapest per-photo rate. Best for anyone digitizing a long family archive or running client projects.",
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
        <main className="flex-1">
          <section>
            <PageContainer className="pb-24 pt-32 text-center md:pb-32 md:pt-44">
              <Reveal>
                <h1 className="font-serif text-[clamp(2.75rem,5.6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-paper">
                  AI Photo Restoration Pricing
                </h1>
                <p className="mx-auto mt-6 max-w-[36rem] text-[17px] leading-[1.6] text-paper/65">
                  One-time credits that never expire. No subscription. Start free.
                </p>
              </Reveal>
            </PageContainer>
          </section>

          <StackedSection tone="paper">
            <PricingCards isSignedIn={!!userId} />
          </StackedSection>

          <StackedSection className="space-y-24 md:space-y-32">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <h2 className="font-serif text-center text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em] text-paper">
                  Not a subscription
                </h2>
                <p className="mx-auto mb-12 mt-5 max-w-[40rem] text-center text-[17px] leading-[1.6] text-paper/65">
                  Most AI photo tools charge you every month — even when you&apos;re not using them. Magic Memory is different.
                </p>
              </Reveal>
              <ul className="grid gap-4 sm:grid-cols-3">
                {NOT_SUBSCRIPTION.map((item, i) => (
                  <Reveal as="li" key={item.title} delay={i * 0.08} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-serif mb-3 text-[22px] leading-[1.15] text-paper">{item.title}</h3>
                    <p className="text-[15px] leading-[1.6] text-paper/65">{item.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div className="mx-auto max-w-4xl">
              <Reveal>
                <h2 className="font-serif text-center text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em] text-paper">
                  Which plan is right for you?
                </h2>
                <p className="mx-auto mb-12 mt-5 max-w-[40rem] text-center text-[17px] leading-[1.6] text-paper/65">
                  Pick based on how many photos you plan to restore — not how often.
                </p>
              </Reveal>
              <ul className="space-y-4">
                {WHICH_PLAN.map((item, i) => (
                  <Reveal as="li" key={item.title} delay={i * 0.06} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-serif mb-2 text-[22px] leading-[1.15] text-paper">{item.title}</h3>
                    <p className="text-[15px] leading-[1.6] text-paper/65">{item.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </StackedSection>

          <StackedSection tone="paper" className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <SectionLabel index="01" tone="paper">Questions</SectionLabel>
              <h2 className="font-serif mt-6 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] tracking-[-0.02em]">
                Pricing FAQ
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <Accordion type="single" collapsible className="w-full border-t border-ink/12">
                {pricingFaqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </StackedSection>

          <StackedSection className="text-center">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-paper">
                Compared to other tools
              </h2>
              <p className="mx-auto mb-8 mt-4 max-w-[36rem] text-[17px] leading-[1.6] text-paper/65">
                See how Magic Memory pricing stacks up against the alternatives before you buy.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[15px]">
                <Link href="/vs/remini" className="mm-underline text-paper/80 hover:text-paper">
                  vs Remini
                </Link>
                <span className="text-paper/60" aria-hidden="true">·</span>
                <Link href="/vs/myheritage" className="mm-underline text-paper/80 hover:text-paper">
                  vs MyHeritage
                </Link>
                <span className="text-paper/60" aria-hidden="true">·</span>
                <Link href="/vs/vanceai" className="mm-underline text-paper/80 hover:text-paper">
                  vs VanceAI
                </Link>
                <span className="text-paper/60" aria-hidden="true">·</span>
                <Link href="/alternatives" className="mm-underline text-paper/80 hover:text-paper">
                  Full alternatives comparison
                </Link>
              </div>
            </Reveal>
          </StackedSection>
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

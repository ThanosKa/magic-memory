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
import { SectionColumns } from "@/components/layout/section-columns";
import { StackedSection } from "@/components/layout/stacked-section";
import { SectionLabel } from "@/components/layout/section-label";
import { CREDIT_PACKAGES, perPhotoPrice } from "@/lib/constants";

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

const { starter, growth, premium } = CREDIT_PACKAGES;

const PRICING_OFFERS = [
  ...Object.values(CREDIT_PACKAGES).map((pkg) => ({
    name: `${pkg.name} Plan`,
    description: `${pkg.credits} restoration credits that never expire`,
    price: pkg.price / 100,
    credits: pkg.credits,
  })),
];

const pricingFaqs: FAQItem[] = [
  {
    question: "Is Magic Memory a subscription?",
    answer:
      `No. Magic Memory uses one-time credit packages — not a subscription. You pay once, use the credits whenever you want, and they never expire. Competitors like Remini charge $9.99 per week; you can buy ${starter.credits} Magic Memory credits for ${starter.priceDisplay} and keep them forever.`,
  },
  {
    question: "Do my credits ever expire?",
    answer:
      "Paid credits never expire. Once you buy a Starter, Growth, or Premium pack, those restorations stay in your account until you use them — no monthly deadline, no forced renewal.",
  },
  {
    question: "Which plan is right for me?",
    answer:
      `If you have a few photos or a batch of up to ${starter.credits} family photos to get through, Starter (${starter.credits} credits for ${starter.priceDisplay}) is the cheapest per-photo option for small projects. Growth (${growth.credits} credits for ${growth.priceDisplay}, ${perPhotoPrice(growth)} per restoration) covers a full album. Premium (${premium.credits} credits for ${premium.priceDisplay}, ${perPhotoPrice(premium)} per restoration) is best for photographers, genealogists, or anyone digitizing decades of prints.`,
  },
  {
    question: "How much does each restoration cost?",
    answer:
      `The per-restoration cost drops as you buy larger packs. Starter: ${perPhotoPrice(starter)}/photo. Growth: ${perPhotoPrice(growth)}/photo. Premium: ${perPhotoPrice(premium)}/photo. Compared to manual professional restoration ($25-$150 per photo) or Remini's $9.99/week subscription, even our smallest pack is significantly cheaper for most users.`,
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
      `Credits are tied to the account that purchased them, but there's no limit on how many photos from different sources you can restore. A single Growth pack (${growth.credits} credits) is enough for a whole family's photo archive.`,
  },
  {
    question: "How does Magic Memory compare to Remini or MyHeritage on price?",
    answer:
      `Remini costs $9.99/week ($519/year if used continuously). MyHeritage bundles photo tools into a $119-$259/year genealogy subscription. Magic Memory's Premium pack is ${premium.priceDisplay} for ${premium.credits} never-expiring credits — roughly the same as 3 weeks of Remini, but with no recurring charge. See our full comparison against Remini, MyHeritage, and VanceAI on the alternatives page.`,
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
    title: `As low as ${perPhotoPrice(premium)} per photo`,
    body: `Larger packs mean cheaper per-restoration cost. Premium works out to ${perPhotoPrice(premium)} per photo — a fraction of professional retouching.`,
  },
  {
    title: "No charge for failed restorations",
    body: "A credit is deducted only after your restored photo comes back. If a restoration fails, your balance stays the same.",
  },
];

const WHICH_PLAN = [
  {
    title: "A small batch of family photos? → Starter (€9.99)",
    body: `${starter.credits} credits. Good for a single shoebox of old prints or your immediate family's portraits.`,
  },
  {
    title: "A full photo album? → Growth (€19.99)",
    body: `${growth.credits} credits at ${perPhotoPrice(growth)} each. Covers an entire wedding album, a decade of school photos, or a multi-generation family archive.`,
  },
  {
    title: "A photographer or genealogist? → Premium (€29.99)",
    body: `${premium.credits} credits at ${perPhotoPrice(premium)} each — the cheapest per-photo rate. Best for anyone digitizing a long family archive or running client projects.`,
  },
];

export const metadata: Metadata = {
  title: "AI Photo Restoration Pricing: €9.99–€29.99, No Subscription",
  description:
    `Pay once, restore forever. Credits never expire — ${starter.priceDisplay} for ${starter.credits} restorations, down to ${perPhotoPrice(premium)}/photo. No subscription.`,
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  openGraph: {
    title: "AI Photo Restoration Pricing: €9.99–€29.99, No Subscription",
    description:
      `Pay once, restore forever. Credits never expire \u2014 ${starter.priceDisplay} for ${starter.credits} restorations. No subscription, no monthly fees.`,
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
    title: "AI Photo Restoration Pricing: €9.99–€29.99, No Subscription",
    description:
      `Pay once, restore forever. Credits never expire \u2014 ${starter.priceDisplay} for ${starter.credits} restorations. No subscription, no monthly fees.`,
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
      `One-time credit packs for AI photo restoration using GFPGAN. Credits never expire. Three pack sizes from ${starter.priceDisplay} (${perPhotoPrice(starter)}/photo) to ${premium.priceDisplay} (${perPhotoPrice(premium)}/photo).`,
    image: [getOgImageUrl()],
    brand: { "@type": "Brand", name: "Magic Memory" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: (starter.price / 100).toFixed(2),
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
      price: (starter.price / 100).toFixed(2),
      priceCurrency: "EUR",
      description: `${starter.credits} restoration credits for ${starter.priceDisplay}, paid once. Credits never expire.`,
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
              <div>
                <h1 className="font-serif text-[clamp(2.75rem,5.6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-paper">
                  AI Photo Restoration Pricing
                </h1>
                <p className="mx-auto mt-6 max-w-[36rem] text-[17px] leading-[1.6] text-paper/65">
                  One-time credits that never expire. No subscription.
                </p>
              </div>
            </PageContainer>
          </section>

          <StackedSection tone="paper">
            <PricingCards isSignedIn={!!userId} />
          </StackedSection>

          <StackedSection className="space-y-24 md:space-y-32">
            <div className="mx-auto max-w-4xl">
              <div>
                <h2 className="font-serif text-center text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em] text-paper">
                  Not a subscription
                </h2>
                <p className="mx-auto mb-12 mt-5 max-w-[40rem] text-center text-[17px] leading-[1.6] text-paper/65">
                  Most AI photo tools charge you every month — even when you&apos;re not using them. Magic Memory is different.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-3">
                {NOT_SUBSCRIPTION.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-serif mb-3 text-[22px] leading-[1.15] text-paper">{item.title}</h3>
                    <p className="text-[15px] leading-[1.6] text-paper/65">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto max-w-4xl">
              <div>
                <h2 className="font-serif text-center text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em] text-paper">
                  Which plan is right for you?
                </h2>
                <p className="mx-auto mb-12 mt-5 max-w-[40rem] text-center text-[17px] leading-[1.6] text-paper/65">
                  Pick based on how many photos you plan to restore — not how often.
                </p>
              </div>
              <ul className="space-y-4">
                {WHICH_PLAN.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-serif mb-2 text-[22px] leading-[1.15] text-paper">{item.title}</h3>
                    <p className="text-[15px] leading-[1.6] text-paper/65">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </StackedSection>

          <StackedSection tone="paper">
            <SectionColumns
              className="gap-12"
              stickyAside
              aside={
                <>
                  <SectionLabel index="01" tone="paper">Questions</SectionLabel>
                  <h2 className="font-serif mt-6 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] tracking-[-0.02em]">
                    Pricing FAQ
                  </h2>
                </>
              }
            >
              <Accordion type="single" collapsible className="w-full border-t border-ink/12">
                {pricingFaqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionColumns>
          </StackedSection>

          <StackedSection className="text-center">
            <div>
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
            </div>
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

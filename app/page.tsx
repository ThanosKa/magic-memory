import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/home/home-hero";
import { PlainWordsSection } from "@/components/home/plain-words-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { AudienceSection } from "@/components/home/audience-section";
import { PricingPreview } from "@/components/home/pricing-preview";
import { HomeFaq } from "@/components/home/home-faq";
import { FinalCta } from "@/components/home/final-cta";
import { homeMono, homeSerif } from "@/components/home/fonts";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd } from "@/lib/seo/metadata-helpers";
import { homepageFaqs } from "@/lib/seo/faq-data";

export const metadata: Metadata = {
  title: "Free AI Photo Restoration — Restore Old Photos in 15 Seconds",
  description:
    "Restore old, blurry, and damaged photos free with GFPGAN AI. 1 free restoration daily, no credit card. No subscription, no app — just upload and download in under 15 seconds. Cheaper than Remini ($9.99/wk) and MyHeritage ($119/yr). Photos never stored.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: "Free AI Photo Restoration — Restore Old Photos in 15 Seconds | Magic Memory",
    description:
      "Restore old, blurry, and damaged photos free with GFPGAN AI. 1 free restoration daily, no credit card. No subscription, no app — just upload and download. Photos never stored.",
    url: getCanonicalUrl("/"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Magic Memory - AI Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Photo Restoration — Restore Old Photos in 15 Seconds | Magic Memory",
    description:
      "1 free restoration daily, no credit card. Cheaper than Remini and MyHeritage. Photos never stored.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos with AI",
  description: "Restore old, blurry, or damaged photos using Magic Memory's GFPGAN AI in three simple steps.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload Your Photo",
      text: "Upload a JPEG, PNG, or WebP photo up to 10MB.",
    },
    {
      "@type": "HowToStep",
      name: "AI Restores It",
      text: "GFPGAN AI restores faces and enhances photo quality in 5-15 seconds.",
    },
    {
      "@type": "HowToStep",
      name: "Download Your Result",
      text: "Download your restored photo in full resolution.",
    },
  ],
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(homepageFaqs);

  return (
    <div className={`mm-home flex min-h-screen flex-col ${homeSerif.variable} ${homeMono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <HomeHero />
        <PlainWordsSection />
        <HowItWorks />
        <AudienceSection />
        <PricingPreview />
        <HomeFaq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

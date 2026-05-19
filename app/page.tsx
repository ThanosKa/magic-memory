import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd } from "@/lib/seo/metadata-helpers";
import { homepageFaqs } from "@/lib/seo/faq-data";
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

const HeroSection = dynamic(
  () => import("@/components/landing/hero-section").then((m) => m.HeroSection),
  {
    ssr: true,
  }
);

const HowItWorksSection = dynamic(
  () =>
    import("@/components/landing/how-it-works-section").then(
      (m) => m.HowItWorksSection
    ),
  {
    ssr: true,
  }
);

const FeaturesSection = dynamic(
  () =>
    import("@/components/landing/features-section").then(
      (m) => m.FeaturesSection
    ),
  {
    ssr: true,
  }
);

const ExploreSection = dynamic(
  () =>
    import("@/components/landing/explore-section").then(
      (m) => m.ExploreSection
    ),
  {
    ssr: true,
  }
);

const FAQSection = dynamic(
  () => import("@/components/landing/faq-section").then((m) => m.FAQSection),
  {
    ssr: true,
  }
);

const CTASection = dynamic(
  () => import("@/components/landing/cta-section").then((m) => m.CTASection),
  {
    ssr: true,
  }
);

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
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Suspense fallback={<LandingFallback />}>
        <Header />
        <main className="flex-1">
          <HeroSection />
          <HowItWorksSection />
          <FeaturesSection />
          <ExploreSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

function LandingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

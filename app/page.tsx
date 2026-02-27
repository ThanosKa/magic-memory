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

const SocialProof = dynamic(
  () => import("@/components/landing/social-proof").then((m) => m.SocialProof),
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

const TestimonialsSection = dynamic(
  () =>
    import("@/components/landing/testimonials-section").then(
      (m) => m.TestimonialsSection
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
  title: "AI Photo Restoration — Restore Old Photos Free",
  description:
    "Magic Memory uses GFPGAN AI to restore old, blurry, and damaged photos in under 15 seconds. Get 1 free restoration daily — no card required. Upload a photo and see instant before-and-after results. No images stored on our servers.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: "AI Photo Restoration — Restore Old Photos Free | Magic Memory",
    description:
      "Magic Memory uses GFPGAN AI to restore old, blurry, and damaged photos in under 15 seconds. Get 1 free restoration daily — no card required. Upload a photo and see instant before-and-after results.",
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
    title: "AI Photo Restoration — Restore Old Photos Free | Magic Memory",
    description:
      "Magic Memory uses GFPGAN AI to restore old, blurry, and damaged photos in under 15 seconds. Get 1 free restoration daily — no card required.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import {
  organizationJsonLd,
  webApplicationJsonLd,
} from "@/lib/seo/metadata-helpers";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos with AI",
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
  const orgJsonLd = organizationJsonLd();
  const appJsonLd = webApplicationJsonLd();
  const faqJsonLd = faqPageJsonLd(homepageFaqs);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
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
          <SocialProof />
          <HowItWorksSection />
          <FeaturesSection />
          <TestimonialsSection />
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

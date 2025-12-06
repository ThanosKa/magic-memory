import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers";
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

const HowItWorksSection = dynamic(
  () =>
    import("@/components/landing/how-it-works-section").then(
      (m) => m.HowItWorksSection
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
  title: "RestorePhotos - AI Photo Restoration",
  description: "Restore your old photos with AI. 100% free and open source.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: "RestorePhotos - AI Photo Restoration",
    description: "Restore your old photos with AI. 100% free and open source.",
    url: getCanonicalUrl("/"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "RestorePhotos - AI Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RestorePhotos - AI Photo Restoration",
    description: "Restore your old photos with AI. 100% free and open source.",
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

export default function Page() {
  const orgJsonLd = organizationJsonLd();
  const appJsonLd = webApplicationJsonLd();

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
      <Suspense fallback={<LandingFallback />}>
        <Header />
        <main className="flex-1">
          <h1 className="sr-only">RestorePhotos - AI Photo Restoration</h1>
          <HeroSection />
          <SocialProof />
          <FeaturesSection />
          <TestimonialsSection />
          <HowItWorksSection />
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

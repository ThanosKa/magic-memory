import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { SocialProof } from "@/components/landing/social-proof"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Metadata } from "next"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"

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
}

import { organizationJsonLd, webApplicationJsonLd } from "@/lib/seo/metadata-helpers"

export default function Page() {
  const orgJsonLd = organizationJsonLd()
  const appJsonLd = webApplicationJsonLd()

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
    </div>
  )
}

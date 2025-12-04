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

export const metadata: Metadata = {
  title: "RestorePhotos - AI Photo Restoration",
  description: "Restore your old photos with AI. 100% free and open source.",
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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

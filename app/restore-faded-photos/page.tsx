import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { UseCaseHero } from "@/components/use-case/use-case-hero";
import { UseCaseHowItWorks } from "@/components/use-case/use-case-how-it-works";
import { UseCaseFAQ } from "@/components/use-case/use-case-faq";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "Restore Faded Photos — Bring Color and Contrast Back | Magic Memory",
  description:
    "Fix faded photos with AI. GFPGAN restores facial detail and contrast lost to UV exposure, time, and poor storage. Free daily restoration, no credit card required.",
  alternates: { canonical: getCanonicalUrl("/restore-faded-photos") },
  openGraph: {
    title: "Restore Faded Photos — Bring Color and Contrast Back | Magic Memory",
    description: "Fix faded photos with AI. Restore contrast and facial detail. Free daily.",
    url: getCanonicalUrl("/restore-faded-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Faded Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Faded Photos With AI",
    description: "Fix faded photos. Restore contrast and detail. Free daily restoration.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Why do photos fade over time?",
    answer:
      "Photos fade due to UV light exposure (even through windows), humidity changes, heat fluctuations, and the natural chemical breakdown of dye layers in color photo paper. Dye-based color photos from the 1970s through 1990s are most susceptible — cyan dyes fade faster than magenta and yellow, causing the characteristic orange-red cast common in photos from this era.",
  },
  {
    question: "Can AI bring back faded colors?",
    answer:
      "GFPGAN restores facial detail and contrast in faded photos. For photos with severe color cast (the orange-red shift common in 1980s photos), the AI improves sharpness and facial detail, though full color correction requires additional processing. The most significant improvement is in the recovery of sharp facial features that fading obscured.",
  },
  {
    question: "Does restoration work on faded black and white photos?",
    answer:
      "Yes. Faded black and white photos — which lose contrast and detail over time — respond well to GFPGAN restoration. The AI recovers the tonal contrast and fine facial detail that fading reduced, resulting in a photo that looks closer to how it appeared when originally developed.",
  },
  {
    question: "How do I prevent my restored photos from fading again?",
    answer:
      "After restoration, store digital copies in multiple locations: external hard drive, cloud backup, and a secondary cloud service. For physical prints, use acid-free paper and archival inks, store in archival albums (not magnetic albums), keep away from direct sunlight, and maintain stable temperature and humidity. Photos stored in cool, dark, dry conditions last significantly longer.",
  },
  {
    question: "Is there a difference between fading and yellowing?",
    answer:
      "Yes. Fading is a loss of overall image density — the photo gets lighter and loses contrast. Yellowing is a color shift where the photo paper or binder layer turns yellow or orange, which is most visible in white or light areas of the photo. GFPGAN addresses both, though color correction for yellowing is most effective in facial areas where the AI has the strongest reconstruction capability.",
  },
];

export default function RestoreFadedPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Faded Photos", url: "/restore-faded-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Faded Photos — Bring Color and Contrast Back"
          subheadline="Fading is different from blur — it is the gradual loss of contrast, color depth, and fine detail as photo dyes break down over decades. Magic Memory uses GFPGAN AI to restore the facial detail and clarity that fading steals from your most important photos."
          keyword="restore faded photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">What Fading Does to a Photo</h2>
            <p className="text-muted-foreground mb-4">
              Photo fading is a chemical process. Color photos use layers of cyan, magenta, and yellow dye suspended in gelatin. Over time, UV light, oxygen, and humidity break these dyes down — and they do not break down evenly. Cyan fades fastest, then magenta, then yellow. This differential fading creates the characteristic warm (orange-red) cast seen in photos from the 1970s and 1980s.
            </p>
            <p className="text-muted-foreground mb-4">
              Beyond color cast, fading reduces overall contrast — the darkest darks become lighter grey, the finest detail becomes indistinct. Faces lose the subtle tonal variation that makes them look real and three-dimensional.
            </p>
            <p className="text-muted-foreground">
              GFPGAN restores the facial structure hidden beneath this fading, reconstructing the sharp edges and fine detail that the original photo captured but that time eroded.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Storage Advice for Restored Photos</h2>
            <p className="text-muted-foreground">
              Once restored, protect your digital copy: back up to at least two separate locations (local drive + cloud), use a lossless format (PNG or TIFF) for your archive copy, and make a JPEG copy for sharing. For physical prints from restored photos, use archival-grade photo paper and acid-free frames stored out of direct sunlight.
            </p>
          </div>
        </section>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Related Restorations</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { href: "/restore-damaged-photos", label: "Fix Damaged Photos" },
                { href: "/restore-vintage-photos", label: "Restore Vintage Photos" },
                { href: "/restore-old-photos", label: "Restore Old Photos" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-border bg-card p-6 text-sm font-medium hover:border-primary/50 hover:shadow-md transition-all"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

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
  title: "Fix Damaged Photos With AI — Scratches, Tears, and Fading | Magic Memory",
  description:
    "Restore water-damaged, torn, scratched, or faded photos with AI. GFPGAN recovers facial detail even in severely damaged photos. Free daily restoration.",
  alternates: { canonical: getCanonicalUrl("/restore-damaged-photos") },
  openGraph: {
    title: "Fix Damaged Photos With AI — Magic Memory",
    description: "AI photo restoration for water-damaged, torn, and faded photos. Free daily restoration.",
    url: getCanonicalUrl("/restore-damaged-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Fix Damaged Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix Damaged Photos With AI",
    description: "Restore water-damaged, torn, and scratched photos with AI.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI fix water-damaged photos?",
    answer:
      "AI can significantly improve water-damaged photos where the damage has caused blur, fading, or color loss in facial areas. Faces affected by water staining often see dramatic improvement. However, photos where water damage has physically destroyed the emulsion layer — leaving white patches or complete transparency — cannot be fully restored, as there is no original data for the AI to work with.",
  },
  {
    question: "Does AI fix torn photos?",
    answer:
      "GFPGAN improves the detail and clarity of the undamaged portions of torn photos. For tears that cross facial areas, the AI fills in detail based on surrounding facial structure, with results varying by severity. For complete tears through the center of a face, results are good but not perfect — the AI reconstructs plausible detail rather than exact original detail.",
  },
  {
    question: "What types of photo damage respond best to AI restoration?",
    answer:
      "AI restoration works best on: blur and loss of sharpness, film grain, fading and reduced contrast, mild color cast, and minor surface scratches. It works less effectively on: complete physical destruction of emulsion (holes, missing pieces), severe mold damage covering faces, and damage where the face is entirely obscured.",
  },
  {
    question: "Can AI remove scratches from scanned photos?",
    answer:
      "GFPGAN suppresses some scratch artifacts, particularly in facial areas, as part of its general restoration process. For photos with heavy scratching across the entire frame, a dust-and-scratch removal step before AI restoration (using scanner software or Photoshop) improves results.",
  },
  {
    question: "What is the worst type of photo damage for AI restoration?",
    answer:
      "Complete emulsion destruction is the hardest for AI to address — this includes mold that has eaten through the photo, fire damage that has charred portions of the image, and physical holes. When the original image data no longer exists, even advanced AI cannot accurately reconstruct it. GFPGAN makes educated guesses based on surrounding pixels, but results are interpretive rather than accurate.",
  },
];

export default function RestoreDamagedPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Damaged Photos", url: "/restore-damaged-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Fix Damaged Photos With AI — Scratches, Tears, and Fading"
          subheadline="Water damage, fire, torn prints, mold, and decades of poor storage can destroy irreplaceable photos. Magic Memory uses GFPGAN AI to recover the facial detail that matters most — even in severely damaged photos. Free daily restoration, no credit card required."
          keyword="restore damaged photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">What Damage Types AI Can Address</h2>
            <div className="space-y-4">
              {[
                {
                  type: "Blur and loss of sharpness",
                  outcome: "Excellent — GFPGAN's primary strength",
                },
                {
                  type: "Film grain and noise",
                  outcome: "Excellent — grain is removed while preserving facial detail",
                },
                {
                  type: "Fading and reduced contrast",
                  outcome: "Very good — contrast and detail are recovered",
                },
                {
                  type: "Water staining on faces",
                  outcome: "Good — depends on severity",
                },
                {
                  type: "Surface scratches across faces",
                  outcome: "Moderate — AI fills in detail based on surrounding structure",
                },
                {
                  type: "Torn photos through face",
                  outcome: "Moderate — AI reconstructs plausible detail",
                },
                {
                  type: "Mold or fire destroying emulsion",
                  outcome: "Limited — no original data to recover",
                },
              ].map((item) => (
                <div key={item.type} className="flex justify-between gap-4 border-b border-border pb-3 last:border-0">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-sm text-muted-foreground text-right">{item.outcome}</span>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Honest Limitations</h2>
            <p className="text-muted-foreground">
              GFPGAN focuses on facial restoration — it excels at recovering faces even in damaged photos. For severe physical damage (holes, burnt areas, complete emulsion destruction), the AI cannot recreate what is no longer there. Expectations should be calibrated accordingly: AI restoration is not magic — it is sophisticated reconstruction that works best when there is something to reconstruct from.
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
                { href: "/restore-old-photos", label: "Restore Old Photos" },
                { href: "/restore-faded-photos", label: "Fix Faded Photos" },
                { href: "/fix-blurry-photos", label: "Fix Blurry Photos" },
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

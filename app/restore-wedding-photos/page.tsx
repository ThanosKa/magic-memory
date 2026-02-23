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
  title: "Restore Old Wedding Photos With AI — Magic Memory",
  description:
    "Restore your parents' or grandparents' wedding photos with AI. Perfect for anniversaries, digitizing albums, and preserving formal portraits. Free daily restoration.",
  alternates: { canonical: getCanonicalUrl("/restore-wedding-photos") },
  openGraph: {
    title: "Restore Old Wedding Photos With AI — Magic Memory",
    description: "Restore wedding photos from any era. Perfect anniversary gift. Free daily restoration.",
    url: getCanonicalUrl("/restore-wedding-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Wedding Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Old Wedding Photos With AI",
    description: "Restore wedding photos. Perfect anniversary gift.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI restore formal wedding portrait photos?",
    answer:
      "Yes. Formal wedding portraits — where the couple faces the camera — are ideal for GFPGAN restoration. The model excels at close-up and mid-range portraits where faces are clearly visible. Full-body shots still benefit, though the face restoration is most dramatic in closer crops.",
  },
  {
    question: "My parents' wedding photo is yellowed and creased. Can that be fixed?",
    answer:
      "GFPGAN significantly improves yellowed and faded wedding photos by restoring clarity and sharpness to faces. Physical creases that obscure faces can be partially corrected. For severe physical damage like tears through the center of a face, results vary — the AI fills in detail based on surrounding facial structure.",
  },
  {
    question: "What causes wedding photos from the 1960s-1980s to look faded?",
    answer:
      "Wedding photos from this era were typically printed on color photographic paper that used dye-based processes. Over decades, cyan dyes fade faster than magenta and yellow, causing the characteristic orange or red cast seen in old color photos. GFPGAN restores facial detail and clarity, though full color correction requires additional processing.",
  },
  {
    question: "Is restored wedding photo quality good enough to reprint?",
    answer:
      "Restored photos from Magic Memory can be reprinted at standard photo sizes (4x6, 5x7, 8x10). For very large prints (16x20 and above), the source photo resolution matters — start with the highest resolution scan available. We recommend scanning at 600 DPI or higher for photos you plan to reprint.",
  },
  {
    question: "Can I restore a group wedding photo with many people?",
    answer:
      "Yes, though results vary by photo. GFPGAN processes all faces in the frame, but works best when individual faces are at least 50–100 pixels in the source image. In large group shots where faces are small, the improvement may be less dramatic than in close portraits.",
  },
];

export default function RestoreWeddingPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Wedding Photos", url: "/restore-wedding-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Old Wedding Photos With AI"
          subheadline="Wedding albums fade, yellow, and crease over decades. Magic Memory restores the faces in your parents' or grandparents' wedding photos — making them vivid enough to reprint, frame, and give as anniversary gifts. Free daily restoration, no credit card required."
          keyword="restore wedding photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Why Wedding Photos Degrade Faster</h2>
            <p className="text-muted-foreground mb-4">
              Wedding photos from before the 1990s face a specific challenge: they were stored in albums. Album adhesives contain acids that migrate into photo paper over time. Magnetic albums from the 1970s and 1980s are particularly damaging — the adhesive becomes highly acidic and causes yellowing, staining, and emulsion damage.
            </p>
            <p className="text-muted-foreground mb-4">
              The good news is that GFPGAN focuses on facial restoration — the most emotionally important part of any wedding photo. Even heavily degraded wedding portraits often yield excellent restoration results because the AI reconstructs facial structure from learned priors, not just the damaged source pixels.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Perfect For Anniversary Gifts</h2>
            <p className="text-muted-foreground mb-4">
              A restored wedding photo is one of the most meaningful anniversary gifts possible. For milestone anniversaries (25th, 50th, 60th), restoring and reprinting your parents&apos; wedding photo — or your own — creates a tangible piece of family history.
            </p>
            <p className="text-muted-foreground">
              Magic Memory processes your photo in under 15 seconds. Download, print at your local photo shop, and frame. Total time investment: under an hour, including the scan.
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
                { href: "/restore-family-photos", label: "Restore Family Photos" },
                { href: "/restore-faded-photos", label: "Fix Faded Photos" },
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

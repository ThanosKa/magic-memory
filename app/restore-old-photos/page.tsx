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
  title: "Restore Old Photos Online Free — AI Photo Restoration | Magic Memory",
  description:
    "Restore your old photos online in seconds. Magic Memory uses AI to sharpen faces, remove blur, and fix damage. Free daily restoration, no credit card required.",
  alternates: { canonical: getCanonicalUrl("/restore-old-photos") },
  openGraph: {
    title: "Restore Old Photos Online Free — AI Photo Restoration | Magic Memory",
    description:
      "Restore your old photos online in seconds. Magic Memory uses AI to sharpen faces, remove blur, and fix damage. Free daily restoration, no credit card required.",
    url: getCanonicalUrl("/restore-old-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Old Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Old Photos Online Free",
    description: "Restore your old photos in seconds with AI. Free daily restoration.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can I restore old photos for free?",
    answer:
      "Yes. Magic Memory gives you 1 free restoration every day, no credit card required. Sign in with Google and upload your photo — your first restoration is free. Additional restorations use purchased credits that never expire.",
  },
  {
    question: "What makes old photos blurry?",
    answer:
      "Old photos become blurry due to several factors: film grain from lower-quality film stock, physical degradation of the photo paper over decades, poor scanning quality (low DPI), and digital compression when photos were digitized. GFPGAN addresses blurriness in faces specifically by reconstructing facial detail from high-resolution face priors.",
  },
  {
    question: "Does AI restoration work on black and white photos?",
    answer:
      "Yes. GFPGAN restores and sharpens black and white photos effectively, recovering facial detail and reducing grain. Note that restoration improves sharpness and detail — it does not colorize black and white photos. The restored photo remains black and white but with significantly better clarity.",
  },
  {
    question: "How do I get the best results from old photo restoration?",
    answer:
      "For best results: scan at 600 DPI or higher using a flatbed scanner, ensure faces are clearly visible and not cropped out, upload as JPEG or PNG at the highest resolution available, and avoid heavily compressed files. The AI works best on portrait-oriented photos where faces are the primary subject.",
  },
  {
    question: "What file formats are supported for old photo restoration?",
    answer:
      "Magic Memory supports JPEG, PNG, and WebP formats up to 10MB per file. For scanned photos, save as JPEG at 90%+ quality or PNG for lossless quality. Avoid heavily compressed JPEGs (below 80% quality) as compression artifacts reduce restoration quality.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos Online",
  step: [
    { "@type": "HowToStep", name: "Upload Your Old Photo", text: "Upload a JPEG, PNG, or WebP photo up to 10MB. Scan at 600 DPI or higher for best results." },
    { "@type": "HowToStep", name: "AI Restores Faces and Detail", text: "GFPGAN analyzes and restores facial features in 5-15 seconds." },
    { "@type": "HowToStep", name: "Download in Full Resolution", text: "Download your restored photo and compare before and after." },
  ],
};

export default function RestoreOldPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Old Photos", url: "/restore-old-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Old Photos Online — Free With AI"
          subheadline="Find an old photo box and see blurry grandparent photos that deserve better? Magic Memory uses GFPGAN AI to restore faces, recover lost detail, and bring your most important memories back to life in 5–15 seconds. One free restoration every day, no credit card required."
          keyword="restore old photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Why Old Photos Degrade</h2>
            <p className="text-muted-foreground mb-4">
              Old photos deteriorate for four main reasons: UV exposure breaks down dye layers, humidity causes paper warping and mold, physical handling creates scratches and creases, and early digitization produced low-resolution scans with heavy compression.
            </p>
            <p className="text-muted-foreground mb-4">
              GFPGAN — developed by researchers at Tencent ARC and published at CVPR 2021 — addresses these issues in portraits specifically. It was trained on millions of high-resolution face images, giving it the ability to reconstruct missing facial detail even when the original photo is severely degraded.
            </p>
            <p className="text-muted-foreground">
              The model processes your photo in 5–15 seconds, comparing the degraded input against its learned model of how faces should look, then reconstructing sharp edges, fine texture, and clear features that were lost to time.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Who Needs Old Photo Restoration</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> People who found old family photo albums and want to preserve them digitally</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Adults who have only one or two photos of grandparents or great-grandparents</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Anyone preparing a family reunion display or memorial</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Genealogy researchers who want to put faces to names</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> People converting physical photo albums to digital archives</li>
            </ul>
          </div>
        </section>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Related Restorations</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { href: "/restore-family-photos", label: "Restore Family Photos" },
                { href: "/restore-wedding-photos", label: "Restore Wedding Photos" },
                { href: "/blog/how-to-restore-old-photos", label: "How to Restore Old Photos (Guide)" },
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

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
  title: "Fix Blurry Photos Online — AI Sharpening in Seconds | Magic Memory",
  description:
    "Fix blurry photos with AI in seconds. Magic Memory sharpens faces using GFPGAN, recovering detail lost to motion blur, focus blur, and compression. Free daily.",
  alternates: { canonical: getCanonicalUrl("/fix-blurry-photos") },
  openGraph: {
    title: "Fix Blurry Photos Online — AI Sharpening | Magic Memory",
    description: "Fix blurry photos in seconds. AI sharpens faces and recovers lost detail. Free daily.",
    url: getCanonicalUrl("/fix-blurry-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Fix Blurry Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix Blurry Photos Online",
    description: "Fix blurry photos with AI. Results in 5–15 seconds.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI fix motion blur in photos?",
    answer:
      "AI restoration can reduce the appearance of mild to moderate motion blur, particularly in facial areas. GFPGAN does not perform deconvolution (the mathematical reversal of motion blur) — instead, it reconstructs plausible facial detail based on learned priors. For severe motion blur where features are completely smeared, results are improved but not perfect.",
  },
  {
    question: "Does it work on all types of blur?",
    answer:
      "GFPGAN addresses multiple blur types with different effectiveness: focus blur (soft, out-of-focus faces) — excellent results; film grain and old photo blur — excellent; mild motion blur — good results; severe motion blur — moderate improvement. Compression blur from heavily-compressed JPEGs — good improvement.",
  },
  {
    question: "What is the difference between sharpening and AI restoration?",
    answer:
      "Standard sharpening (like Unsharp Mask in Photoshop) increases edge contrast without adding new information — it makes an image look sharper but introduces halos and artifacts. AI restoration using GFPGAN actually reconstructs missing facial detail by comparing your photo against millions of high-resolution face examples. The result is genuinely sharper detail rather than just contrast-enhanced edges.",
  },
  {
    question: "Why are old scanned photos blurry?",
    answer:
      "Old scanned photos are blurry for several reasons: low scanner DPI (below 300 creates visible softness), scanner glass not cleaned (dust diffuses light), original film grain (especially ASA 400+ film), and photo paper degradation over time. For best results, rescan at 600 DPI minimum and clean the scanner glass before scanning.",
  },
  {
    question: "How long does it take to fix a blurry photo with AI?",
    answer:
      "Magic Memory processes photos in 5–15 seconds. The exact time depends on file size and current server load. You will see a progress indicator during processing. There is no quality difference between fast and slow processing — the AI always runs the full restoration model.",
  },
];

export default function FixBlurryPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Fix Blurry Photos", url: "/fix-blurry-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Fix Blurry Photos Online — AI Sharpening in Seconds"
          subheadline="Blurry portrait photos lose the expressions, details, and personality that make them worth keeping. Magic Memory uses GFPGAN AI to reconstruct sharp facial detail from blurry photos — not just edge sharpening, but genuine detail recovery. Results in 5–15 seconds."
          keyword="fix blurry photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Why AI Sharpening Is Different</h2>
            <p className="text-muted-foreground mb-4">
              Standard sharpening filters increase edge contrast — they make an image look sharper by boosting the transition between light and dark areas. But they do not add new information. GFPGAN does something fundamentally different.
            </p>
            <p className="text-muted-foreground mb-4">
              The model was trained on millions of high-resolution face images. It learned what sharp, detailed faces look like at a structural level — pores, eyelashes, hair strands, the curve of an ear. When it processes your blurry photo, it compares the degraded input to its learned model and reconstructs the fine detail that was lost.
            </p>
            <p className="text-muted-foreground">
              The result is not just a sharper-looking version of your original — it is a version that has recovered detail that blurring removed.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Types of Blur AI Can Address</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong>Focus blur:</strong> Soft, out-of-focus portraits. GFPGAN&apos;s strongest use case.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong>Old photo blur:</strong> Blur from film grain, aging, and photo paper degradation.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong>Compression blur:</strong> JPEG artifacts from over-compressed digital photos.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong>Mild motion blur:</strong> Subjects that moved slightly during exposure.</li>
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
                { href: "/enhance-old-photos", label: "Enhance Old Photos" },
                { href: "/restore-old-photos", label: "Restore Old Photos" },
                { href: "/restore-portrait-photos", label: "Restore Portrait Photos" },
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

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
  title: "Restore Black and White Photos With AI | Magic Memory",
  description:
    "Restore and sharpen old black and white photos with AI. GFPGAN recovers facial detail and reduces grain. Free daily restoration, no credit card required.",
  alternates: { canonical: getCanonicalUrl("/restore-black-and-white-photos") },
  openGraph: {
    title: "Restore Black and White Photos With AI | Magic Memory",
    description: "Restore black and white photos. AI sharpens faces and reduces grain in seconds.",
    url: getCanonicalUrl("/restore-black-and-white-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Black and White Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Black and White Photos With AI",
    description: "Restore B&W photos. AI sharpens faces and recovers detail.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Does AI restore or colorize black and white photos?",
    answer:
      "Magic Memory restores black and white photos — it does not colorize them. Restoration improves sharpness, recovers facial detail, reduces grain, and enhances contrast. The output remains black and white, but with significantly better clarity. Colorization is a separate process that requires different AI tools.",
  },
  {
    question: "Can AI make black and white photos higher resolution?",
    answer:
      "GFPGAN enhances the apparent sharpness and detail of faces in black and white photos, which can feel like a resolution increase even when the pixel count stays the same. The AI reconstructs fine facial detail — pores, eyelashes, hair strands — that were lost to film grain or poor scanning.",
  },
  {
    question: "What is the best resolution to upload a black and white photo?",
    answer:
      "Scan your black and white photo at 600 DPI minimum. For photos smaller than 4x6 inches, 1200 DPI gives better input for the AI. Upload as PNG for lossless quality, or JPEG at 90% quality minimum. Higher-quality input consistently yields better restoration results.",
  },
  {
    question: "Does GFPGAN handle film grain in black and white photos?",
    answer:
      "Yes. Film grain is one of the most common issues in black and white photos from the 1930s through 1970s. GFPGAN suppresses grain while preserving facial detail — it distinguishes between random grain noise and actual facial features, removing the former while enhancing the latter.",
  },
  {
    question: "What's the difference between restoration and colorization for B&W photos?",
    answer:
      "Restoration recovers detail, sharpness, and contrast that were in the original photo but degraded over time. Colorization adds color that was never in the original — it is an interpretive process based on AI guesses about what colors objects would have been. Magic Memory does the former; tools like MyHeritage InColor or DeOldify do the latter.",
  },
];

export default function RestoreBlackAndWhitePhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Black and White Photos", url: "/restore-black-and-white-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Black and White Photos With AI"
          subheadline="Black and white photos from early film photography suffer from grain, low contrast, and loss of fine facial detail. Magic Memory uses GFPGAN to sharpen faces, recover lost detail, and reduce grain — while keeping your photo beautifully black and white."
          keyword="restore black and white photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Restoration vs. Colorization — What&apos;s the Difference?</h2>
            <p className="text-muted-foreground mb-4">
              This is important to understand before you upload. Magic Memory <strong>restores</strong> black and white photos — it makes them sharper, clearer, and more detailed. It does <strong>not</strong> colorize them.
            </p>
            <p className="text-muted-foreground mb-4">
              Colorization is a separate AI process that adds artificial color to a B&W photo. It produces dramatic results but is interpretive — the AI guesses what colors things would have been. If you want colorization specifically, tools like MyHeritage InColor or DeOldify handle that.
            </p>
            <p className="text-muted-foreground">
              If you want your B&W photos to look <em>clearer and sharper</em> while staying B&W — that is what Magic Memory does, and it does it well.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">What GFPGAN Does to B&W Portraits</h2>
            <p className="text-muted-foreground mb-4">
              GFPGAN was trained on millions of high-resolution faces. When it processes a black and white photo, it identifies facial structures — eyes, nose, mouth, hairline — and reconstructs the fine detail that film grain and low resolution obscured.
            </p>
            <p className="text-muted-foreground">
              The result: your ancestor&apos;s face goes from a soft, grainy blur to a sharp portrait where you can see expression, individual hairs, and the fine wrinkles that make a face a person.
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
                { href: "/restore-vintage-photos", label: "Restore Vintage Photos" },
                { href: "/restore-portrait-photos", label: "Restore Portrait Photos" },
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

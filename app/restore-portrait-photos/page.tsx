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
  title: "AI Portrait Photo Restoration — Restore Old Portraits With Precision | Magic Memory",
  description:
    "Restore old portrait photos with AI precision. GFPGAN was designed for faces — professional portraits, school photos, and formal portraits all benefit. Free daily.",
  alternates: { canonical: getCanonicalUrl("/restore-portrait-photos") },
  openGraph: {
    title: "AI Portrait Photo Restoration | Magic Memory",
    description: "Restore old portrait photos with AI precision. GFPGAN designed for faces. Free daily.",
    url: getCanonicalUrl("/restore-portrait-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Portrait Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Portrait Photo Restoration",
    description: "Restore old portraits with AI precision. Results in 5–15 seconds.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Why is portrait restoration better than general photo restoration?",
    answer:
      "GFPGAN was specifically designed for face restoration — it is not a general image enhancement tool. It was trained on millions of high-resolution portrait photos and learned the precise structure of human faces at a microscopic level. This specialization means it outperforms general tools significantly on portraits, while being less effective on landscapes or objects.",
  },
  {
    question: "Does it work on profile shots and three-quarter portraits?",
    answer:
      "Yes. GFPGAN detects and restores faces at various angles, including three-quarter views and mild profile angles. Full side-profile shots (where only one ear is visible and the other eye is not visible) are harder — the model works best when both eyes are visible, but still improves single-eye profile shots.",
  },
  {
    question: "What about partial faces or faces obscured by hair?",
    answer:
      "GFPGAN handles partial faces by reconstructing visible facial regions. For faces obscured by hair, the AI improves the visible portions. If more than 50% of a face is obscured, the improvement is less dramatic than with a clear portrait, but still visible on the exposed facial areas.",
  },
  {
    question: "Can I restore school photos and ID photos?",
    answer:
      "Yes. School photos and ID-style photos — direct frontal portraits against neutral backgrounds — are among the easiest for GFPGAN to process. The standard frontal pose and clear face visibility make these ideal inputs, even when the photos are old and degraded.",
  },
  {
    question: "Does AI restoration work on professional studio portraits?",
    answer:
      "Professional studio portraits respond exceptionally well to GFPGAN restoration. The controlled lighting, neutral backgrounds, and frontal or near-frontal poses are ideal for AI face restoration. A degraded studio portrait from the 1960s or 1970s can be restored to near-modern quality.",
  },
];

export default function RestorePortraitPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Portrait Photos", url: "/restore-portrait-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="AI Portrait Photo Restoration — Restore Old Portraits With Precision"
          subheadline="Portraits are GFPGAN's specialty. The AI model was designed from the ground up for face restoration — trained on millions of high-resolution portraits to reconstruct fine detail, sharp edges, and natural expression. Your old portrait photos are its ideal input."
          keyword="restore portrait photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Why GFPGAN Is a Portrait Specialist</h2>
            <p className="text-muted-foreground mb-4">
              GFPGAN stands for Generative Facial Prior GAN. The &quot;facial prior&quot; is the key — the model encodes a deep understanding of facial structure derived from training on millions of high-resolution face images. This prior knowledge allows it to reconstruct plausible, accurate facial detail even when the input photo is severely degraded.
            </p>
            <p className="text-muted-foreground mb-4">
              This focus on faces means GFPGAN significantly outperforms general image enhancement tools for portraits. On non-face areas (backgrounds, clothing, props), the improvement is modest. On faces, it is transformative.
            </p>
            <p className="text-muted-foreground">
              The research (Wang et al., CVPR 2021, Tencent ARC) demonstrated that face-specific priors provide dramatically better restoration quality than general image priors for portrait photos. Magic Memory uses this technology to give anyone access to research-grade portrait restoration.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Portrait Types That Restore Best</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Studio portraits (formal, controlled lighting)</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> School photos (frontal, neutral background)</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Professional headshots</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Passport and ID-style photos</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Wedding portraits (face-forward poses)</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Military service portraits</li>
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
                { href: "/restore-old-photos", label: "Restore Old Photos" },
                { href: "/restore-vintage-photos", label: "Restore Vintage Photos" },
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

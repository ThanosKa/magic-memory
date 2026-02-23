import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { ComparisonTable } from "@/components/competitor/comparison-table";
import { competitors } from "@/lib/competitors/data";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "VanceAI Alternative for Photo Restoration — Magic Memory",
  description:
    "Looking for a simpler VanceAI alternative? Magic Memory offers one-click AI photo restoration without the complex interface. Compare features, pricing, and ease of use.",
  alternates: { canonical: getCanonicalUrl("/alternatives/vanceai") },
  openGraph: {
    title: "VanceAI Alternative for Photo Restoration — Magic Memory",
    description: "One-click photo restoration vs VanceAI's complex tools. Compare Magic Memory vs VanceAI.",
    url: getCanonicalUrl("/alternatives/vanceai"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "VanceAI Alternative" }],
  },
  robots: { index: true, follow: true },
};

const vanceai = competitors.vanceai;

const faqs: FAQItem[] = [
  {
    question: "Is Magic Memory easier to use than VanceAI?",
    answer:
      "Yes, significantly. Magic Memory is designed for one purpose — AI photo restoration — with a simple upload-and-download flow. VanceAI offers many tools (upscaling, background removal, denoising, restoration) which creates complexity. If you know exactly what you want (restore old portraits), Magic Memory is faster and simpler.",
  },
  {
    question: "Does VanceAI do more than Magic Memory?",
    answer:
      "VanceAI has more tools in total — it includes upscaling, background removal, colorization, and more. Magic Memory focuses exclusively on photo restoration using GFPGAN. For users who need multiple AI image tools, VanceAI may be more versatile. For users who specifically want portrait restoration, Magic Memory is more focused and typically faster.",
  },
  {
    question: "What does VanceAI cost compared to Magic Memory?",
    answer:
      "VanceAI offers subscription plans starting from $4.95/month and credit packs. Magic Memory charges €9.99–€29.99 for one-time credit packages that never expire, plus 1 free restoration per day. Pricing depends on usage frequency — compare the per-photo cost for your expected usage.",
  },
  {
    question: "Which tool has better face restoration quality?",
    answer:
      "Both use AI for face restoration. Magic Memory uses GFPGAN specifically, which was designed for face restoration research. VanceAI uses its own suite of models. For portrait photos, GFPGAN is one of the strongest publicly-available models for face-specific restoration.",
  },
  {
    question: "Can professionals use Magic Memory?",
    answer:
      "Yes. Professional photographers, genealogists, archivists, and restoration specialists all use Magic Memory. For batch processing large numbers of photos, VanceAI's batch tools may be faster. For individual portrait restoration where quality matters most, Magic Memory's GFPGAN results are excellent.",
  },
];

export default function VanceAIAlternativePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Alternatives", url: "/alternatives" },
    { name: "VanceAI Alternative", url: "/alternatives/vanceai" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/alternatives" className="hover:text-foreground">Alternatives</Link>
              <span>/</span>
              <span className="text-foreground">VanceAI Alternative</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              VanceAI Alternative for Photo Restoration
            </h1>

            <p className="text-lg text-muted-foreground mb-12">
              VanceAI is a powerful tool suite for professionals who want manual control over many AI image operations. Magic Memory is for people who want one thing done simply: restore old portrait photos.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Magic Memory:</strong> One-click portrait restoration, €9.99–€29.99 one-time, simple interface</li>
                <li><strong className="text-foreground">VanceAI:</strong> Multi-tool AI suite, subscription from $4.95/month, powerful but complex</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Simplicity vs. Power</h2>
            <p className="text-muted-foreground mb-4">
              VanceAI is built for power users — photographers, designers, and professionals who want control over multiple AI image operations. It offers upscaling, denoising, sharpening, background removal, colorization, and more, each with adjustable parameters.
            </p>
            <p className="text-muted-foreground mb-12">
              Magic Memory is built for everyone else: people who have an old family photo that needs restoration, want it done in 15 seconds, and do not want to navigate a complex interface with dozens of settings. Upload, wait 15 seconds, download.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="VanceAI" features={vanceai.features} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">When Magic Memory makes sense</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ You want simple, fast portrait restoration</li>
                  <li>→ You do not need batch processing or complex tools</li>
                  <li>→ You prefer pay-once-use-forever over subscription</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">When VanceAI makes sense</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ You need multiple types of AI image editing</li>
                  <li>→ You want manual control over AI parameters</li>
                  <li>→ You batch process large numbers of photos</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-4 last:border-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/alternatives" className="hover:text-foreground">All Alternatives →</Link>
              <Link href="/alternatives/remini" className="hover:text-foreground">Remini Alternative →</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FinalCta } from "@/components/layout/final-cta";
import { PageContainer } from "@/components/layout/page-container";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { ComparisonTable } from "@/components/competitor/comparison-table";
import { competitors } from "@/lib/competitors/data";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "VanceAI Alternative for Photo Restoration (One-Click)",
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
      "VanceAI offers subscription plans starting from $4.95/month and credit packs. Magic Memory charges €9.99–€29.99 for one-time credit packages that never expire. Pricing depends on usage frequency — compare the per-photo cost for your expected usage.",
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
        <section className="pb-24 pt-10 md:pb-32 md:pt-14">
          <PageContainer>
          <div className="max-w-4xl">
            <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="mm-underline hover:text-paper">Home</Link>
              <span>/</span>
              <Link href="/alternatives" className="mm-underline hover:text-paper">Alternatives</Link>
              <span>/</span>
              <span className="text-paper">VanceAI Alternative</span>
            </nav>

            <h1 className="font-serif text-balance mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.02em] text-paper">
              VanceAI Alternative for Photo Restoration
            </h1>

            <p className="text-lg leading-[1.6] text-paper/70 mb-12">
              VanceAI is a powerful tool suite for professionals who want manual control over many AI image operations. Magic Memory is for people who want one thing done simply: restore old portrait photos.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-2">TL;DR</h2>
              <ul className="space-y-2 text-paper/70">
                <li><strong className="text-paper">Magic Memory:</strong> One-click portrait restoration, €9.99–€29.99 one-time, simple interface</li>
                <li><strong className="text-paper">VanceAI:</strong> Multi-tool AI suite, subscription from $4.95/month, powerful but complex</li>
              </ul>
            </div>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Simplicity vs. Power</h2>
            <p className="text-paper/70 mb-4">
              VanceAI is built for power users — photographers, designers, and professionals who want control over multiple AI image operations. It offers upscaling, denoising, sharpening, background removal, colorization, and more, each with adjustable parameters.
            </p>
            <p className="text-paper/70 mb-12">
              Magic Memory is built for everyone else: people who have an old family photo that needs restoration, want it done in 15 seconds, and do not want to navigate a complex interface with dozens of settings. Upload, wait 15 seconds, download.
            </p>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Feature Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="VanceAI" features={vanceai.features} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-paper mb-3">When Magic Memory makes sense</h3>
                <ul className="space-y-2 text-sm text-paper/70">
                  <li>→ You want simple, fast portrait restoration</li>
                  <li>→ You do not need batch processing or complex tools</li>
                  <li>→ You prefer pay-once-use-forever over subscription</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-paper mb-3">When VanceAI makes sense</h3>
                <ul className="space-y-2 text-sm text-paper/70">
                  <li>→ You need multiple types of AI image editing</li>
                  <li>→ You want manual control over AI parameters</li>
                  <li>→ You batch process large numbers of photos</li>
                </ul>
              </div>
            </div>

            <h2 className="font-serif mb-8 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-4 last:border-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-paper/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-paper/70">
              <Link href="/alternatives" className="mm-underline hover:text-paper">All Alternatives →</Link>
              <Link href="/alternatives/remini" className="mm-underline hover:text-paper">Remini Alternative →</Link>
            </div>
          </div>
          </PageContainer>
        </section>

        <FinalCta
          title={
            <>
              Ready to restore{" "}
              <span className="italic text-paper/55">your memories?</span>
            </>
          }
          note="One-time credit packs. Credits never expire. No subscription."
        />
      </main>
      <Footer />
    </div>
  );
}

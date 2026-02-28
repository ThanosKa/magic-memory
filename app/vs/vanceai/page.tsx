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
  title: "Magic Memory vs VanceAI — Simple Restoration vs Pro Suite",
  description:
    "Compare Magic Memory and VanceAI for AI photo restoration. Magic Memory offers one-click restoration from €9.99. VanceAI is a professional suite with batch processing. See which tool fits your workflow.",
  alternates: { canonical: getCanonicalUrl("/vs/vanceai") },
  openGraph: {
    title: "Magic Memory vs VanceAI — Simple Restoration vs Pro Suite",
    description: "One-click AI photo restoration vs professional image suite. Compare pricing, ease of use, and features.",
    url: getCanonicalUrl("/vs/vanceai"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Magic Memory vs VanceAI" }],
  },
  robots: { index: true, follow: true },
};

const vanceai = competitors.vanceai;

const faqs: FAQItem[] = [
  {
    question: "Is Magic Memory or VanceAI easier to use?",
    answer:
      "Magic Memory is significantly easier. It is a one-click tool: upload a photo, AI restores it in 5-15 seconds, download the result. VanceAI offers a professional suite with multiple tools, settings, and options. If you just want to restore old photos quickly, Magic Memory has zero learning curve. If you need advanced controls like upscaling parameters or batch processing, VanceAI has more options.",
  },
  {
    question: "Which is cheaper for occasional use: Magic Memory or VanceAI?",
    answer:
      "Magic Memory is cheaper for occasional users. You get 1 free restoration per day, and the smallest credit pack is €9.99 for 30 credits that never expire. VanceAI starts at $4.95/month with limited credits, and unused credits may expire depending on your plan.",
  },
  {
    question: "Does VanceAI offer batch processing?",
    answer:
      "Yes, VanceAI supports batch processing of multiple images simultaneously. Magic Memory processes photos one at a time. If you need to restore hundreds of photos at once, VanceAI is better suited for that workflow.",
  },
  {
    question: "Which has better photo restoration quality?",
    answer:
      "For face restoration specifically, both produce strong results. Magic Memory uses GFPGAN, a peer-reviewed model (CVPR 2021) designed for face restoration. VanceAI uses a proprietary suite of models. VanceAI offers more types of enhancement (upscaling, denoising, background removal) while Magic Memory focuses specifically on face and photo restoration.",
  },
  {
    question: "Does Magic Memory or VanceAI store my photos?",
    answer:
      "Magic Memory does not store any photos — images are processed in memory and discarded. VanceAI stores processed images temporarily on their servers. If photo privacy is a concern, Magic Memory has a stricter no-storage policy.",
  },
];

export default function VsVanceAIPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Magic Memory vs VanceAI", url: "/vs/vanceai" },
  ]);

  const detailedComparison = [
    {
      category: "Pricing model",
      magicMemory: "One-time credits (€9.99–€29.99), credits never expire",
      competitor: "Monthly subscription from $4.95/month with credit limits",
    },
    {
      category: "Ease of use",
      magicMemory: "One-click: upload, restore, download. No settings needed.",
      competitor: "Professional suite with multiple tools and parameters",
    },
    {
      category: "Privacy",
      magicMemory: "No persistent photo storage after processing",
      competitor: "Temporary server storage of processed images",
    },
    {
      category: "Free tier",
      magicMemory: "1 restoration per day, no credit card required",
      competitor: "3 free images per month",
    },
    {
      category: "Batch processing",
      magicMemory: "Sequential — one photo at a time",
      competitor: "Yes — process multiple images simultaneously",
    },
    {
      category: "Tool range",
      magicMemory: "Photo restoration and face enhancement (GFPGAN)",
      competitor: "Restoration, upscaling, denoising, background removal, and more",
    },
    {
      category: "Target user",
      magicMemory: "Anyone who wants quick, easy photo restoration",
      competitor: "Power users and professionals needing advanced image tools",
    },
  ];

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
              <span className="text-foreground">Magic Memory vs VanceAI</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Magic Memory vs VanceAI — Simple vs Professional
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              VanceAI is a professional image enhancement suite with many tools. Magic Memory is a focused, one-click photo restoration tool. The right choice depends on whether you need simplicity or advanced controls.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-primary mb-2">Choose Magic Memory if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>→ Want fast, one-click restoration</li>
                    <li>→ Restore photos occasionally</li>
                    <li>→ Prefer pay-as-you-go pricing</li>
                    <li>→ Value photo privacy</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose VanceAI if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>→ Need batch processing</li>
                    <li>→ Want upscaling, denoising, and more</li>
                    <li>→ Are a professional or power user</li>
                    <li>→ Need desktop software</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Quick Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="VanceAI" features={vanceai.features} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Detailed Comparison</h2>
            <div className="space-y-6 mb-12">
              {detailedComparison.map((row) => (
                <div key={row.category} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-3">{row.category}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">Magic Memory</p>
                      <p className="text-sm text-muted-foreground">{row.magicMemory}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">VanceAI</p>
                      <p className="text-sm text-muted-foreground">{row.competitor}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <Link href="/alternatives/vanceai" className="hover:text-foreground">VanceAI Alternative →</Link>
              <Link href="/alternatives" className="hover:text-foreground">All Alternatives →</Link>
              <Link href="/vs/remini" className="hover:text-foreground">Magic Memory vs Remini →</Link>
              <Link href="/pricing" className="hover:text-foreground">View Magic Memory Pricing →</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

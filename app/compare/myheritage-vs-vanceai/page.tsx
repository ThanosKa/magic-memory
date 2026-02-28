import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "MyHeritage vs VanceAI — Genealogy Tool vs Professional Suite",
  description:
    "Compare MyHeritage Photo Enhancer and VanceAI for AI photo restoration. MyHeritage bundles enhancement into a genealogy subscription. VanceAI is a standalone professional image suite. See how both compare to Magic Memory.",
  alternates: { canonical: getCanonicalUrl("/compare/myheritage-vs-vanceai") },
  openGraph: {
    title: "MyHeritage vs VanceAI — Genealogy Tool vs Professional Suite",
    description: "Genealogy-bundled enhancer vs standalone pro image suite. Compare pricing, features, and which is right for your photos.",
    url: getCanonicalUrl("/compare/myheritage-vs-vanceai"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "MyHeritage vs VanceAI" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Is MyHeritage or VanceAI better for photo restoration?",
    answer:
      "It depends on your use case. MyHeritage is better if you also want genealogy tools like family trees, DNA analysis, and historical records alongside photo enhancement. VanceAI is better if you need a dedicated image processing suite with batch processing, upscaling, denoising, and background removal. For straightforward face restoration, Magic Memory offers a one-click web tool with no subscription.",
  },
  {
    question: "Which is cheaper: MyHeritage or VanceAI?",
    answer:
      "Both offer tiered pricing. MyHeritage costs around $13/month for a genealogy subscription that includes photo enhancement. VanceAI starts at $4.95/month with limited credits. VanceAI is cheaper if you only need image tools, but MyHeritage may be better value if you also use genealogy features. Magic Memory offers one-time credits from \u20ac9.99 for 30 restorations with no subscription.",
  },
  {
    question: "Does MyHeritage have batch processing?",
    answer:
      "MyHeritage does not offer batch processing for photo enhancement. You process photos one at a time through its web interface. VanceAI supports batch processing of multiple images simultaneously, making it more efficient for high-volume work.",
  },
  {
    question: "Can I use VanceAI for genealogy research?",
    answer:
      "No, VanceAI is a standalone image processing tool with no genealogy features. If you need family trees, DNA analysis, or historical records alongside photo enhancement, MyHeritage is the better choice. If you only need photo restoration, both VanceAI and Magic Memory focus exclusively on that.",
  },
];

const comparison = [
  { category: "Type", myheritage: "Genealogy platform with photo enhancement", vanceai: "Professional AI image suite" },
  { category: "Pricing", myheritage: "~$13/month genealogy subscription", vanceai: "From $4.95/month with credit limits" },
  { category: "Platform", myheritage: "Web and mobile", vanceai: "Web and desktop" },
  { category: "Photo focus", myheritage: "Enhancement bundled with genealogy", vanceai: "Dedicated image processing tools" },
  { category: "Batch processing", myheritage: "No — one photo at a time", vanceai: "Yes — multiple images simultaneously" },
  { category: "Tool range", myheritage: "Photo enhancement, colorization, animation", vanceai: "Restoration, upscaling, denoising, background removal, and more" },
  { category: "Target user", myheritage: "Family historians and genealogists", vanceai: "Professionals and power users" },
  { category: "Free tier", myheritage: "Very limited", vanceai: "3 free images per month" },
];

export default function CompareMyHeritageVsVanceAIPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "MyHeritage vs VanceAI", url: "/compare/myheritage-vs-vanceai" },
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
              <span className="text-foreground">MyHeritage vs VanceAI</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              MyHeritage vs VanceAI — Genealogy Tool vs Pro Suite
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              MyHeritage bundles photo enhancement into a genealogy platform with family trees and DNA analysis. VanceAI is a standalone professional image processing suite. They target very different users — here is how they stack up, and when a simpler tool might be the better choice.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold mb-2">Choose MyHeritage if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Want genealogy tools alongside photo enhancement</li>
                    <li>- Need photo colorization and animation</li>
                    <li>- Are researching family history</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose VanceAI if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Need batch processing for many images</li>
                    <li>- Want upscaling, denoising, and background removal</li>
                    <li>- Are a professional or power user</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Side-by-Side Comparison</h2>
            <div className="space-y-6 mb-12">
              {comparison.map((row) => (
                <div key={row.category} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-3">{row.category}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">MyHeritage</p>
                      <p className="text-sm text-muted-foreground">{row.myheritage}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">VanceAI</p>
                      <p className="text-sm text-muted-foreground">{row.vanceai}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Consider Magic Memory</h2>
              <p className="text-muted-foreground mb-4">
                If you do not need genealogy tools or a full image processing suite, Magic Memory is a one-click web tool for photo restoration. No subscription, no bundled features you will not use. It uses GFPGAN AI for face restoration and works on any device with a browser.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-semibold"></th>
                      <th className="py-2 text-left font-semibold">MyHeritage</th>
                      <th className="py-2 text-left font-semibold">VanceAI</th>
                      <th className="py-2 text-left font-semibold text-primary">Magic Memory</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Price</td><td className="py-2">~$13/month</td><td className="py-2">From $4.95/month</td><td className="py-2">{"\u20ac"}9.99 one-time</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Free tier</td><td className="py-2">Very limited</td><td className="py-2">3 images/month</td><td className="py-2">1/day, no card</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Platform</td><td className="py-2">Web + mobile</td><td className="py-2">Web + desktop</td><td className="py-2">Web (any device)</td></tr>
                    <tr><td className="py-2 font-medium text-foreground">Focus</td><td className="py-2">Genealogy + photos</td><td className="py-2">Image processing</td><td className="py-2">Photo restoration</td></tr>
                  </tbody>
                </table>
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
              <Link href="/vs/myheritage" className="hover:text-foreground">Magic Memory vs MyHeritage</Link>
              <Link href="/vs/vanceai" className="hover:text-foreground">Magic Memory vs VanceAI</Link>
              <Link href="/alternatives" className="hover:text-foreground">All Alternatives</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

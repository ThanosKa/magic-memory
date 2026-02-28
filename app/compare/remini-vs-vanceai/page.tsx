import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "Remini vs VanceAI — Mobile App vs Professional Suite",
  description:
    "Compare Remini and VanceAI for AI photo restoration. Remini is a mobile app at $9.99/week. VanceAI is a professional image suite with batch processing. See how both compare to Magic Memory.",
  alternates: { canonical: getCanonicalUrl("/compare/remini-vs-vanceai") },
  openGraph: {
    title: "Remini vs VanceAI — Mobile App vs Professional Suite",
    description: "Mobile photo app vs pro image suite. Compare pricing, features, batch processing, and ease of use.",
    url: getCanonicalUrl("/compare/remini-vs-vanceai"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Remini vs VanceAI" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Is Remini or VanceAI better for photo restoration?",
    answer:
      "Remini is better for casual, mobile users who want quick one-tap restoration. VanceAI is better for professionals or power users who need batch processing, upscaling, denoising, and other advanced image tools. For simple face restoration on desktop, Magic Memory offers a one-click web tool with no subscription.",
  },
  {
    question: "Which is cheaper: Remini or VanceAI?",
    answer:
      "VanceAI starts at $4.95/month with limited credits. Remini costs $9.99/week (roughly $40/month). VanceAI is significantly cheaper for light to moderate use. Magic Memory offers one-time credits from \u20ac9.99 for 100 restorations with no subscription and no expiry.",
  },
  {
    question: "Does Remini have batch processing?",
    answer:
      "No, Remini processes photos one at a time through its mobile app. VanceAI supports batch processing of multiple images simultaneously, making it better suited for high-volume work.",
  },
  {
    question: "Can I use VanceAI on mobile?",
    answer:
      "VanceAI is primarily a web and desktop tool. While the website is accessible on mobile browsers, the interface is designed for desktop use. Remini is mobile-first with dedicated iOS and Android apps.",
  },
];

const comparison = [
  { category: "Type", remini: "Mobile photo enhancement app", vanceai: "Professional AI image suite" },
  { category: "Pricing", remini: "$9.99/week subscription", vanceai: "From $4.95/month with credit limits" },
  { category: "Platform", remini: "iOS and Android only", vanceai: "Web and desktop" },
  { category: "Ease of use", remini: "One-tap restoration on mobile", vanceai: "Multiple tools with settings and parameters" },
  { category: "Batch processing", remini: "No — one photo at a time", vanceai: "Yes — multiple images simultaneously" },
  { category: "Tool range", remini: "Photo restoration, video enhancement", vanceai: "Restoration, upscaling, denoising, background removal, and more" },
  { category: "Target user", remini: "Casual mobile users", vanceai: "Professionals and power users" },
  { category: "Free tier", remini: "Limited free trial", vanceai: "3 free images per month" },
];

export default function CompareReminiVsVanceAIPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Remini vs VanceAI", url: "/compare/remini-vs-vanceai" },
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
              <span className="text-foreground">Remini vs VanceAI</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Remini vs VanceAI — Mobile App vs Pro Suite
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Remini is a mobile-first app for quick photo restoration. VanceAI is a professional image processing suite with advanced tools. They serve different audiences — here is how they compare, and when a simpler alternative might be the better choice.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold mb-2">Choose Remini if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Want quick mobile restoration</li>
                    <li>- Need video enhancement</li>
                    <li>- Prefer a simple, one-tap interface</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose VanceAI if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Need batch processing</li>
                    <li>- Want upscaling, denoising, and more</li>
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
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">Remini</p>
                      <p className="text-sm text-muted-foreground">{row.remini}</p>
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
                If you want something between Remini&apos;s simplicity and VanceAI&apos;s complexity, Magic Memory is a one-click web tool for photo restoration. No app to download, no subscription, no learning curve. It uses GFPGAN AI for face restoration and works on any device.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-semibold"></th>
                      <th className="py-2 text-left font-semibold">Remini</th>
                      <th className="py-2 text-left font-semibold">VanceAI</th>
                      <th className="py-2 text-left font-semibold text-primary">Magic Memory</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Price</td><td className="py-2">$9.99/week</td><td className="py-2">From $4.95/month</td><td className="py-2">{"\u20ac"}9.99 one-time</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Free tier</td><td className="py-2">Limited trial</td><td className="py-2">3 images/month</td><td className="py-2">1/day, no card</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Platform</td><td className="py-2">Mobile only</td><td className="py-2">Web + desktop</td><td className="py-2">Web (any device)</td></tr>
                    <tr><td className="py-2 font-medium text-foreground">Complexity</td><td className="py-2">Simple</td><td className="py-2">Advanced</td><td className="py-2">One-click</td></tr>
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
              <Link href="/vs/remini" className="hover:text-foreground">Magic Memory vs Remini</Link>
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

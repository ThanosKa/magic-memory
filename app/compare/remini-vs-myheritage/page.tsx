import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "Remini vs MyHeritage Photo Enhancer — Which Is Better?",
  description:
    "Compare Remini and MyHeritage Photo Enhancer for AI photo restoration. Remini is a mobile app at $9.99/week. MyHeritage bundles photo enhancement into a genealogy subscription. See how both compare to Magic Memory.",
  alternates: { canonical: getCanonicalUrl("/compare/remini-vs-myheritage") },
  openGraph: {
    title: "Remini vs MyHeritage Photo Enhancer — Which Is Better?",
    description: "Mobile photo app vs genealogy-bundled enhancer. Compare pricing, features, and which is right for you.",
    url: getCanonicalUrl("/compare/remini-vs-myheritage"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Remini vs MyHeritage" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Is Remini or MyHeritage better for restoring old photos?",
    answer:
      "It depends on your needs. Remini is a dedicated mobile photo enhancement app with fast, one-tap restoration. MyHeritage bundles photo enhancement into a genealogy platform with family tree tools. If you only want photo restoration, Remini is more focused. If you also want genealogy research, MyHeritage offers more value.",
  },
  {
    question: "Which is cheaper: Remini or MyHeritage?",
    answer:
      "Both are subscription-based. Remini costs $9.99/week (roughly $40/month). MyHeritage costs around $13/month for a genealogy subscription that includes photo enhancement. MyHeritage is cheaper per month, but you are paying for genealogy tools you may not need. Magic Memory offers one-time credit packages from \u20ac9.99 with no subscription.",
  },
  {
    question: "Can I use Remini on desktop?",
    answer:
      "No, Remini is a mobile-only app for iOS and Android. MyHeritage works on both web and mobile. If you need desktop access, consider MyHeritage or Magic Memory, which is a web app that works on any device.",
  },
  {
    question: "Is there a free alternative to both?",
    answer:
      "Magic Memory offers 1 free photo restoration per day with no credit card required. It works on any device via the web browser and uses GFPGAN AI for face restoration. Paid credits start at \u20ac9.99 for 100 restorations and never expire.",
  },
];

const comparison = [
  { category: "Type", remini: "Mobile photo enhancement app", myheritage: "Genealogy platform with photo enhancement" },
  { category: "Pricing", remini: "$9.99/week subscription", myheritage: "~$13/month genealogy subscription" },
  { category: "Platform", remini: "iOS and Android only", myheritage: "Web and mobile" },
  { category: "Free tier", remini: "Limited free trial", myheritage: "Very limited" },
  { category: "Focus", remini: "Photo and video enhancement", myheritage: "Family trees, DNA, photo enhancement" },
  { category: "Photo storage", remini: "Cloud stored", myheritage: "Stored in genealogy account" },
  { category: "Video enhancement", remini: "Yes", myheritage: "No" },
  { category: "Standalone photo tool", remini: "Yes", myheritage: "No — bundled with genealogy" },
];

export default function CompareReminiVsMyHeritagePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Remini vs MyHeritage", url: "/compare/remini-vs-myheritage" },
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
              <span className="text-foreground">Remini vs MyHeritage</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Remini vs MyHeritage Photo Enhancer
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Remini is a mobile app built specifically for photo and video enhancement. MyHeritage is a genealogy platform that includes photo enhancement as one of many features. Here is how they compare — and why neither may be the best option for simple photo restoration.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold mb-2">Choose Remini if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Want a mobile-first experience</li>
                    <li>- Need video enhancement</li>
                    <li>- Use it frequently enough to justify $9.99/week</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose MyHeritage if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Already have a genealogy subscription</li>
                    <li>- Want family tree + photo tools together</li>
                    <li>- Prefer web-based access</li>
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
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">MyHeritage</p>
                      <p className="text-sm text-muted-foreground">{row.myheritage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Consider Magic Memory</h2>
              <p className="text-muted-foreground mb-4">
                If you just need photo restoration without a weekly subscription or a genealogy bundle, Magic Memory may be a better fit. It is a web-based tool that works on any device, offers 1 free restoration per day, and uses GFPGAN AI for face restoration. Credits start at {"\u20ac"}9.99 for 100 restorations and never expire.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-semibold"></th>
                      <th className="py-2 text-left font-semibold">Remini</th>
                      <th className="py-2 text-left font-semibold">MyHeritage</th>
                      <th className="py-2 text-left font-semibold text-primary">Magic Memory</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Price</td><td className="py-2">$9.99/week</td><td className="py-2">~$13/month</td><td className="py-2">{"\u20ac"}9.99 one-time</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Free tier</td><td className="py-2">Limited trial</td><td className="py-2">Very limited</td><td className="py-2">1/day, no card</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Platform</td><td className="py-2">Mobile only</td><td className="py-2">Web + mobile</td><td className="py-2">Web (any device)</td></tr>
                    <tr><td className="py-2 font-medium text-foreground">Photo storage</td><td className="py-2">Cloud</td><td className="py-2">Account</td><td className="py-2">None (privacy-first)</td></tr>
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
              <Link href="/vs/myheritage" className="hover:text-foreground">Magic Memory vs MyHeritage</Link>
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

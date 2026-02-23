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
  title: "Remini Alternative — Magic Memory vs Remini for Photo Restoration",
  description:
    "Looking for a Remini alternative? Compare Magic Memory vs Remini: pricing, platform, privacy, and restoration quality. Magic Memory is web-based with one-time credits.",
  alternates: { canonical: getCanonicalUrl("/alternatives/remini") },
  openGraph: {
    title: "Remini Alternative — Magic Memory vs Remini",
    description: "Magic Memory vs Remini comparison. Web-based vs mobile-only, one-time vs subscription.",
    url: getCanonicalUrl("/alternatives/remini"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Remini Alternative" }],
  },
  robots: { index: true, follow: true },
};

const remini = competitors.remini;

const faqs: FAQItem[] = [
  {
    question: "Is Magic Memory better than Remini?",
    answer:
      "It depends on your needs. Magic Memory is better if you want web access (no app download required), prefer one-time payment over weekly subscription, and value privacy (no cloud photo storage). Remini is better if you want a mobile app with additional editing features and video enhancement capabilities.",
  },
  {
    question: "Does Magic Memory work on mobile without an app?",
    answer:
      "Yes. Magic Memory is a web app that works in any mobile browser — no app download required. Open your browser on your phone, go to the site, and upload directly from your camera roll. It works on iOS and Android without any installation.",
  },
  {
    question: "What does Remini cost compared to Magic Memory?",
    answer:
      "Remini charges $9.99 per week as a subscription. Magic Memory charges €9.99–€29.99 for one-time credit packages that never expire. For occasional users who restore a few photos per month, Magic Memory is significantly cheaper. For daily heavy use, compare the per-photo cost.",
  },
  {
    question: "Does Magic Memory store my photos?",
    answer:
      "No. Magic Memory does not store your photos after processing. Your original and restored photos are available in your account history but are not retained indefinitely. This is different from Remini, which stores photos in cloud accounts.",
  },
  {
    question: "Can I try Magic Memory before paying?",
    answer:
      "Yes. Magic Memory gives you 1 free restoration every day, no credit card required. Sign in with Google and restore a photo immediately. If you need more, purchase a credit package. There is no subscription, no commitment, and no auto-renewal.",
  },
];

export default function ReminiAlternativePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Alternatives", url: "/alternatives" },
    { name: "Remini Alternative", url: "/alternatives/remini" },
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
              <span className="text-foreground">Remini Alternative</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Looking for a Remini Alternative? Here&apos;s How Magic Memory Compares
            </h1>

            <p className="text-lg text-muted-foreground mb-12">
              Remini is a popular AI photo enhancer, but it has real limitations: a weekly subscription, mobile-only access, and cloud photo storage. Here is what Magic Memory offers as an alternative.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Magic Memory:</strong> Web app, one-time credits (€9.99–€29.99), no photo storage, 1 free/day</li>
                <li><strong className="text-foreground">Remini:</strong> Mobile app only, $9.99/week subscription, cloud photo storage, more editing features</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Why People Look for Remini Alternatives</h2>
            <div className="space-y-4 text-muted-foreground mb-12">
              <p><strong className="text-foreground">Subscription pricing:</strong> Remini charges $9.99/week. For someone who restores photos occasionally, this is expensive relative to usage.</p>
              <p><strong className="text-foreground">Mobile-only:</strong> Remini requires the mobile app. Users who want to work on a desktop, laptop, or tablet without installing an app cannot use it.</p>
              <p><strong className="text-foreground">Cloud photo storage:</strong> Remini stores photos in cloud accounts. Privacy-conscious users are uncomfortable with a third-party service holding their personal family photos.</p>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="Remini" features={remini.features} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">Who should switch to Magic Memory</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ Users who want web access on any device</li>
                  <li>→ Occasional users who restore photos infrequently</li>
                  <li>→ People who dislike subscriptions</li>
                  <li>→ Privacy-conscious users</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">Who should stay with Remini</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ Users who want a full mobile editing experience</li>
                  <li>→ People who use video enhancement features</li>
                  <li>→ Daily heavy users where subscription is cost-effective</li>
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
              <Link href="/alternatives/myheritage" className="hover:text-foreground">MyHeritage Alternative →</Link>
              <Link href="/vs/remini" className="hover:text-foreground">Full Magic Memory vs Remini →</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

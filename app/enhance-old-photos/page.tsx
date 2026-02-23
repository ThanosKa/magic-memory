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
  title: "Enhance Old Photos With AI — Improve Clarity and Detail | Magic Memory",
  description:
    "Enhance old photos with AI to improve clarity, sharpness, and facial detail. Magic Memory uses GFPGAN to upgrade photo quality in seconds. Free daily enhancement.",
  alternates: { canonical: getCanonicalUrl("/enhance-old-photos") },
  openGraph: {
    title: "Enhance Old Photos With AI | Magic Memory",
    description: "Enhance old photos with AI. Improve clarity and detail in seconds. Free daily.",
    url: getCanonicalUrl("/enhance-old-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Enhance Old Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enhance Old Photos With AI",
    description: "Improve clarity and detail in old photos. Results in seconds.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What is the difference between enhancement and restoration?",
    answer:
      "Restoration implies bringing something back to its original state — fixing damage, recovering what was lost. Enhancement means improving quality beyond what the original captured — making a decent photo better, a good portrait sharper. In practice, GFPGAN does both simultaneously: it recovers lost detail (restoration) and improves the apparent resolution of faces (enhancement). Most people searching 'enhance old photos' want both.",
  },
  {
    question: "Does AI photo enhancement add detail that wasn't in the original?",
    answer:
      "GFPGAN recovers detail that was present in the original scene but not captured well due to film limitations, poor focus, or degradation over time. It does not invent detail that was never there — it reconstructs plausible detail based on what the surrounding face structure implies. For most portrait photos, this results in a significantly more realistic and sharp-looking image.",
  },
  {
    question: "What maximum resolution does Magic Memory support?",
    answer:
      "Magic Memory accepts photos up to 10MB in file size. There is no fixed pixel dimension limit. GFPGAN processes the photo at its input resolution and outputs an enhanced version. For very high-resolution inputs (above 4000x4000), the facial enhancement is applied to detected face regions and composited back.",
  },
  {
    question: "Can I enhance a photo I already have on my phone?",
    answer:
      "Yes. Magic Memory is a web app — it works on any device with a browser, including phones. Take a photo of an old photo with your phone or share a photo from your camera roll. Upload directly from your phone's photo library for instant enhancement.",
  },
  {
    question: "Does AI enhancement work on good-quality photos too?",
    answer:
      "Yes. GFPGAN enhances all portrait photos, not just heavily damaged ones. A reasonably sharp portrait from the 1990s can still see improvement in fine facial detail. The improvement is less dramatic than with a severely degraded photo, but still visible — particularly in the finest facial features.",
  },
];

export default function EnhanceOldPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Enhance Old Photos", url: "/enhance-old-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Enhance Old Photos With AI — Improve Clarity and Detail"
          subheadline="Not every old photo is damaged — some are just not as good as they could be. Magic Memory uses GFPGAN AI to improve the clarity, sharpness, and detail in your portraits, taking photos from acceptable to excellent in under 15 seconds."
          keyword="enhance old photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Enhancement vs. Restoration</h2>
            <p className="text-muted-foreground mb-4">
              The distinction matters practically. If you are searching for photo enhancement, you likely have a photo that is okay but not great — perhaps slightly soft, lacking fine detail, or below the quality you want for printing or sharing.
            </p>
            <p className="text-muted-foreground mb-4">
              GFPGAN does both at once. It recovers lost detail from degradation (restoration) and improves the apparent sharpness and quality of the face (enhancement). For most photos, this means faces go from looking like old photographs to looking like modern, sharp portraits.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Who Enhances Old Photos</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> People digitizing photo albums who want the best possible quality</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Anyone printing photos larger than 5x7 and needing sharp source material</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> Genealogists building visual family histories</li>
              <li className="flex gap-3"><span className="text-primary font-bold">→</span> People creating memorial displays or tribute books</li>
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
                { href: "/fix-blurry-photos", label: "Fix Blurry Photos" },
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

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
  title: "Restore Vintage Photos — AI That Understands Old Photography | Magic Memory",
  description:
    "Restore vintage photos from the 1920s through 1970s with AI. GFPGAN handles film grain, sepia tones, and period portrait conventions. Free daily restoration.",
  alternates: { canonical: getCanonicalUrl("/restore-vintage-photos") },
  openGraph: {
    title: "Restore Vintage Photos — AI For Old Photography | Magic Memory",
    description: "Restore vintage photos with AI. Film grain, sepia, 1920s–1970s portraits. Free daily.",
    url: getCanonicalUrl("/restore-vintage-photos"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Restore Vintage Photos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Vintage Photos With AI",
    description: "Restore 1920s–1970s vintage photos. Film grain and sepia handled well.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Does AI restoration work on photos from the 1920s?",
    answer:
      "Yes. Photos from the 1920s typically suffer from low resolution, heavy film grain, and significant fading. GFPGAN handles all three. The model was trained on faces across a wide range of degradation levels, so it can extract meaningful facial detail from even very early film photography.",
  },
  {
    question: "Can GFPGAN handle heavy film grain from vintage photos?",
    answer:
      "Film grain suppression is one of GFPGAN's strengths. The model distinguishes between random grain noise and actual facial structure — it removes the former while preserving and enhancing the latter. Photos from high-speed film (ASA 400+), which produce visible grain even at smaller sizes, respond particularly well.",
  },
  {
    question: "What about sepia-toned vintage photos?",
    answer:
      "GFPGAN processes sepia-toned photos and restores facial detail within the sepia color space. The output retains the sepia tone while showing sharper, more detailed faces. If you want to convert sepia to black and white or color, that is a separate step handled by other tools.",
  },
  {
    question: "Why do vintage photos look so different from modern photos?",
    answer:
      "Vintage photos (roughly 1920s–1970s) differ from modern photos in several ways: film stock had lower resolution and higher grain than modern sensors; lenses were less sharp, especially at the edges; printing processes introduced additional grain; and long-term storage caused fading, yellowing, and emulsion degradation. GFPGAN addresses all of these except the inherent lens characteristics.",
  },
  {
    question: "Can I use this for genealogy research with very old photos?",
    answer:
      "Yes. Vintage photo restoration is particularly valuable for genealogy — it makes it easier to identify family members in early photos, compare faces across generations, and put clear, detailed faces to names in family records. Many genealogists use Magic Memory as part of their documentation process.",
  },
];

export default function RestoreVintagePhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Vintage Photos", url: "/restore-vintage-photos" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Vintage Photos — AI That Understands Old Photography"
          subheadline="Film photography from the 1920s through 1970s comes with its own challenges: heavy grain, sepia tones, portrait conventions, and decades of physical degradation. Magic Memory's GFPGAN AI was trained on diverse photography styles and handles vintage photos with precision."
          keyword="restore vintage photos"
        />

        <section className="py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">The Vintage Photography Challenge</h2>
            <p className="text-muted-foreground mb-4">
              Vintage photos from the early-to-mid 20th century were taken with large-format or medium-format film cameras. The film itself had lower resolution than modern sensors, and the grain was an inherent part of the medium — not a defect, but a characteristic.
            </p>
            <p className="text-muted-foreground mb-4">
              When these photos are scanned and viewed digitally, the grain becomes more visible and the low resolution more apparent. Faces that looked acceptable as small prints become obviously soft and grainy at digital zoom levels.
            </p>
            <p className="text-muted-foreground">
              GFPGAN was designed for exactly this scenario. It treats grain as noise to be removed and low resolution as a detail-recovery problem — pulling out the facial structure hidden beneath decades of film and time.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Portrait Conventions in Vintage Photography</h2>
            <p className="text-muted-foreground">
              Vintage portraits followed specific conventions — formal poses, specific lighting angles, often studio backdrops. GFPGAN handles these well because the model was trained on portraits from across history, not just modern smartphone selfies. The formal frontal portraits common from the 1920s–1950s are particularly well-suited to AI restoration.
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
                { href: "/restore-black-and-white-photos", label: "Restore Black and White Photos" },
                { href: "/restore-family-photos", label: "Restore Family Photos" },
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

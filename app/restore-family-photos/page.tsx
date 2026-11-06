import { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  getCanonicalUrl,
  getOgImageUrl,
  faqPageJsonLd,
  breadcrumbJsonLd,
  useCaseSoftwareJsonLd,
} from "@/lib/seo/metadata-helpers";
import { UseCaseHero } from "@/components/use-case/use-case-hero";
import { UseCaseHowItWorks } from "@/components/use-case/use-case-how-it-works";
import { UseCaseFAQ } from "@/components/use-case/use-case-faq";
import { UseCaseArticle } from "@/components/use-case/use-case-article";
import { UseCaseRelated } from "@/components/use-case/use-case-related";
import { FinalCta } from "@/components/layout/final-cta";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(
  () => import("@/components/header").then((m) => m.Header),
  { ssr: true },
);
const Footer = dynamic(
  () => import("@/components/footer").then((m) => m.Footer),
  { ssr: true },
);

export const metadata: Metadata = {
  title: "AI Family Photo Restoration — Bring Memories Back to Life",
  description:
    "Restore old family photos with AI. Perfect for genealogy, family reunions, and passing restored memories to future generations. Free daily restoration.",
  alternates: { canonical: getCanonicalUrl("/restore-family-photos") },
  openGraph: {
    title: "AI Family Photo Restoration — Bring Memories Back to Life",
    description:
      "Restore your old family photos with AI. Free daily restoration, no credit card required.",
    url: getCanonicalUrl("/restore-family-photos"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Restore Family Photos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Family Photo Restoration",
    description:
      "Restore old family photos. Perfect for genealogy and family history.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI restore photos of multiple family members at once?",
    answer:
      "Yes. GFPGAN processes all faces in a photo simultaneously. Group family portraits with multiple people all benefit from restoration. For best results, ensure faces are not too small in the frame — faces should be at least 50 pixels wide in the source image.",
  },
  {
    question:
      "I have a photo of a grandparent who has passed. Can I restore it?",
    answer:
      "Yes, and this is one of the most common and meaningful uses of Magic Memory. Restoring a photo of someone who has passed preserves their memory in the clearest possible form. The AI focuses on facial restoration, recovering the fine detail that makes portraits feel personal and real.",
  },
  {
    question: "Can I restore childhood photos of family members?",
    answer:
      "Absolutely. Childhood photos from the 1950s through 1980s often suffer from the same degradation as other period photos: grain, fading, and loss of sharpness. GFPGAN restores these effectively. Portraits where the child's face is the main subject yield the best results.",
  },
  {
    question: "How do I organize a family photo restoration project?",
    answer:
      "Sort photos by condition (most degraded first), then by importance (unique photos of people who have passed, rare group portraits). Scan in batches at 600 DPI, name files systematically (e.g., last name + year + description), and restore the highest-priority photos first using your free daily restoration.",
  },
  {
    question: "Can restored family photos be used for genealogy research?",
    answer:
      "Yes. Restored photos are valuable for genealogy — they make it easier to identify family members, and the increased clarity helps when comparing photos to confirm identities. Many genealogists use restored photos alongside family trees and historical records.",
  },
];

export default function RestoreFamilyPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Family Photos", url: "/restore-family-photos" },
  ]);
  const softwareJsonLd = useCaseSoftwareJsonLd({
    name: "Magic Memory — Restore Family Photos with AI",
    description:
      "Restore old family photos with GFPGAN AI. Perfect for genealogy, family reunions, and preserving ancestor portraits. 1 free per day, no card.",
    url: "/restore-family-photos",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="AI Family Photo Restoration — Bring Memories Back to Life"
          subheadline="Family photos span generations. Magic Memory uses GFPGAN AI to restore the faces in your family portraits — from great-grandparents to childhood photos — so you can share them at family reunions, build genealogy archives, and pass them on to future generations."
          keyword="restore family photos"
        />

        <UseCaseArticle>
          <h2>Family Photos Are Irreplaceable</h2>
          <p>
            Unlike wedding photos — where professional photographers made
            multiple copies — many family photos exist as single prints. They
            were taken with consumer cameras, processed at drug stores, and
            stored in shoeboxes. When they degrade, there is no backup.
          </p>
          <p>
            This makes family photo restoration more urgent than most people
            realize. A photo that is blurry and faded today will continue
            deteriorating. Digitization with restoration preserves the clearest
            possible version before further degradation occurs.
          </p>

          <h2>Multi-Generation Portraits</h2>
          <p>
            Photos that span multiple generations — a grandparent holding a
            grandchild, or three generations in one frame — are among the most
            valuable family photos. GFPGAN handles multiple faces in a single
            photo, improving all of them simultaneously.
          </p>
          <p>
            After restoration, share the originals and restored versions side by
            side at your next family reunion. The reaction is often immediate —
            family members recognize details and expressions they had forgotten.
          </p>
        </UseCaseArticle>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <UseCaseRelated
          links={[
            { href: "/restore-old-photos", label: "Restore Old Photos" },
            {
              href: "/restore-vintage-photos",
              label: "Restore Vintage Photos",
            },
            {
              href: "/blog/restore-old-family-photos-tips",
              label: "Family Photo Tips (Guide)",
            },
          ]}
        />

        <FinalCta
          title={
            <>
              Ready to restore{" "}
              <span className="italic text-paper/55">your memories?</span>
            </>
          }
          note="Start with your free daily restoration. No credit card required."
        />
      </main>
      <Footer />
    </div>
  );
}

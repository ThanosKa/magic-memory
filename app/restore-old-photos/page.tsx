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
  title: "Restore Old Photos Online — AI Photo Restoration",
  description:
    "Restore your old photos online in seconds. Magic Memory uses AI to sharpen faces, remove blur, and fix damage. One-time credits, no subscription.",
  alternates: { canonical: getCanonicalUrl("/restore-old-photos") },
  openGraph: {
    title:
      "Restore Old Photos Online — AI Photo Restoration | Magic Memory",
    description:
      "Restore your old photos online in seconds. Magic Memory uses AI to sharpen faces, remove blur, and fix damage. One-time credits, no subscription.",
    url: getCanonicalUrl("/restore-old-photos"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Restore Old Photos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Old Photos Online",
    description:
      "Restore your old photos in seconds with AI. No subscription.",
    images: [getOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "How much does it cost to restore an old photo?",
    answer:
      "One restoration costs one credit. Credit packs are one-time payments from \u20ac9.99 for 20 photos to \u20ac29.99 for 120 photos (\u20ac0.25 each), and credits never expire. A failed restoration costs no credit.",
  },
  {
    question: "What makes old photos blurry?",
    answer:
      "Old photos become blurry due to several factors: film grain from lower-quality film stock, physical degradation of the photo paper over decades, poor scanning quality (low DPI), and digital compression when photos were digitized. GFPGAN addresses blurriness in faces specifically by reconstructing facial detail from high-resolution face priors.",
  },
  {
    question: "Does AI restoration work on black and white photos?",
    answer:
      "Yes. GFPGAN restores and sharpens black and white photos effectively, recovering facial detail and reducing grain. Note that restoration improves sharpness and detail — it does not colorize black and white photos. The restored photo remains black and white but with significantly better clarity.",
  },
  {
    question: "How do I get the best results from old photo restoration?",
    answer:
      "For best results: scan at 600 DPI or higher using a flatbed scanner, ensure faces are clearly visible and not cropped out, upload as JPEG or PNG at the highest resolution available, and avoid heavily compressed files. The AI works best on portrait-oriented photos where faces are the primary subject.",
  },
  {
    question: "What file formats are supported for old photo restoration?",
    answer:
      "Magic Memory supports JPEG, PNG, and WebP formats up to 10MB per file. For scanned photos, save as JPEG at 90%+ quality or PNG for lossless quality. Avoid heavily compressed JPEGs (below 80% quality) as compression artifacts reduce restoration quality.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos Online",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload Your Old Photo",
      text: "Upload a JPEG, PNG, or WebP photo up to 10MB. Scan at 600 DPI or higher for best results.",
    },
    {
      "@type": "HowToStep",
      name: "AI Restores Faces and Detail",
      text: "GFPGAN analyzes and restores facial features in 5-15 seconds.",
    },
    {
      "@type": "HowToStep",
      name: "Download in Full Resolution",
      text: "Download your restored photo and compare before and after.",
    },
  ],
};

export default function RestoreOldPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Old Photos", url: "/restore-old-photos" },
  ]);
  const softwareJsonLd = useCaseSoftwareJsonLd({
    name: "Magic Memory — Restore Old Photos Online",
    description:
      "Restore old, faded, blurry photos online with GFPGAN AI. One-time credit packs from €9.99, credits never expire.",
    url: "/restore-old-photos",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Old Photos Online With AI"
          subheadline="Find an old photo box and see blurry grandparent photos that deserve better? Magic Memory uses GFPGAN AI to restore faces, recover lost detail, and bring your most important memories back to life in 5–15 seconds. Pay once per photo, with credits that never expire."
          keyword="restore old photos"
        />

        <UseCaseArticle>
          <h2>Why Old Photos Degrade</h2>
          <p>
            Old photos deteriorate for four main reasons: UV exposure breaks
            down dye layers, humidity causes paper warping and mold, physical
            handling creates scratches and creases, and early digitization
            produced low-resolution scans with heavy compression.
          </p>
          <p>
            GFPGAN — developed by researchers at Tencent ARC and published at
            CVPR 2021 — addresses these issues in portraits specifically. It was
            trained on millions of high-resolution face images, giving it the
            ability to reconstruct missing facial detail even when the original
            photo is severely degraded.
          </p>
          <p>
            The model processes your photo in 5–15 seconds, comparing the
            degraded input against its learned model of how faces should look,
            then reconstructing sharp edges, fine texture, and clear features
            that were lost to time.
          </p>

          <h2>Who Needs Old Photo Restoration</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> People who found
              old family photo albums and want to preserve them digitally
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Adults who have
              only one or two photos of grandparents or great-grandparents
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Anyone preparing a
              family reunion display or memorial
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Genealogy
              researchers who want to put faces to names
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> People converting
              physical photo albums to digital archives
            </li>
          </ul>
        </UseCaseArticle>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <UseCaseRelated
          links={[
            { href: "/restore-family-photos", label: "Restore Family Photos" },
            {
              href: "/restore-wedding-photos",
              label: "Restore Wedding Photos",
            },
            {
              href: "/blog/how-to-restore-old-photos",
              label: "How to Restore Old Photos (Guide)",
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
          note="One-time credit packs. Credits never expire. No subscription."
        />
      </main>
      <Footer />
    </div>
  );
}

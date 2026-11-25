import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  faqPageJsonLd,
  breadcrumbJsonLd,
  useCaseSoftwareJsonLd,
} from "@/lib/seo/metadata-helpers";
import { JsonLd } from "@/components/seo/json-ld";
import { UseCaseHero } from "@/components/use-case/use-case-hero";
import { UseCaseHowItWorks } from "@/components/use-case/use-case-how-it-works";
import { UseCaseFAQ } from "@/components/use-case/use-case-faq";
import { UseCaseArticle } from "@/components/use-case/use-case-article";
import { UseCaseRelated } from "@/components/use-case/use-case-related";
import { FinalCta } from "@/components/layout/final-cta";
import { pageMetadata } from "@/lib/seo/page-metadata";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(
  () => import("@/components/header").then((m) => m.Header),
  { ssr: true },
);
const Footer = dynamic(
  () => import("@/components/footer").then((m) => m.Footer),
  { ssr: true },
);

export const metadata: Metadata = pageMetadata({
  path: "/restore-old-photos",
  title: "Restore Old Photos Online: AI Old Photo Restoration",
  description:
    "Restore old photos online with AI: upload a scan and GFPGAN sharpens faces and lost detail, usually in under a minute. From \u20ac0.25 a photo, no subscription.",
  social: {
    title: "Restore Old Photos Online: AI Old Photo Restoration | Magic Memory",
    description:
      "Restore old photos online with AI: upload a scan and GFPGAN sharpens faces and lost detail, usually in under a minute. From \u20ac0.25 a photo, no subscription.",
    imageAlt: "Restore Old Photos",
  },
  twitter: {
    title: "Restore Old Photos Online",
    description: "Restore old photos online with AI, usually in under a minute. No subscription.",
  },
});

const faqs: FAQItem[] = [
  {
    question: "How much does it cost to restore an old photo?",
    answer:
      "One restoration costs one credit. Credit packs are one-time payments from \u20ac9.99 for 20 photos to \u20ac29.99 for 120 photos (\u20ac0.25 each), and credits never expire. A failed restoration costs no credit.",
  },
  {
    question: "Can AI fix scratches, tears and missing pieces in old photos?",
    answer:
      "Not as a separate repair. Magic Memory runs GFPGAN, a face-restoration model: it rebuilds blurred or grainy faces and upscales the whole photo 2x, but it does not remove scratches, creases or stains from the background, fill in torn-off corners, or colorize. For heavy physical damage, a manual retoucher is the better choice.",
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
      text: "GFPGAN analyzes and restores facial features, usually in under a minute.",
    },
    {
      "@type": "HowToStep",
      name: "Compare and Download",
      text: "Compare before and after with the slider, then download the restored photo at twice the original width and height.",
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
      <JsonLd data={[faqJsonLd, breadcrumb, softwareJsonLd, howToJsonLd]} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Old Photos Online With AI"
          subheadline="Upload a scan or phone photo of an old print and Magic Memory's AI (GFPGAN) rebuilds blurred faces, reduces grain and returns a copy at twice the size, usually in under a minute. Each restoration costs one credit, from €0.25 to €0.50 depending on the pack, and a failed restoration costs nothing."
          keyword="restore old photos"
        />

        <UseCaseArticle>
          <h2>Why Old Photos Degrade</h2>
          <p>
            Old photos deteriorate for four main reasons: UV exposure breaks
            down dye layers, humidity causes paper warping and mold, physical
            handling creates scratches and creases, and early digitization
            produced low-resolution scans with heavy compression. Our guide to{" "}
            <Link href="/glossary/photo-restoration">what photo restoration is</Link>{" "}
            covers each type of damage, the repair steps and what each method
            costs.
          </p>
          <p>
            GFPGAN — developed by researchers at Tencent ARC and published at
            CVPR 2021 — addresses these issues in portraits specifically. It was
            trained on FFHQ, a set of 70,000 high-quality face photos, giving it the
            ability to reconstruct missing facial detail even when the original
            photo is severely degraded.
          </p>
          <p>
            The model processes your photo, usually in under a minute, comparing the
            degraded input against its learned model of how faces should look,
            then reconstructing sharp edges, fine texture, and clear features
            that were lost to time.
          </p>

          <h2>What AI Old Photo Restoration Fixes, and What It Does Not</h2>
          <p>
            Magic Memory runs one model, GFPGAN v1.4, at 2x scale. That makes
            it strong on people and honest about the rest:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Fixes: blurred,
              soft or grainy faces, in color and black and white photos
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Fixes: low
              resolution, since the whole photo comes back at twice the width
              and height
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Does not fix:
              scratches, creases, stains or tears outside the faces, or pieces
              of the print that are missing
            </li>
            <li className="flex gap-3">
              <span className="text-ember font-bold">→</span> Does not do:
              colorization. A black and white photo stays black and white
            </li>
          </ul>
          <p>
            If the damage is mostly physical rather than blur, compare{" "}
            <Link href="/glossary/photo-restoration">
              what manual photo restoration costs
            </Link>{" "}
            before you spend a credit.
          </p>

          <h2>What It Costs and What Happens to Your Photo</h2>
          <p>
            Credits come in one-time packs: 20 for €9.99, 60 for €19.99 or
            120 for €29.99, which is €0.50, €0.33 or €0.25 a photo. They
            never expire and there is no subscription. A credit is taken only
            after a restoration succeeds, so a failed or timed-out run costs
            nothing. See <Link href="/pricing">all packs on the pricing page</Link>.
          </p>
          <p>
            Your upload is held in memory and sent to Replicate, the service
            that runs the model. We do not save the original or the restored
            image on our own servers; the{" "}
            <Link href="/privacy">privacy policy</Link> has the details.
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

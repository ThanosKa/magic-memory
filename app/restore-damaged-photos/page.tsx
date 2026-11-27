import { Metadata } from "next";
import dynamic from "next/dynamic";
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
  path: "/restore-damaged-photos",
  title: "Restore Damaged Photos: What AI Can and Cannot Fix",
  description:
    "AI restores the faces in damaged, faded and blurry photos. It does not repair tears, holes or stains elsewhere. See what to expect before you pay.",
  social: {
    title: "Restore Damaged Photos With AI — Magic Memory",
    description:
      "AI restores faces in damaged, faded and blurry photos. No subscription.",
    imageAlt: "Restore Damaged Photos",
  },
  twitter: {
    title: "Restore Damaged Photos With AI",
    description: "AI restores faces in damaged, faded and blurry photos.",
  },
});

const faqs: FAQItem[] = [
  {
    question: "Can AI fix water-damaged photos?",
    answer:
      "Only the faces. Magic Memory runs GFPGAN v1.4, a face restoration model, so a face that water has left blurred or faded can come back sharper. Stains, warping and white patches elsewhere in the picture are not repaired, and where the emulsion is gone there is no original data to recover.",
  },
  {
    question: "Does AI fix torn photos?",
    answer:
      "No. The model does not join tears or fill missing pieces of a photo. It sharpens faces and the picture at 2x, so a torn print is best scanned flat first; a tear that runs through a face gives a reconstructed guess at that face, not the original detail.",
  },
  {
    question: "What types of photo damage respond best to AI restoration?",
    answer:
      "Blur, low resolution and faded or soft faces. Damage that is not on a face, such as scratches, tears, holes, mold or fire damage, is not repaired by this model, and a face that is mostly covered cannot be recovered.",
  },
  {
    question: "Can AI remove scratches from scanned photos?",
    answer:
      "Not reliably. GFPGAN is built to restore faces and does not remove scratches across the frame. For a heavily scratched scan, use dust-and-scratch removal in your scanner software or Photoshop first, then restore the faces.",
  },
  {
    question: "What is the worst type of photo damage for AI restoration?",
    answer:
      "Damage that has destroyed the image itself: mold that has eaten through the photo, fire damage and physical holes. When the original image data no longer exists, the model can only guess, and what it adds to a face is plausible detail rather than the real one.",
  },
  {
    question: "What does it cost, and am I charged if it fails?",
    answer:
      "One credit restores one photo, and credits come in one-time packs with no subscription. A restoration that fails does not use a credit.",
  },
];

export default function RestoreDamagedPhotosPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Damaged Photos", url: "/restore-damaged-photos" },
  ]);
  const softwareJsonLd = useCaseSoftwareJsonLd({
    name: "Magic Memory — Restore Damaged Photos with AI",
    description:
      "Restore the faces in damaged, faded and blurry photos with GFPGAN AI. Does not repair tears, holes or stains elsewhere in the picture. No subscription.",
    url: "/restore-damaged-photos",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[faqJsonLd, breadcrumb, softwareJsonLd]} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Restore Damaged Photos With AI: What It Can and Cannot Fix"
          subheadline="Magic Memory restores the faces in faded, blurry and aged photos with GFPGAN v1.4. It does not mend tears, holes, stains or scratches in the rest of the picture, so check the list below before you pay. One-time credits, no subscription."
          keyword="restore damaged photos"
        />

        <UseCaseArticle>
          <h2>What Damage Types AI Can Address</h2>
          <div className="space-y-4">
            {[
              {
                type: "Blur and loss of sharpness on faces",
                outcome: "Yes: GFPGAN's main job",
              },
              {
                type: "Low-resolution scans",
                outcome: "Yes: output is 2x the original size",
              },
              {
                type: "Faded, soft faces",
                outcome: "Often improves face detail",
              },
              {
                type: "Water staining on faces",
                outcome: "Depends on severity",
              },
              {
                type: "Scratches, tears and holes",
                outcome: "No: not repaired by this model",
              },
              {
                type: "Mold or fire destroying the image",
                outcome: "No: there is no original data to recover",
              },
            ].map((item) => (
              <div
                key={item.type}
                className="flex justify-between gap-4 border-b border-border pb-3 last:border-0"
              >
                <span className="font-medium">{item.type}</span>
                <span className="text-sm text-paper/70 text-right">
                  {item.outcome}
                </span>
              </div>
            ))}
          </div>

          <h2>Honest Limitations</h2>
          <p>
            GFPGAN is a face restoration model. It does not remove scratches,
            join tears or fill holes. For a photo
            with that kind of damage, repair the damage first in scanner
            software or an editor, then restore the faces here. Where a face is
            missing or mostly covered, the model reconstructs a plausible face
            rather than the original one. One credit restores one photo and a
            failed restoration does not use a credit.
          </p>
        </UseCaseArticle>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <UseCaseRelated
          links={[
            { href: "/restore-old-photos", label: "Restore Old Photos" },
            { href: "/restore-faded-photos", label: "Fix Faded Photos" },
            { href: "/fix-blurry-photos", label: "Fix Blurry Photos" },
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

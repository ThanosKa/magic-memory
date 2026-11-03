import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd, useCaseSoftwareJsonLd } from "@/lib/seo/metadata-helpers";
import { UseCaseHero } from "@/components/use-case/use-case-hero";
import { UseCaseHowItWorks } from "@/components/use-case/use-case-how-it-works";
import { FinalCta } from "@/components/layout/final-cta";
import { UseCaseArticle } from "@/components/use-case/use-case-article";
import { UseCaseRelated } from "@/components/use-case/use-case-related";
import { UseCaseFAQ } from "@/components/use-case/use-case-faq";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

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
  const softwareJsonLd = useCaseSoftwareJsonLd({
    name: "Magic Memory — Enhance Old Photos with AI",
    description:
      "Improve clarity and detail of old photos with GFPGAN AI. Sharpens faces, recovers texture, and enhances quality in 5–15 seconds. 1 free per day.",
    url: "/enhance-old-photos",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <Header />
      <main className="flex-1">
        <UseCaseHero
          headline="Enhance Old Photos With AI — Improve Clarity and Detail"
          subheadline="Not every old photo is damaged — some are just not as good as they could be. Magic Memory uses GFPGAN AI to improve the clarity, sharpness, and detail in your portraits, taking photos from acceptable to excellent in under 15 seconds."
          keyword="enhance old photos"
        />

        <UseCaseArticle>
          <h2>Enhancement vs. Restoration</h2>
          <p>
            The distinction matters practically. If you are searching for photo enhancement, you likely have a photo that is okay but not great — perhaps slightly soft, lacking fine detail, or below the quality you want for printing or sharing.
          </p>
          <p>
            GFPGAN does both at once. It recovers lost detail from degradation (restoration) and improves the apparent sharpness and quality of the face (enhancement). For most photos, this means faces go from looking like old photographs to looking like modern, sharp portraits.
          </p>

          <h2>Who Enhances Old Photos</h2>
          <ul className="list-disc pl-5">
            <li>People digitizing photo albums who want the best possible quality</li>
            <li>Anyone printing photos larger than 5x7 and needing sharp source material</li>
            <li>Genealogists building visual family histories</li>
            <li>People creating memorial displays or tribute books</li>
          </ul>
        </UseCaseArticle>

        <UseCaseHowItWorks />
        <UseCaseFAQ faqs={faqs} />

        <UseCaseRelated
          links={[
            { href: "/fix-blurry-photos", label: "Fix Blurry Photos" },
            { href: "/restore-old-photos", label: "Restore Old Photos" },
            { href: "/restore-portrait-photos", label: "Restore Portrait Photos" },
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

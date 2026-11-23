import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import type { FAQItem } from "@/lib/seo/faq-data";
import { ArticleHeading } from "@/components/layout/article-heading";
import { PageContainer } from "@/components/layout/page-container";
import { FinalCta } from "@/components/layout/final-cta";
import { Button, ButtonArrow } from "@/components/ui/button";
import { CREDIT_PACKAGES, perPhotoPrice } from "@/lib/constants";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = pageMetadata({
  path: "/glossary/photo-restoration",
  title: "What Is Photo Restoration? Definition, Methods, and Tools",
  description:
    "Photo restoration repairs old, faded, blurry or damaged photos. The steps, manual vs AI methods, what each costs per photo, and what AI cannot fix yet.",
  social: {
    title: "What Is Photo Restoration? Definition, Methods, and Tools",
    description: "Learn what photo restoration is, how it works, and which methods produce the best results for old and damaged photographs.",
    imageAlt: "What Is Photo Restoration",
  },
});

const LOWEST_PER_PHOTO = perPhotoPrice(CREDIT_PACKAGES.premium);
const HIGHEST_PER_PHOTO = perPhotoPrice(CREDIT_PACKAGES.starter);

const faqs: FAQItem[] = [
  {
    question: "What is photo restoration?",
    answer:
      "Photo restoration is the process of repairing and enhancing photographs that have been damaged, degraded, or lost quality over time. It includes fixing scratches, tears, fading, discoloration, blur, and missing detail. Traditional restoration is done manually in software like Photoshop. AI restoration uses neural networks to automate the process.",
  },
  {
    question: "How much does professional photo restoration cost?",
    answer:
      `A manual restoration service charges per photo by damage level: as of November 2026, Fixthephoto lists $30, $45 and $60 per photo (plus $12 for each extra person), and FOREVER lists $89.99 per photo. AI tools cost far less per photo: Magic Memory works out at ${LOWEST_PER_PHOTO} to ${HIGHEST_PER_PHOTO} per photo with one-time credit packs, but it restores faces and sharpness only, not tears or missing pieces.`,
  },
  {
    question: "Is AI photo restoration as good as manual restoration?",
    answer:
      "For blurry, faded or low-resolution faces, AI face restoration models like GFPGAN recover sharp features in under a minute, which is the slowest part of manual work. Manual restoration is still the better choice for torn photos, missing sections, stains across the image, and anything that needs creative reconstruction, because a retoucher can rebuild what the photo no longer shows.",
  },
  {
    question: "Can photo restoration fix completely destroyed photos?",
    answer:
      "It depends on the damage. AI restoration can recover faces from severely blurry, faded, or low-resolution photos. However, if facial features are completely obscured — for example, by a tear running through the face or heavy water damage — both AI and manual restoration have limits. The more recognizable the original face, the better the result.",
  },
  {
    question: "What are the steps of photo restoration?",
    answer:
      "Digitize the print with a high-resolution scan, keep that scan as an untouched master copy, assess the damage, repair it on a copy (dust and scratches, tears, fading and color, then blur and faces), and save the result at full resolution. AI tools automate the face and sharpness step; physical damage still needs a retoucher or Photoshop.",
  },
  {
    question: "Does photo restoration damage the original photo?",
    answer:
      "No. Digital photo restoration works on a scan or a photo of the print, so the original stays untouched. Handle old prints by the edges and scan them flat; do not try to clean or flatten a fragile print yourself.",
  },
];

export default function GlossaryPhotoRestorationPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "Photo Restoration", url: "/glossary/photo-restoration" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[faqJsonLd, breadcrumb]} />
      <Header />
      <main className="flex-1">
        <section>
          <PageContainer className="py-20 sm:py-32">
          <div className="max-w-3xl">
            <nav className="font-mono mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="focus-ring rounded-sm hover:text-paper">Home</Link>
              <span>/</span>
              <span className="text-paper">Photo Restoration</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              What Is Photo Restoration?
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              Photo restoration is the process of repairing old, faded, blurry or damaged photographs so they look as close as possible to the original. Today it is done digitally on a scan of the print, either by hand in Photoshop or automatically with AI models like GFPGAN, and it costs anywhere from well under a euro to about $90 per photo depending on the method.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <ArticleHeading>Types of Photo Damage</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  Photos degrade through several mechanisms, each requiring different restoration approaches:
                </p>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Fading</strong> — UV light breaks down dyes and pigments over decades, causing colors to wash out and contrast to drop</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Blur and softness</strong> — Early cameras, low-quality lenses, motion during exposure, or low-resolution scanning produce soft or blurry images</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Scratches and tears</strong> — Physical handling, improper storage, or accidents create surface damage on prints</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Water and mold damage</strong> — Humidity and flooding cause warping, staining, and biological growth on photo paper</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Compression artifacts</strong> — Photos digitized in the early internet era were often saved as low-quality JPEGs, introducing blocky artifacts</li>
                </ul>
              </div>

              <div>
                <ArticleHeading>Photo Restoration Steps</ArticleHeading>
                <ol className="space-y-3 text-paper/70 list-decimal pl-5">
                  <li><strong className="text-paper">Digitize.</strong> Scan the print flat at a high resolution, or photograph it in even light without glare. Every later step depends on this copy.</li>
                  <li><strong className="text-paper">Keep a master.</strong> Save the untouched scan and work only on copies, so you can always start again.</li>
                  <li><strong className="text-paper">Assess the damage.</strong> Note what you see: fading, blur, dust and scratches, tears, stains, missing corners. Each needs a different fix.</li>
                  <li><strong className="text-paper">Repair physical damage.</strong> Remove dust and scratches, close tears and fill missing areas. This is manual work in Photoshop or GIMP.</li>
                  <li><strong className="text-paper">Correct tone and color.</strong> Restore contrast lost to fading and remove color casts.</li>
                  <li><strong className="text-paper">Restore faces and sharpness.</strong> Recover blurry facial detail and upscale the image. This is the step AI does best.</li>
                  <li><strong className="text-paper">Save and back up.</strong> Export at full resolution and keep copies in more than one place.</li>
                </ol>
                <p className="text-paper/70 mt-4">
                  For a full walkthrough with tools for each step, see{" "}
                  <Link href="/blog/how-to-restore-old-photos" className="text-paper underline underline-offset-4 hover:text-ember">how to restore old photos</Link>{" "}
                  and our{" "}
                  <Link href="/blog/restore-old-family-photos-tips" className="text-paper underline underline-offset-4 hover:text-ember">tips for restoring old family photos</Link>.
                </p>
              </div>

              <div>
                <ArticleHeading>Manual vs AI Photo Restoration</ArticleHeading>
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-paper mb-3">Manual Restoration</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Done in Photoshop or GIMP by a skilled retoucher</li>
                        <li>- Can fix complex damage (tears, missing sections)</li>
                        <li>- Takes hours to days per photo</li>
                        <li>- Services charge about $30 to $90 per photo</li>
                        <li>- Results depend on the retoucher&apos;s skill</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-paper mb-3">AI Restoration</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Uses neural networks (GFPGAN, CodeFormer)</li>
                        <li>- Excels at face detail and sharpness</li>
                        <li>- Processes in under a minute</li>
                        <li>- Costs well under a euro per photo</li>
                        <li>- Does not repair tears or missing sections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <ArticleHeading>How Much Photo Restoration Costs</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  Prices below are taken from each provider&apos;s own page on 23 November 2026. Service prices are in US dollars; Magic Memory prices come from its credit packs.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-paper/10">
                        <th className="py-2 pr-4 text-left font-semibold">Method</th>
                        <th className="py-2 pr-4 text-left font-semibold">Price per photo</th>
                        <th className="py-2 text-left font-semibold">Fixes</th>
                      </tr>
                    </thead>
                    <tbody className="text-paper/70">
                      <tr className="border-b border-paper/10">
                        <td className="py-2 pr-4 font-medium text-paper">
                          <a href="https://fixthephoto.com/services/old-damaged-photo-restoration" rel="noopener noreferrer" target="_blank" className="underline underline-offset-4 hover:text-ember">Fixthephoto</a> (manual service)
                        </td>
                        <td className="py-2 pr-4">$30 / $45 / $60 by damage level, +$12 per extra person</td>
                        <td className="py-2">Faces, tears, stains, missing areas</td>
                      </tr>
                      <tr className="border-b border-paper/10">
                        <td className="py-2 pr-4 font-medium text-paper">
                          <a href="https://www.forever.com/photo-restoration-and-colorization" rel="noopener noreferrer" target="_blank" className="underline underline-offset-4 hover:text-ember">FOREVER</a> (manual service)
                        </td>
                        <td className="py-2 pr-4">$89.99</td>
                        <td className="py-2">Faces, tears, stains, missing areas</td>
                      </tr>
                      <tr className="border-b border-paper/10">
                        <td className="py-2 pr-4 font-medium text-paper">Photoshop yourself</td>
                        <td className="py-2 pr-4">Adobe subscription plus your time</td>
                        <td className="py-2">Anything, if you have the skill</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-paper">Magic Memory (AI)</td>
                        <td className="py-2 pr-4">{LOWEST_PER_PHOTO} to {HIGHEST_PER_PHOTO}, one-time packs</td>
                        <td className="py-2">Blurry and faded faces, 2x upscale</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <ArticleHeading>How AI Photo Restoration Works</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  AI photo restoration models like GFPGAN use generative adversarial networks (GANs). GFPGAN was trained on FFHQ, a dataset of 70,000 high-quality face photos. The model learns what faces should look like at high quality, then applies that knowledge to reconstruct degraded faces.
                </p>
                <p className="text-paper/70 mb-4">
                  The process works in three stages: the model detects and aligns faces in the input photo, generates a high-quality version of each face using its learned priors, then blends the restored face back into the original image while preserving the surrounding context.
                </p>
                <p className="text-paper/70">
                  This approach is particularly effective for portraits and family photos where faces are the most important element. The model can recover fine details like wrinkles, hair texture, and eye reflections that were completely lost in the degraded original. To see what that looks like on real damage types, read{" "}
                  <Link href="/blog/photo-restoration-before-after" className="text-paper underline underline-offset-4 hover:text-ember">photo restoration before and after</Link>.
                </p>
              </div>

              <div>
                <ArticleHeading>What Magic Memory Does and Does Not Do</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  Magic Memory runs GFPGAN v1.4 and returns your photo at twice the resolution with restored faces. Be clear about its limits before you buy:
                </p>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <span><strong className="text-paper">It does:</strong> sharpen blurry and soft faces, recover facial detail in faded or low-resolution photos, and{" "}<Link href="/enhance-old-photos" className="text-paper underline underline-offset-4 hover:text-ember">enhance old photos</Link> with a 2x upscale.</span></li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <span><strong className="text-paper">It does not:</strong> colorize black-and-white photos, remove scratches or creases as a separate step, or rebuild torn or missing areas.</span></li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <span><strong className="text-paper">Input:</strong> one JPEG, PNG or WebP photo at a time, up to 10 MB.</span></li>
                </ul>
              </div>

              <div>
                <ArticleHeading>When to Use Each Method</ArticleHeading>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">AI restoration</strong> — Best for face-focused photos that are blurry, faded, or low resolution. Fast and affordable.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Manual restoration</strong> — Best for photos with physical tears, missing corners, or complex non-face damage that requires creative reconstruction.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Both combined</strong> — For valuable photos with both face degradation and physical damage, use AI for the faces and manual for structural repairs.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Try AI Photo Restoration</h2>
              <p className="text-paper/70 mb-4">
                Magic Memory uses GFPGAN to restore faces in old and damaged photos. Upload a photo, get a restored version in under a minute. One-time credit packs from {"\u20ac"}9.99 for 20 restorations.
              </p>
              <Button asChild>
                <Link href="/restore">
                  Restore a photo now
                  <ButtonArrow />
                </Link>
              </Button>
            </div>

            <h2 className="font-serif text-4xl tracking-[-0.01em] text-paper mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-paper/10 pb-4 last:border-0">
                  <h3 className="font-semibold text-paper mb-2">{faq.question}</h3>
                  <p className="text-paper/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-paper/70">
              <Link href="/glossary/gfpgan" className="hover:text-paper">What Is GFPGAN?</Link>
              <Link href="/glossary/face-restoration" className="hover:text-paper">What Is Face Restoration?</Link>
              <Link href="/glossary/image-upscaling" className="hover:text-paper">What Is Image Upscaling?</Link>
              <Link href="/restore-old-photos" className="hover:text-paper">Restore Old Photos</Link>
              <Link href="/enhance-old-photos" className="hover:text-paper">Enhance Old Photos</Link>
              <Link href="/blog/how-to-restore-old-photos" className="hover:text-paper">How to Restore Old Photos</Link>
            </div>
          </div>
          </PageContainer>
        </section>

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

import Image from "next/image";
import Link from "next/link";

export function PhotoRestorationBeforeAfterContent() {
  return (
    <>
      <div className="not-prose rounded-xl border border-border bg-muted/30 p-6 mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">What This Page Shows</p>
        <p className="text-muted-foreground">
          Real before-and-after examples of AI photo restoration using Magic Memory. Understand what the AI changes, what to expect realistically, and how to get results like these.
        </p>
      </div>

      <h2>Before and After: Portrait Restoration</h2>
      <p>
        The example below shows a typical old couple portrait — the kind of photo found in family albums from the mid-20th century. The original shows visible softness, reduced contrast, and loss of fine facial detail characteristic of aged photo paper.
      </p>

      <div className="not-prose grid grid-cols-2 gap-4 my-8">
        <div>
          <p className="text-center text-sm font-medium text-muted-foreground mb-2">Before</p>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src="/couple-before.jpg"
              alt="Original old photo before AI restoration — couple portrait showing degradation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 400px"
            />
          </div>
        </div>
        <div>
          <p className="text-center text-sm font-medium text-muted-foreground mb-2">After</p>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src="/couple-after.png"
              alt="Photo after AI restoration — same couple portrait with restored facial detail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 400px"
            />
          </div>
        </div>
      </div>

      <h2>What Changed in This Example</h2>
      <p>
        Looking at this before-and-after, the AI made several specific improvements:
      </p>
      <ul>
        <li><strong>Facial sharpness:</strong> Both faces went from soft and indistinct to clearly defined with visible fine detail</li>
        <li><strong>Eye detail:</strong> Eyelashes, iris texture, and catchlights became visible in the restored version</li>
        <li><strong>Skin texture:</strong> Natural skin texture was recovered where the original showed a waxy, smooth appearance from grain suppression</li>
        <li><strong>Hair detail:</strong> Individual hair strands became distinguishable where they were previously blended into a soft mass</li>
        <li><strong>Contrast:</strong> Facial contrast improved, making the subjects look three-dimensional rather than flat</li>
      </ul>

      <h2>What the AI Does Not Change</h2>
      <p>
        Honest expectations matter. Here is what GFPGAN does not address in this example:
      </p>
      <ul>
        <li><strong>Background quality:</strong> The background detail improved only modestly — GFPGAN focuses on faces</li>
        <li><strong>Color accuracy:</strong> The color cast (yellowing, fading) of the original is partially improved but not fully corrected — full color restoration requires additional processing</li>
        <li><strong>Composition:</strong> The AI does not crop, rotate, or reframe the photo</li>
        <li><strong>Physical damage:</strong> This photo did not have severe physical damage — for torn or mold-damaged photos, results vary more</li>
      </ul>

      <h2>Types of Photos That Restore Well</h2>

      <h3>Close-up portraits</h3>
      <p>
        The best results come from portraits where one or two faces fill most of the frame. GFPGAN has the most information to work with, and the improvement is most visible. School photos, formal portraits, and headshots are ideal.
      </p>

      <h3>Black and white vintage photos</h3>
      <p>
        Black and white photos from the 1920s–1960s often have significant film grain and loss of fine detail. GFPGAN removes grain while recovering facial structure, with dramatic before-and-after differences common in this category.
      </p>

      <h3>Faded color photos from the 1970s–1990s</h3>
      <p>
        The color cast common in photos from this era is partially addressed. More importantly, the facial sharpness improvement is typically excellent regardless of the color issues.
      </p>

      <h2>Types of Photos That Restore Less Well</h2>
      <ul>
        <li><strong>Group shots where faces are small:</strong> If each face is only 30–50 pixels wide in the source, there is limited detail to work with</li>
        <li><strong>Severe physical damage crossing faces:</strong> Tears, mold, or burns through the face area produce interpretive reconstruction rather than accurate restoration</li>
        <li><strong>Photos without faces:</strong> Landscapes, architecture, still life — GFPGAN&apos;s improvements in non-face areas are minimal</li>
        <li><strong>Profile shots with one eye hidden:</strong> Results are decent but less dramatic than frontal or three-quarter portraits</li>
      </ul>

      <h2>How to Get Results Like This</h2>
      <ol>
        <li><strong>Scan at 600 DPI minimum.</strong> Higher resolution input produces more detailed output.</li>
        <li><strong>Ensure faces are the main subject.</strong> Crop to just the face area if needed before uploading.</li>
        <li><strong>Use a high-quality file format.</strong> JPEG at 90%+ quality or PNG — avoid heavily compressed files.</li>
        <li><strong>Clean your scanner before scanning.</strong> Dust on the scanner glass creates spots in the scan that the AI has to work around.</li>
        <li><strong>Upload the clearest copy you have.</strong> If you have multiple versions of the same photo, upload the least damaged one.</li>
      </ol>

      <h2>Frequently Asked Questions</h2>

      <h3>Can I see more before-and-after examples?</h3>
      <p>
        The best way to see results is to try it yourself — sign in and use your free daily restoration. The comparison slider in Magic Memory shows your own before-and-after immediately after processing.
      </p>

      <h3>How does Magic Memory compare to Photoshop for photo restoration?</h3>
      <p>
        See our detailed comparison: <Link href="/blog/ai-photo-restoration-vs-photoshop" className="text-primary hover:underline">AI Photo Restoration vs Photoshop</Link>. Short answer: for portrait restoration, AI is faster and requires no skill. For complex non-face restoration or creative retouching, Photoshop offers more control.
      </p>

      <h3>Does the quality depend on how old the photo is?</h3>
      <p>
        Not directly — it depends on how degraded the photo is, regardless of age. A well-preserved 80-year-old photo can produce better restoration results than a poorly stored 30-year-old photo. Condition matters more than age.
      </p>

      <div className="not-prose mt-8">
        <p className="text-sm text-muted-foreground">
          See also: <Link href="/restore-old-photos" className="text-primary hover:underline">Restore Old Photos Online</Link> · <Link href="/restore-portrait-photos" className="text-primary hover:underline">AI Portrait Restoration</Link>
        </p>
      </div>
    </>
  );
}

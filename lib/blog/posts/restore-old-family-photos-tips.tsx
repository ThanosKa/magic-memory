import Link from "next/link";

export function RestoreOldFamilyPhotosTipsContent() {
  return (
    <>
      <div className="not-prose rounded-xl border border-border bg-muted/30 p-6 mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Quick Summary</p>
        <p className="text-muted-foreground">
          Scan at 600 DPI minimum, clean the scanner glass, sort photos by condition before uploading, use AI for portrait restoration, and back up to at least two separate storage locations.
        </p>
      </div>

      <h2>Why Family Photos Deteriorate</h2>
      <p>
        Family photos typically degrade faster than professional photographs because they were made to be affordable, not archival. Consumer color photo paper from the 1960s through 1990s used dye processes that fade significantly within 25–50 years under typical home storage conditions.
      </p>
      <p>
        The specific degradation timeline: a color photo stored in an album in a humid attic can lose meaningful dye density within 10–15 years. A black and white photo stored in cool, dry conditions can remain stable for over 100 years. The storage environment matters enormously.
      </p>

      <h2>Scanning Tips Before Restoration</h2>

      <h3>Equipment</h3>
      <p>
        A flatbed scanner produces significantly better results than photographing prints with a phone camera. Recommended: Epson Perfection V39, V550, or V600. These models balance quality and cost ($80–$200).
      </p>
      <p>
        If you only have a phone, photograph prints in natural daylight — hold the phone directly above the photo, ensuring the camera is parallel to the photo surface. This prevents the distortion that occurs when photographing at an angle.
      </p>

      <h3>DPI Settings</h3>
      <ul>
        <li><strong>4&times;6 or larger photos:</strong> 600 DPI minimum, 1200 DPI preferred</li>
        <li><strong>Smaller than 4&times;6:</strong> 1200–2400 DPI</li>
        <li><strong>Slides and negatives:</strong> 2400–4800 DPI (requires a dedicated film scanner or adapter)</li>
      </ul>

      <h3>Format and Quality</h3>
      <p>
        Save as TIFF for your archive master (lossless), or JPEG at 90%+ quality as a working copy. PNG is also acceptable — it is lossless and produces smaller files than TIFF for photos. Avoid JPEG below 80% quality — compression artifacts reduce AI restoration quality.
      </p>

      <h2>How to Organize Your Project</h2>

      <p>
        A family photo restoration project can quickly become overwhelming if not organized. A simple system:
      </p>

      <ol>
        <li><strong>Sort by condition:</strong> Separate into three piles — excellent condition (digital backup only needed), moderate degradation (AI restoration will help significantly), severe damage (may need manual restoration or acceptance of limitations).</li>
        <li><strong>Sort by importance:</strong> Within each condition category, prioritize photos of people who have passed, sole existing photos of specific family members, and photos with historical significance.</li>
        <li><strong>Name files systematically:</strong> Use a naming convention like <code>LastName_Year_Description.jpg</code> (e.g., <code>Smith_1955_GrandpaWeddingPortrait.jpg</code>). This makes organizing and searching easier long-term.</li>
        <li><strong>Restore highest priority first:</strong> Use your 1 free daily restoration on the most important photos. Purchase credits when you have a batch to process.</li>
      </ol>

      <h2>Step-by-Step AI Restoration</h2>
      <ol>
        <li>Scan your photo at 600+ DPI and save as JPEG (90%+) or PNG</li>
        <li>Sign in to Magic Memory with Google (1 free restoration per day, no credit card)</li>
        <li>Upload your scanned photo</li>
        <li>Wait 5–15 seconds for the AI to process</li>
        <li>Compare before and after, download the restored version</li>
        <li>Save both the original scan and the restored version</li>
      </ol>

      <h2>How to Store and Share Restored Photos</h2>

      <h3>Digital Storage</h3>
      <p>
        Follow the 3-2-1 rule: 3 copies, on 2 different media types, with 1 copy off-site. Example: original on your computer + external hard drive + cloud storage (Google Photos, iCloud, or Dropbox). Cloud alone is not sufficient — cloud services can close or lose data.
      </p>

      <h3>Physical Prints</h3>
      <p>
        Print restored photos using archival-grade photo paper and pigment-based inks (not dye-based). Services like Bay Photo, Nations Photo Lab, and Mpix offer archival quality printing. Store printed photos in acid-free albums or archival boxes, away from direct sunlight and humidity.
      </p>

      <h3>Sharing with Family</h3>
      <p>
        Google Photos shared albums work well for family photo sharing — they are free, easy for non-technical relatives to use, and allow everyone to add comments and their own photos. For a more structured archive, platforms like SmugMug or Flickr allow organized sharing with family members.
      </p>

      <h2>Gift Ideas with Restored Photos</h2>
      <ul>
        <li><strong>Anniversary gift:</strong> Restore your parents&apos; or grandparents&apos; wedding photo and have it professionally printed and framed</li>
        <li><strong>Memorial tribute:</strong> Restore photos of a recently passed family member for memorial services or tribute books</li>
        <li><strong>Family reunion display:</strong> Create a visual family history display with restored photos spanning multiple generations</li>
        <li><strong>Photo book:</strong> Use a service like Shutterfly or Artifact Uprising to create a hardbound book with restored family photos and captions</li>
        <li><strong>Custom calendar:</strong> Create a family calendar using 12 restored photos with family birthdays and anniversaries marked</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>How do I scan photos that are already in albums?</h3>
      <p>
        Do not force photos out of old albums — adhesive and paper damage can worsen. For loose photos, scan directly. For photos in albums, photograph each page with a phone or use a scanner large enough to accommodate the open album. For photos in magnetic albums, consult a conservator before attempting removal.
      </p>

      <h3>What should I do with photos that have names and dates written on the back?</h3>
      <p>
        Scan both the front and back of the photo. Store the scan of the back alongside the front scan, named identically with &quot;_back&quot; added (e.g., <code>Smith_1955_Portrait_back.jpg</code>). This preserves the handwritten annotations digitally. Transcribe any text into a separate document for searchability.
      </p>

      <h3>Should I restore the same photo multiple times?</h3>
      <p>
        Generally no — one restoration pass with Magic Memory produces the best result. Running a restored image through the AI again typically does not improve quality and may introduce artifacts. If the first restoration is not satisfactory, try cropping to just the face area and restoring that crop separately.
      </p>

      <div className="not-prose mt-8">
        <p className="text-sm text-muted-foreground">
          See also: <Link href="/restore-family-photos" className="text-primary hover:underline">Restore Family Photos</Link> · <Link href="/restore-old-photos" className="text-primary hover:underline">Restore Old Photos Online</Link> · <Link href="/blog/how-to-restore-old-photos" className="text-primary hover:underline">Complete Restoration Guide</Link>
        </p>
      </div>
    </>
  );
}

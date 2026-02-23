import Link from "next/link";

export function HowToRestoreOldPhotosContent() {
  return (
    <>
      <div className="not-prose rounded-xl border border-border bg-muted/30 p-6 mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Definition</p>
        <p className="text-muted-foreground">
          Photo restoration is the process of recovering or improving the quality of degraded photographs — removing blur, grain, fading, and physical damage — using digital tools. AI restoration uses machine learning models trained on millions of images to reconstruct missing or degraded detail automatically.
        </p>
      </div>

      <h2>Why Old Photos Degrade</h2>
      <p>
        Old photographs deteriorate due to four primary causes, each requiring a different restoration approach:
      </p>

      <ol>
        <li><strong>UV light exposure:</strong> Ultraviolet radiation breaks down the dye layers in color photos. Cyan dye fades fastest, causing the characteristic orange-red cast seen in 1970s and 1980s photos. Even indirect sunlight through windows causes significant fading over years.</li>
        <li><strong>Humidity and temperature fluctuations:</strong> Changes in humidity cause photo paper to expand and contract, leading to warping, cracking, and emulsion damage. High humidity encourages mold growth, which physically destroys emulsion layers.</li>
        <li><strong>Physical damage:</strong> Scratches, creases, tears, and adhesive damage from albums. Magnetic albums from the 1970s–1980s are particularly harmful — their adhesives become highly acidic over time and stain photos permanently.</li>
        <li><strong>Poor scanning quality:</strong> Early digitization often used low-DPI scanning (72–150 DPI), resulting in photos that look fine small but are visibly soft and pixelated when printed or viewed at full size.</li>
      </ol>

      <h2>Options for Restoring Old Photos</h2>
      <p>
        You have three main options, each with different costs and tradeoffs:
      </p>

      <h3>1. Professional Restoration Services</h3>
      <p>
        Professional photo restorers manually retouch photos in Photoshop or Lightroom. Results can be excellent. Cost: $25–100 per photo for standard restoration, $100–400 for complex damage. Turnaround: days to weeks. Best for: severe physical damage, tear restoration, or very important single photos where cost is not a constraint.
      </p>

      <h3>2. Manual Photoshop Restoration</h3>
      <p>
        If you have Photoshop skills, you can restore photos manually using clone stamp, healing brush, and adjustment layers. Cost: Photoshop subscription ($20.99/month). Time: 30 minutes to several hours per photo depending on damage. Best for: professionals, people with existing Photoshop skills, complex non-face restoration needs.
      </p>

      <h3>3. AI Photo Restoration</h3>
      <p>
        AI tools like Magic Memory use models trained on millions of photos to automatically restore detail. Cost: free to low cost. Time: 5–15 seconds per photo. Best for: portrait and face-focused photos, batch restoration projects, users without Photoshop skills. Not ideal for: complex physical damage (tears, mold) or non-face areas needing detailed restoration.
      </p>

      <h2>How to Restore Photos with AI: Step by Step</h2>

      <ol>
        <li>
          <strong>Scan your photo at 600 DPI minimum.</strong> Use a flatbed scanner for best results. Clean the scanner glass before scanning. For photos smaller than 4&times;6 inches, use 1200 DPI. Save as JPEG at 90%+ quality or PNG.
        </li>
        <li>
          <strong>Sign in to Magic Memory.</strong> Go to the homepage and sign in with Google. No credit card required — you get 1 free restoration per day.
        </li>
        <li>
          <strong>Upload your photo.</strong> Drag and drop or click to upload. Supported formats: JPEG, PNG, WebP up to 10MB.
        </li>
        <li>
          <strong>Wait 5–15 seconds.</strong> The AI processes your photo and reconstructs facial detail using GFPGAN.
        </li>
        <li>
          <strong>Review and download.</strong> Compare the before and after using the slider. Download your restored photo in full resolution.
        </li>
      </ol>

      <h2>Tips for Getting the Best Results</h2>
      <ul>
        <li><strong>Ensure faces are visible.</strong> GFPGAN focuses on facial restoration — photos where faces are clearly visible (not too small, not heavily obscured) produce the best results.</li>
        <li><strong>Higher resolution input = better output.</strong> A 4000-pixel source photo will produce better results than an 800-pixel scan.</li>
        <li><strong>Clean the scan.</strong> Remove dust from the photo surface and scanner glass before scanning.</li>
        <li><strong>Use the highest quality scan format.</strong> PNG or high-quality JPEG — avoid heavily compressed files.</li>
        <li><strong>Try different crops.</strong> If a full group photo gives mediocre results, crop to just the face(s) you want to restore and process separately.</li>
      </ul>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Scanning at 72 or 96 DPI — this is screen resolution, not print resolution. Use 600+ DPI for photos.</li>
        <li>Over-compressing before uploading — JPEG at 50% quality destroys detail before the AI sees it.</li>
        <li>Expecting AI to fix complete emulsion destruction — if the image layer is physically gone (holes, burnt areas), the AI is reconstructing from nothing.</li>
        <li>Uploading photos where faces are too small — if a face is only 20 pixels wide in the source, GFPGAN has limited information to work with.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>Can I restore old photos for free?</h3>
      <p>
        Yes. Magic Memory gives you 1 free restoration per day, no credit card required. For more restorations, purchase a credit package (€9.99–€29.99) with credits that never expire.
      </p>

      <h3>How do I scan old photos at home?</h3>
      <p>
        Use a flatbed scanner (Epson Perfection series is widely recommended) at 600 DPI. Place the photo face-down on the glass, close the lid, and scan using the scanner software. Save as JPEG (90%+ quality) or PNG.
      </p>

      <h3>Does AI restoration work on all photo types?</h3>
      <p>
        AI restoration using GFPGAN works best on portrait photos where faces are the primary subject. It is less effective on landscapes, architectural photos, or photos where faces are very small or absent.
      </p>

      <h3>Can I restore a photo I only have on my phone?</h3>
      <p>
        Yes. Take a photo of the original print with your phone in good lighting — hold the phone directly above the photo without tilting, use natural light to avoid glare, and ensure the photo fills the frame. Then upload this image to Magic Memory.
      </p>

      <h3>What do I do with the restored photo?</h3>
      <p>
        Download and save the restored version. Back it up to at least two locations (external drive + cloud). Print using a photo print service (Shutterfly, local photo shop) on archival-quality paper for permanent physical copies. Store physical prints in acid-free albums away from direct sunlight.
      </p>

      <div className="not-prose mt-8">
        <p className="text-sm text-muted-foreground">
          See also: <Link href="/restore-old-photos" className="text-primary hover:underline">Restore Old Photos Online</Link> · <Link href="/restore-family-photos" className="text-primary hover:underline">Restore Family Photos</Link> · <Link href="/blog/gfpgan-explained" className="text-primary hover:underline">What is GFPGAN?</Link>
        </p>
      </div>
    </>
  );
}

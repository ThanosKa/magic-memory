import Link from "next/link";
import { Button, ButtonArrow } from "@/components/ui/button";

export function BestAIPhotoRestorationContent() {
  return (
    <>
      <div className="not-prose rounded-xl border border-border bg-muted/30 p-6 mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
          Quick answer (November 2026)
        </p>
        <p className="text-muted-foreground mb-4">
          For a few old family photos, the best AI photo restoration tool is one that is built for faces and does not tie you to a subscription: <strong>Magic Memory</strong> runs the GFPGAN face-restoration model in your browser, costs €9.99 for 20 photos, and its credits never expire. Pick <strong>Remini</strong> if you want a phone app, <strong>MyHeritage Photo Enhancer</strong> if you already research your family tree there, <strong>VanceAI</strong> if you batch-process or also need upscaling, and <strong>Fotor</strong> if you want a full photo editor.
        </p>
        <Button asChild>
          <Link href="/">
            Try Magic Memory
            <ButtonArrow />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          One-time credit packs, no subscription. Competitor pricing re-checked on 2026-11-13 (sources below the table).
        </p>
      </div>

      <h2>What is AI photo restoration?</h2>
      <p>
        AI photo restoration is the use of a trained neural network to reconstruct facial detail, sharpen edges, and reduce noise in damaged or low-resolution photographs. Two kinds of model dominate: <strong>GFPGAN</strong> (Generative Facial Prior GAN, Tencent ARC, CVPR 2021), an open face-restoration model, and the proprietary models used by commercial apps like Remini. Both attempt the same job: take a degraded face and output a plausible, sharp version of it. See our deep dive on <Link href="/glossary/face-restoration" className="text-primary hover:underline">how face restoration actually works</Link>.
      </p>

      <div className="not-prose overflow-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Tool</th>
              <th className="px-4 py-3 text-left font-semibold">How you pay</th>
              <th className="px-4 py-3 text-left font-semibold">Free option</th>
              <th className="px-4 py-3 text-left font-semibold">Platform</th>
              <th className="px-4 py-3 text-left font-semibold">Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-primary">Magic Memory</td>
              <td className="px-4 py-3 text-muted-foreground">One-time packs: €9.99 for 20, €19.99 for 60, €29.99 for 120 (€0.25/photo). Credits never expire.</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
              <td className="px-4 py-3 text-muted-foreground">Web</td>
              <td className="px-4 py-3 text-muted-foreground">Faces in a few family photos, privacy</td>
            </tr>
            <tr className="border-b border-border bg-muted/20">
              <td className="px-4 py-3 font-medium">Remini</td>
              <td className="px-4 py-3 text-muted-foreground">In-app subscription (weekly and monthly options)</td>
              <td className="px-4 py-3 text-muted-foreground">Check in the app</td>
              <td className="px-4 py-3 text-muted-foreground">iOS app, web</td>
              <td className="px-4 py-3 text-muted-foreground">Phone users</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium">MyHeritage Photo Enhancer</td>
              <td className="px-4 py-3 text-muted-foreground">Photo subscription (all AI photo tools) or a genealogy plan that includes it</td>
              <td className="px-4 py-3 text-muted-foreground">Free sign-up; no published free limit</td>
              <td className="px-4 py-3 text-muted-foreground">Web, mobile app</td>
              <td className="px-4 py-3 text-muted-foreground">Genealogy researchers</td>
            </tr>
            <tr className="border-b border-border bg-muted/20">
              <td className="px-4 py-3 font-medium">VanceAI</td>
              <td className="px-4 py-3 text-muted-foreground">Monthly credits, from $15/mo billed yearly (260 credits)</td>
              <td className="px-4 py-3 text-muted-foreground">10 credits to try</td>
              <td className="px-4 py-3 text-muted-foreground">Web, Windows</td>
              <td className="px-4 py-3 text-muted-foreground">Pros, batch work, upscaling</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Fotor</td>
              <td className="px-4 py-3 text-muted-foreground">Pro, Pro+ and Max subscriptions</td>
              <td className="px-4 py-3 text-muted-foreground">Free Basic plan with limited credits</td>
              <td className="px-4 py-3 text-muted-foreground">Web, Windows, Mac, iOS, Android</td>
              <td className="px-4 py-3 text-muted-foreground">People who also want a full editor</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3">
          As of 2026-11-13. Magic Memory: our own price list. VanceAI: vanceai.com/pricing. MyHeritage: its help article on the Photo subscription, which gives unlimited Photo Enhancer use and points to the plans page for the price. Fotor: fotor.com/pricing, which showed the plans but no prices when we checked. Remini: no public price page; its App Store listing shows weekly and monthly subscriptions, and it also runs at app.remini.ai. Prices change, so confirm on each vendor&apos;s site before you buy.
        </p>
      </div>

      <h2>What makes a good AI photo restoration tool</h2>
      <p>
        These are the criteria that matter for most people restoring old photos:
      </p>
      <ul>
        <li><strong>Restoration quality on faces:</strong> Does the AI actually recover facial detail or just apply generic sharpening?</li>
        <li><strong>Pricing model:</strong> Subscription vs. one-time payment. For occasional users, a subscription you forget to cancel costs more than the photos.</li>
        <li><strong>Privacy:</strong> Does the tool keep your photos in a cloud library?</li>
        <li><strong>Ease of use:</strong> Is it upload-and-done, or does it require technical knowledge?</li>
        <li><strong>Platform:</strong> Web vs. mobile app vs. desktop software.</li>
      </ul>

      <h2>The 5 Best AI Photo Restoration Tools (2026)</h2>

      <h3>1. Magic Memory — Best for Web-Based Portrait Restoration</h3>
      <p>
        Magic Memory uses <Link href="/glossary/gfpgan" className="text-primary hover:underline">GFPGAN</Link> v1.4 (Generative Facial Prior GAN), a model published at CVPR 2021 by researchers at Tencent ARC, and returns the photo at twice its original resolution. It is one of the strongest openly available models for <Link href="/glossary/face-restoration" className="text-primary hover:underline">face-specific restoration</Link>.
      </p>
      <ul>
        <li><strong>Best for:</strong> Portrait and family photo restoration, occasional users, privacy-conscious users</li>
        <li><strong>Pricing:</strong> €9.99–€29.99 one-time credit packs that never expire; no free tier</li>
        <li><strong>Effective cost:</strong> €0.50/photo on the smallest pack, €0.25/photo on the €29.99 / 120-credit pack; a failed restoration costs no credit</li>
        <li><strong>Platform:</strong> Web — works on any device, no app required</li>
        <li><strong>Processing time:</strong> usually under a minute</li>
        <li><strong>Privacy:</strong> your upload is processed in memory and never stored on our servers</li>
        <li><strong>Limitation:</strong> Face-focused — no colorization, and less effective on photos without faces</li>
      </ul>

      <h3>2. Remini — Best for Mobile Users</h3>
      <p>
        Remini is a widely used AI photo enhancer, best known as a phone app. It uses a proprietary model with strong face enhancement. For a full side-by-side, see our <Link href="/vs/remini" className="text-primary hover:underline">Magic Memory vs Remini comparison</Link>.
      </p>
      <ul>
        <li><strong>Best for:</strong> Phone users who want an app</li>
        <li><strong>Pricing:</strong> In-app subscription with weekly and monthly options; check the current price in the app</li>
        <li><strong>Platform:</strong> iOS app and a web version (app.remini.ai)</li>
        <li><strong>Limitation:</strong> A recurring subscription is poor value if you only have a few photos</li>
      </ul>

      <h3>3. MyHeritage Photo Enhancer — Best for Genealogy Users</h3>
      <p>
        MyHeritage puts photo enhancement inside a genealogy platform. Its Photo subscription unlocks all of its AI photo tools (Photo Enhancer, colorization, Photo Repair, animation), and some genealogy plans include it too. If you only want photo restoration, see the <Link href="/alternatives/myheritage" className="text-primary hover:underline">MyHeritage Photo Enhancer alternative breakdown</Link>, or our <Link href="/vs/myheritage" className="text-primary hover:underline">Magic Memory vs MyHeritage comparison</Link>.
      </p>
      <ul>
        <li><strong>Best for:</strong> Active genealogy researchers who also want photo restoration</li>
        <li><strong>Pricing:</strong> Photo subscription or a plan that includes it; prices are on MyHeritage&apos;s plans page</li>
        <li><strong>Free tier:</strong> Sign-up is free; MyHeritage does not publish a free-use limit</li>
        <li><strong>Platform:</strong> Web and mobile app</li>
        <li><strong>Limitation:</strong> A recurring plan for what is often a one-off job</li>
      </ul>

      <h3>4. VanceAI — Best for Professionals</h3>
      <p>
        VanceAI is a professional AI image suite with restoration, <Link href="/glossary/image-upscaling" className="text-primary hover:underline">upscaling</Link>, background removal, colorization, and more. The interface is more complex but gives more control. Compare features head-to-head in our <Link href="/vs/vanceai" className="text-primary hover:underline">Magic Memory vs VanceAI breakdown</Link>.
      </p>
      <ul>
        <li><strong>Best for:</strong> Professionals needing several AI image tools and batch processing</li>
        <li><strong>Pricing:</strong> Monthly credit plans from $15/month billed yearly (Starter, 260 credits a month), as of 2026-11-13</li>
        <li><strong>Free tier:</strong> 10 credits to try</li>
        <li><strong>Platform:</strong> Web, plus a Windows desktop app</li>
        <li><strong>Limitation:</strong> More than you need for one-click face restoration</li>
      </ul>

      <h3>5. Fotor — Best for General Photo Editing</h3>
      <p>
        Fotor is a general photo editor that includes <Link href="/glossary/ai-photo-enhancement" className="text-primary hover:underline">AI enhancement features</Link>. If you need a full editor with AI assistance — not just restoration — Fotor covers a broader range of editing needs. See the <Link href="/alternatives" className="text-primary hover:underline">full alternatives comparison</Link> for Fotor&apos;s tradeoffs.
      </p>
      <ul>
        <li><strong>Best for:</strong> People who want a full photo editor with some AI enhancement</li>
        <li><strong>Pricing:</strong> Free Basic plan with limited credits; Pro, Pro+ and Max subscriptions</li>
        <li><strong>Platform:</strong> Web, Windows, Mac, iOS and Android</li>
        <li><strong>Limitation:</strong> AI restoration is less specialized than GFPGAN-based tools</li>
      </ul>

      <h2>Recommendation by use case</h2>
      <ul>
        <li><strong>One-time use, restoring a few family photos:</strong> Magic Memory — €9.99 for 20 photos, credits never expire, no subscription</li>
        <li><strong>Phone user who wants an app:</strong> Remini</li>
        <li><strong>Genealogy researcher:</strong> MyHeritage — worth it if you already use the platform</li>
        <li><strong>Professional needing multiple tools:</strong> VanceAI — most capable but most complex</li>
        <li><strong>Privacy-conscious user:</strong> Magic Memory — photos are never stored on our servers</li>
        <li><strong>Lowest per-photo cost without a subscription:</strong> Magic Memory — €0.25/photo on the €29.99 / 120-credit pack</li>
      </ul>

      <h2>Frequently asked questions</h2>

      <h3>What are the most popular AI photo restoration tools in 2026?</h3>
      <p>
        Five tools cover most needs in 2026: Remini (best known as a phone app), MyHeritage Photo Enhancer (part of a genealogy platform), VanceAI (professional multi-tool suite), Magic Memory (GFPGAN, web-first, one-time credits), and Fotor (general photo editor with AI enhancement). Together they span one-off family photos to batch professional jobs.
      </p>

      <h3>What is the best free AI photo restoration tool in 2026?</h3>
      <p>
        Magic Memory has no free tier: restorations use one-time credits from €9.99 for 20, and a failed restoration costs no credit. Of the others, VanceAI gives 10 credits to try, Fotor has a free Basic plan with limited credits, and MyHeritage has free sign-up but does not publish a free-use limit.
      </p>

      <h3>What is the cheapest AI photo restoration for 20+ photos?</h3>
      <p>
        Magic Memory&apos;s €29.99 / 120-credit pack works out to €0.25 per photo, and €9.99 buys 20 photos; credits never expire. Remini and MyHeritage sell recurring subscriptions, so their cost per photo depends on how many photos you restore before you cancel.
      </p>

      <h3>Which tool works without downloading an app?</h3>
      <p>
        All five work in a web browser, so you can restore a photo without installing anything. Remini, MyHeritage, and Fotor also have mobile apps.
      </p>

      <h3>What are the features of popular AI photo restoration tools?</h3>
      <p>
        Across the top tools, the common features are: face-specific restoration (sharper eyes, recovered skin texture, repaired teeth/hair detail), upscaling (output at 2x or 4x the input resolution), and damage repair (scratches, tears, fading). Higher-tier tools additionally offer colorization of black-and-white photos, batch processing, and integration with family-tree or social-media workflows. The single most important differentiator is whether the model is face-specialized (GFPGAN-based) or general-purpose (most commercial offerings).
      </p>

      <h3>Are AI photo restoration results permanent?</h3>
      <p>
        Yes. The restored photo you download is a permanent image file. It does not degrade or change after you download it. Save multiple copies in different locations for long-term preservation.
      </p>


      <div className="not-prose mt-10 rounded-2xl border border-border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold mb-4">Related deep-dives</h3>
        <div className="grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <p className="font-semibold text-foreground mb-2">Head-to-head comparisons</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link href="/vs/remini" className="text-primary hover:underline">Magic Memory vs Remini</Link></li>
              <li><Link href="/vs/myheritage" className="text-primary hover:underline">Magic Memory vs MyHeritage</Link></li>
              <li><Link href="/vs/vanceai" className="text-primary hover:underline">Magic Memory vs VanceAI</Link></li>
              <li><Link href="/alternatives" className="text-primary hover:underline">AI photo restoration alternatives compared</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">By photo type</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link href="/restore-old-photos" className="text-primary hover:underline">Restore old photos</Link></li>
              <li><Link href="/restore-family-photos" className="text-primary hover:underline">Restore family photos</Link></li>
              <li><Link href="/fix-blurry-photos" className="text-primary hover:underline">Fix blurry photos</Link></li>
              <li><Link href="/restore-black-and-white-photos" className="text-primary hover:underline">Restore black and white photos</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">How the tech works</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link href="/glossary/gfpgan" className="text-primary hover:underline">What is GFPGAN?</Link></li>
              <li><Link href="/glossary/face-restoration" className="text-primary hover:underline">What is face restoration?</Link></li>
              <li><Link href="/glossary/image-upscaling" className="text-primary hover:underline">What is image upscaling?</Link></li>
              <li><Link href="/blog/gfpgan-explained" className="text-primary hover:underline">GFPGAN explained (blog)</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Ready to restore?</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link href="/pricing" className="text-primary hover:underline">See pricing (one-time credit packs)</Link></li>
              <li><Link href="/for/photographers" className="text-primary hover:underline">For photographers</Link></li>
              <li><Link href="/for/genealogists" className="text-primary hover:underline">For genealogists</Link></li>
              <li><Link href="/restore" className="text-primary hover:underline">Try Magic Memory</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { PageContainer } from "@/components/layout/page-container";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink">
      <PageContainer className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="space-y-5 text-center md:col-span-1 md:text-left">
            <div className="flex items-center gap-2">
              <BrandMark className="text-paper" />
              <span className="font-serif text-[22px] leading-none tracking-[-0.01em] text-paper">Magic Memory</span>
            </div>
            <p className="text-sm leading-relaxed text-paper/60">
              Bring your old photos back to life with AI-powered restoration.
            </p>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Product</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <Link href="/" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Home</Link>
              <Link href="/pricing" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Pricing</Link>
              <Link href="/restore" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore a photo</Link>
              <Link href="/blog" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Blog</Link>
              <Link href="/blog/best-ai-photo-restoration" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Best AI photo restoration 2026</Link>
              <Link href="/blog/ai-photo-restoration-vs-photoshop" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">AI vs Photoshop</Link>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">By photo type</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <Link href="/restore-old-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore old photos</Link>
              <Link href="/restore-family-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore family photos</Link>
              <Link href="/restore-wedding-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore wedding photos</Link>
              <Link href="/restore-vintage-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore vintage photos</Link>
              <Link href="/restore-portrait-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore portrait photos</Link>
              <Link href="/restore-faded-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore faded photos</Link>
              <Link href="/restore-black-and-white-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore B&amp;W photos</Link>
              <Link href="/restore-damaged-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Restore damaged photos</Link>
              <Link href="/fix-blurry-photos" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Fix blurry photos</Link>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Compare</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <Link href="/alternatives" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">All alternatives</Link>
              <Link href="/vs/remini" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">vs Remini</Link>
              <Link href="/vs/myheritage" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">vs MyHeritage</Link>
              <Link href="/vs/vanceai" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">vs VanceAI</Link>
              <Link href="/alternatives/remini" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Remini alternative</Link>
              <Link href="/alternatives/myheritage" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">MyHeritage alternative</Link>
              <Link href="/alternatives/vanceai" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">VanceAI alternative</Link>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Learn</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <Link href="/glossary/photo-restoration" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">What is photo restoration?</Link>
              <Link href="/glossary/gfpgan" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">What is GFPGAN?</Link>
              <Link href="/glossary/face-restoration" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">What is face restoration?</Link>
              <Link href="/glossary/image-upscaling" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">What is image upscaling?</Link>
              <Link href="/glossary/ai-photo-enhancement" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">What is AI photo enhancement?</Link>
              <Link href="/for/photographers" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">For photographers</Link>
              <Link href="/for/genealogists" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">For genealogists</Link>
              <Link href="/for/real-estate" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">For real estate</Link>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Connect</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <a href="https://github.com/ThanosKa/magic-memory" target="_blank" rel="noopener noreferrer" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">GitHub</a>
              <a href="https://twitter.com/KazakisThanos" target="_blank" rel="noopener noreferrer" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Twitter / X</a>
              <a href="mailto:kazakis.th@gmail.com" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Support</a>
              <Link href="/terms" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Terms</Link>
              <Link href="/privacy" className="focus-ring mm-underline text-sm text-paper/70 transition-colors hover:text-paper">Privacy</Link>
            </nav>
          </div>
        </div>

        <div className="mt-14 border-t border-paper/10 pt-8">
          <p className="font-mono text-center text-[11px] uppercase tracking-[0.18em] text-paper/60">
            &copy; 2026 Thaka — All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}

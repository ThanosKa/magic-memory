import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { PageContainer } from "@/components/layout/page-container";

// The underline sits on an inline span so it follows wrapped text line by line
// instead of stretching across the whole column.
function FooterLink({ href, children, ...rest }: React.ComponentProps<"a">) {
  const external = typeof href === "string" && /^(https?:|mailto:)/.test(href);
  const className = "focus-ring group text-sm text-paper/70 transition-colors hover:text-paper";
  const label = <span className="mm-underline">{children}</span>;
  if (external) {
    return (
      <a href={href} className={className} {...rest}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href ?? "/"} className={className}>
      {label}
    </Link>
  );
}

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
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/restore">Restore a photo</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/blog/best-ai-photo-restoration">Best AI photo restoration 2026</FooterLink>
              <FooterLink href="/blog/ai-photo-restoration-vs-photoshop">AI vs Photoshop</FooterLink>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">By photo type</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="/restore-old-photos">Restore old photos</FooterLink>
              <FooterLink href="/restore-family-photos">Restore family photos</FooterLink>
              <FooterLink href="/restore-wedding-photos">Restore wedding photos</FooterLink>
              <FooterLink href="/restore-vintage-photos">Restore vintage photos</FooterLink>
              <FooterLink href="/restore-portrait-photos">Restore portrait photos</FooterLink>
              <FooterLink href="/restore-faded-photos">Restore faded photos</FooterLink>
              <FooterLink href="/restore-black-and-white-photos">Restore B&amp;W photos</FooterLink>
              <FooterLink href="/restore-damaged-photos">Restore damaged photos</FooterLink>
              <FooterLink href="/fix-blurry-photos">Fix blurry photos</FooterLink>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Compare</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="/alternatives">All alternatives</FooterLink>
              <FooterLink href="/vs/remini">vs Remini</FooterLink>
              <FooterLink href="/vs/myheritage">vs MyHeritage</FooterLink>
              <FooterLink href="/vs/vanceai">vs VanceAI</FooterLink>
              <FooterLink href="/alternatives/remini">Remini alternative</FooterLink>
              <FooterLink href="/alternatives/myheritage">MyHeritage alternative</FooterLink>
              <FooterLink href="/alternatives/vanceai">VanceAI alternative</FooterLink>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Learn</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="/glossary/photo-restoration">What is photo restoration?</FooterLink>
              <FooterLink href="/glossary/gfpgan">What is GFPGAN?</FooterLink>
              <FooterLink href="/glossary/face-restoration">What is face restoration?</FooterLink>
              <FooterLink href="/glossary/image-upscaling">What is image upscaling?</FooterLink>
              <FooterLink href="/glossary/ai-photo-enhancement">What is AI photo enhancement?</FooterLink>
              <FooterLink href="/for/photographers">For photographers</FooterLink>
              <FooterLink href="/for/genealogists">For genealogists</FooterLink>
              <FooterLink href="/for/real-estate">For real estate</FooterLink>
            </nav>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">Connect</h3>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <FooterLink href="https://github.com/ThanosKa/magic-memory" target="_blank" rel="noopener noreferrer">GitHub</FooterLink>
              <FooterLink href="https://twitter.com/KazakisThanos" target="_blank" rel="noopener noreferrer">Twitter / X</FooterLink>
              <FooterLink href="mailto:kazakis.th@gmail.com">Support</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
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

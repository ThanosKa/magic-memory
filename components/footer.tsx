import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="space-y-4 text-center md:col-span-1 md:text-left">
            <div className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Magic Memory Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Magic Memory</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bring your old photos back to life with AI-powered restoration.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold">Product</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="/restore"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Magic Memory
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/restore-old-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Restore Old Photos
              </Link>
              <Link
                href="/fix-blurry-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Fix Blurry Photos
              </Link>
            </nav>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold">Compare</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/vs/remini"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                vs Remini
              </Link>
              <Link
                href="/vs/myheritage"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                vs MyHeritage
              </Link>
              <Link
                href="/vs/vanceai"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                vs VanceAI
              </Link>
              <Link
                href="/alternatives/remini"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Remini Alternative
              </Link>
              <Link
                href="/alternatives"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                All Alternatives
              </Link>
            </nav>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold">Resources</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/restore-family-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Restore Family Photos
              </Link>
              <Link
                href="/restore-wedding-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Restore Wedding Photos
              </Link>
              <Link
                href="/restore-damaged-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Fix Damaged Photos
              </Link>
              <Link
                href="/blog/how-to-restore-old-photos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                How to Restore Old Photos
              </Link>
              <Link
                href="/blog/gfpgan-explained"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                What is GFPGAN?
              </Link>
            </nav>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold">Connect</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              <a
                href="https://github.com/ThanosKa/magic-memory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/KazakisThanos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Twitter / X
              </a>
              <a
                href="mailto:kazakis.th@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Support
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2026 Thaka — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

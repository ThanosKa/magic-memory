import Link from "next/link";
import { Github, Mail, X } from "lucide-react";

export function FooterMinimal() {
  return (
    <footer className="border-t border-paper/10 bg-ink py-6">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <div className="flex items-center justify-center sm:justify-start">
          <span className="font-serif text-[20px] leading-none text-paper">
            Magic Memory
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://github.com/ThanosKa/magic-memory"
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:text-paper"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="size-5" />
          </Link>
          <Link
            href="https://x.com/KazakisThanos"
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:text-paper"
            aria-label="X (Twitter)"
            target="_blank"
            rel="noreferrer"
          >
            <X className="size-5" />
          </Link>
          <Link
            href="mailto:kazakis.th@gmail.com"
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:text-paper"
            aria-label="Email"
          >
            <Mail className="size-5" />
          </Link>
        </div>

        <div className="flex items-center justify-center sm:justify-end">
          <p className="font-mono text-center text-[11px] uppercase tracking-[0.18em] text-paper/60 sm:text-right">
            © 2025 Thaka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

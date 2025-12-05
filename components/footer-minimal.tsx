"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail, X } from "lucide-react";

export function FooterMinimal() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
      className="border-t border-border bg-muted/30 py-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-start">
          <span className="text-base font-semibold text-foreground">
            Magic Memory
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://github.com/ThanosKa/magic-memory"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://x.com/KazakisThanos"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="X (Twitter)"
            target="_blank"
            rel="noreferrer"
          >
            <X className="h-5 w-5" />
          </Link>
          <Link
            href="mailto:kazakis.th@gmail.com"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            © 2025 Thaka. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

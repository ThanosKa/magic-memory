"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scale, ImageIcon, BookOpen } from "lucide-react";

const compareLinks = [
  {
    href: "/blog/best-ai-photo-restoration",
    title: "Best AI photo restoration tools 2026",
    description: "Remini, MyHeritage, VanceAI, Fotor, Magic Memory — tested.",
  },
  {
    href: "/vs/remini",
    title: "Magic Memory vs Remini",
    description: "Web vs mobile, one-time credits vs weekly subscription.",
  },
  {
    href: "/vs/myheritage",
    title: "Magic Memory vs MyHeritage",
    description: "Standalone photo restoration vs bundled genealogy plan.",
  },
  {
    href: "/alternatives/myheritage",
    title: "MyHeritage Photo Enhancer alternative",
    description: "Get photo restoration without paying $119/yr for genealogy.",
  },
  {
    href: "/vs/vanceai",
    title: "Magic Memory vs VanceAI",
    description: "GFPGAN portrait focus vs multi-tool professional suite.",
  },
  {
    href: "/alternatives",
    title: "All alternatives compared",
    description: "Remini, MyHeritage, VanceAI, Fotor — full side-by-side.",
  },
];

const restoreLinks = [
  {
    href: "/restore-old-photos",
    title: "Restore old photos",
    description: "Recover faded, blurry, and low-resolution portraits.",
  },
  {
    href: "/restore-family-photos",
    title: "Restore family photos",
    description: "Bring back detail in grandparent and ancestry portraits.",
  },
  {
    href: "/fix-blurry-photos",
    title: "Fix blurry photos",
    description: "Sharpen motion-blurred and out-of-focus face photos.",
  },
  {
    href: "/restore-black-and-white-photos",
    title: "Restore black and white photos",
    description: "Clean up and enhance historical black and white portraits.",
  },
  {
    href: "/restore-damaged-photos",
    title: "Restore damaged photos",
    description: "Repair scratched, torn, and water-damaged photographs.",
  },
  {
    href: "/restore-wedding-photos",
    title: "Restore wedding photos",
    description: "Recover detail in aged wedding and ceremony portraits.",
  },
  {
    href: "/restore-vintage-photos",
    title: "Restore vintage photos",
    description: "1920s–1970s film grain, sepia tones, and faded portraits.",
  },
  {
    href: "/restore-faded-photos",
    title: "Restore faded photos",
    description: "Recover detail in sun-damaged and color-shifted prints.",
  },
  {
    href: "/restore-portrait-photos",
    title: "Restore portrait photos",
    description: "Sharpen face detail in cropped or soft-focus portraits.",
  },
];

const learnLinks = [
  {
    href: "/glossary/gfpgan",
    title: "What is GFPGAN?",
    description: "The face restoration model that powers Magic Memory.",
  },
  {
    href: "/glossary/face-restoration",
    title: "What is face restoration?",
    description: "How AI reconstructs facial detail from degraded photos.",
  },
  {
    href: "/glossary/photo-restoration",
    title: "What is photo restoration?",
    description: "The full picture: AI vs manual, when to use each.",
  },
  {
    href: "/glossary/image-upscaling",
    title: "What is image upscaling?",
    description: "Super-resolution explained — and when you actually need it.",
  },
  {
    href: "/glossary/ai-photo-enhancement",
    title: "What is AI photo enhancement?",
    description: "All the tasks AI handles — denoise, deblur, upscale, restore.",
  },
  {
    href: "/for/photographers",
    title: "For photographers",
    description: "AI restoration as a billable client service.",
  },
  {
    href: "/for/genealogists",
    title: "For genealogists",
    description: "Restore ancestor photos for family trees and reunions.",
  },
  {
    href: "/blog/ai-photo-restoration-vs-photoshop",
    title: "AI restoration vs Photoshop",
    description: "When AI wins, when manual editing wins — with real numbers.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ExploreSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Compare Magic Memory to other tools
          </h2>
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Researching AI photo restoration? See how Magic Memory stacks up against Remini, MyHeritage, VanceAI, and other alternatives on pricing, quality, and privacy.
        </motion.p>

        <motion.div
          className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {compareLinks.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <ImageIcon className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Restore specific photo types
          </h2>
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Step-by-step guides for the photos you&apos;re trying to save — old portraits, family albums, damaged prints, and more.
        </motion.p>

        <motion.div
          className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {restoreLinks.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Learn how it works
          </h2>
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Plain-English guides to the AI behind your restoration, plus when each technique helps — and when it doesn&apos;t.
        </motion.p>

        <motion.div
          className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {learnLinks.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

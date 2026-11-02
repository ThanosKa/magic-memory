"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RestorationLens } from "@/components/home/restoration-lens";
import { PageContainer } from "@/components/layout/page-container";
import { StartButton } from "@/components/layout/start-button";

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE: { text: string; italic?: boolean; br?: boolean }[] = [
  { text: "Old" },
  { text: "photos,", br: true },
  { text: "back" },
  { text: "in" },
  { text: "focus.", italic: true },
];

export function HomeHero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section className="relative overflow-hidden">
      <PageContainer className="grid min-h-[calc(100svh-4rem)] items-center gap-12 pb-16 pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="max-w-xl">
          <motion.p
            {...rise(0.05)}
            className="font-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-paper/60"
          >
            <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
            AI photo restoration
          </motion.p>

          <h1 className="font-serif mt-6 text-[clamp(3.25rem,6.6vw,6.75rem)] leading-[0.95] tracking-[-0.02em] text-paper">
            {HEADLINE.map((word, i) => (
              <span key={word.text}>
                <motion.span
                  className={word.italic ? "inline-block italic text-paper/70" : "inline-block"}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, filter: "blur(14px)", y: 14 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.09, ease: EASE }}
                >
                  {word.text}
                </motion.span>
                {word.br ? <br /> : " "}
              </span>
            ))}
          </h1>

          <motion.p
            {...rise(0.6)}
            className="mt-7 max-w-[30rem] text-[17px] leading-[1.6] text-paper/70 sm:text-lg"
          >
            Magic Memory is a web app that repairs blurry, faded and damaged
            photos of people. Upload a scan and AI rebuilds the faces in about
            15&nbsp;seconds, ready to download.
          </motion.p>

          <motion.div {...rise(0.72)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <StartButton />
            <Link
              href="/pricing"
              className="mm-underline text-[15px] font-medium text-paper/80 transition-colors hover:text-paper"
            >
              See pricing
            </Link>
          </motion.div>

          <motion.ul
            {...rise(0.84)}
            className="font-mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-paper/45"
          >
            <li>1 free photo a day</li>
            <li>No credit card</li>
            <li>Nothing to install</li>
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
        >
          <RestorationLens
            before={{
              src: "/couple-before.jpg",
              alt: "Original photo: a blurry snapshot of a couple at a night fair",
            }}
            after={{
              src: "/couple-after.png",
              alt: "The same photo restored: faces are sharp, with clear eyes and skin detail",
            }}
            captions={{
              original: "Original scan",
              restored: "Restored by Magic Memory",
              ring: "Restored",
              note: "Sample restoration",
            }}
            preload
          />
        </motion.div>
      </PageContainer>
    </section>
  );
}

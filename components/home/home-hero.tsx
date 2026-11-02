"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RestorationLens } from "@/components/home/restoration-lens";
import { StartButton } from "@/components/home/start-button";

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
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1360px] items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-14 lg:pb-20 lg:pt-12">
        <div className="max-w-xl">
          <motion.p
            {...rise(0.05)}
            className="mm-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-[#f1eadf]/60"
          >
            <span className="size-1.5 rounded-full bg-[#ff5a36]" aria-hidden="true" />
            AI photo restoration
          </motion.p>

          <h1 className="mm-serif mt-6 text-[clamp(3.25rem,6.6vw,6.75rem)] leading-[0.95] tracking-[-0.02em] text-[#f1eadf]">
            {HEADLINE.map((word, i) => (
              <span key={word.text}>
                <motion.span
                  className={word.italic ? "inline-block italic text-[#f1eadf]/70" : "inline-block"}
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
            className="mt-7 max-w-[30rem] text-[17px] leading-[1.6] text-[#f1eadf]/70 sm:text-lg"
          >
            Magic Memory is a web app that repairs blurry, faded and damaged
            photos of people. Upload a scan and AI rebuilds the faces in about
            15&nbsp;seconds, ready to download.
          </motion.p>

          <motion.div {...rise(0.72)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <StartButton />
            <Link
              href="/pricing"
              className="mm-underline text-[15px] font-medium text-[#f1eadf]/80 transition-colors hover:text-[#f1eadf]"
            >
              See pricing
            </Link>
          </motion.div>

          <motion.ul
            {...rise(0.84)}
            className="mm-mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-[#f1eadf]/45"
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
          <RestorationLens />
        </motion.div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { RestorationLens } from "@/components/home/restoration-lens";
import { PageContainer } from "@/components/layout/page-container";
import { StartButton } from "@/components/layout/start-button";

const HEADLINE: { text: string; italic?: boolean; br?: boolean }[] = [
  { text: "Old" },
  { text: "photos,", br: true },
  { text: "back" },
  { text: "in" },
  { text: "focus.", italic: true },
];

/**
 * Home hero. The entrance is a CSS animation (`mm-rise`, see globals.css) so
 * it plays on first paint instead of waiting for hydration, and it is off
 * when the visitor prefers reduced motion.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <PageContainer className="grid min-h-[calc(100svh-4rem)] items-center gap-12 pb-16 pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="mm-rise max-w-xl">
          <p className="font-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-paper/60">
            <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
            AI photo restoration
          </p>

          <h1 className="font-serif mt-6 text-[clamp(3.25rem,6.6vw,6.75rem)] leading-[0.95] tracking-[-0.02em] text-paper">
            {HEADLINE.map((word) => (
              <span key={word.text}>
                <span className={word.italic ? "italic text-paper/70" : undefined}>
                  {word.text}
                </span>
                {word.br ? <br /> : " "}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[30rem] text-[17px] leading-[1.6] text-paper/70 sm:text-lg">
            Magic Memory is a web app that repairs blurry, faded and damaged
            photos of people. Upload a scan and AI rebuilds the faces in about
            15&nbsp;seconds, ready to download.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <StartButton />
            <Link
              href="/pricing"
              className="mm-underline text-[15px] font-medium text-paper/80 transition-colors hover:text-paper"
            >
              See pricing
            </Link>
          </div>

          <ul className="font-mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-paper/45">
            <li>1 free photo a day</li>
            <li>No credit card</li>
            <li>Nothing to install</li>
          </ul>
        </div>

        <div className="mm-rise mm-rise--frame">
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
        </div>
      </PageContainer>
    </section>
  );
}

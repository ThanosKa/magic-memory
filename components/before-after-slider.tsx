"use client";

import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { PRINT_FRAME_CLASS } from "@/components/layout/film";
import { cn } from "@/lib/utils";

type SliderImage = {
  src: string;
  alt: string;
  /** Mono tag in the photo's top corner. */
  label: string;
};

type BeforeAfterSliderProps = {
  before: SliderImage;
  after: SliderImage;
  /** Optional mono note under the photo, e.g. "Sample restoration". */
  note?: string;
  /** Frame width / height; match the photos so both line up. */
  aspectRatio?: number;
  sizes?: string;
  preload?: boolean;
  unoptimized?: boolean;
  className?: string;
};

const START = 50;
const KEY_STEP = 5;

/**
 * Before/after slider: the restored photo with the original on top, cut at a
 * vertical line the visitor drags (or clicks, or moves with the arrow keys).
 * The split is written straight to a CSS variable, so dragging never
 * re-renders React. `touch-pan-y` keeps vertical page scroll working on phones.
 */
export function BeforeAfterSlider({
  before,
  after,
  note,
  aspectRatio = 3 / 2,
  sizes = "(max-width: 1024px) 100vw, 58vw",
  preload = false,
  unoptimized = false,
  className,
}: BeforeAfterSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const position = useRef(START);
  const dragging = useRef(false);

  const setPosition = (value: number) => {
    const next = Math.max(0, Math.min(100, value));
    position.current = next;
    frameRef.current?.style.setProperty("--split", `${next}%`);
    handleRef.current?.setAttribute("aria-valuenow", String(Math.round(next)));
  };

  const setFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(((event.clientX - rect.left) / rect.width) * 100);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromPointer(event);
  };

  const stopDragging = () => {
    dragging.current = false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowLeft: position.current - KEY_STEP,
      ArrowDown: position.current - KEY_STEP,
      ArrowRight: position.current + KEY_STEP,
      ArrowUp: position.current + KEY_STEP,
      Home: 0,
      End: 100,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setPosition(moves[event.key]);
  };

  const tagClass =
    "font-mono pointer-events-none absolute top-3 rounded-full bg-scrim/75 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-scrim-foreground/85 sm:top-4";

  return (
    <figure className={cn("relative w-full", className)}>
      <div className={PRINT_FRAME_CLASS}>
        <div
          ref={frameRef}
          className="relative w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-scrim"
          style={{ aspectRatio, ["--split" as string]: `${START}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
        >
          <Image
            src={after.src}
            alt={after.alt}
            fill
            loading={preload ? "eager" : undefined}
            unoptimized={unoptimized}
            draggable={false}
            sizes={sizes}
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: "inset(0 calc(100% - var(--split)) 0 0)" }}
          >
            <Image
              src={before.src}
              alt={before.alt}
              fill
              preload={preload}
              unoptimized={unoptimized}
              draggable={false}
              sizes={sizes}
              className="object-cover"
            />
          </div>

          <span className={cn(tagClass, "left-3 sm:left-4")}>{before.label}</span>
          <span className={cn(tagClass, "right-3 sm:right-4")}>{after.label}</span>

          <div
            className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-scrim-foreground/90"
            style={{ left: "var(--split)" }}
            aria-hidden="true"
          />
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label="Compare the original and restored photo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={START}
            aria-valuetext="Percent of the original photo shown"
            onKeyDown={handleKeyDown}
            className="focus-ring absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-print text-scrim shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)]"
            style={{ left: "var(--split)" }}
          >
            <ChevronsLeftRight className="size-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      <figcaption className="font-mono mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-paper/60">
        <span>Drag the line to compare</span>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

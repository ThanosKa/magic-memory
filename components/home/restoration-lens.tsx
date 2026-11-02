"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LensMode = "original" | "lens" | "restored";

export type RestorationLensImage = {
  src: string;
  alt: string;
};

export type RestorationLensCaptions = {
  /** Corner tag over the photo in Original and Lens modes. */
  original: string;
  /** Corner tag over the photo in Restored mode. */
  restored: string;
  /** Small tag under the lens ring. */
  ring: string;
  /** Optional note after the interaction hint, e.g. "Sample restoration". */
  note?: string;
};

export type RestorationLensProps = {
  /** The original photo, shown underneath. */
  before: RestorationLensImage;
  /** The restored photo, revealed through the lens. */
  after: RestorationLensImage;
  captions: RestorationLensCaptions;
  /** Frame width / height. Match the photo's ratio so both images line up. Defaults to 3/2. */
  aspectRatio?: number;
  /** Passed to next/image. */
  sizes?: string;
  /** Load both images eagerly and preload the original (above-the-fold use). */
  preload?: boolean;
  /** Skip next/image optimisation, e.g. for remote hosts not in next.config. */
  unoptimized?: boolean;
  className?: string;
};

const MODES: { value: LensMode; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "lens", label: "Lens" },
  { value: "restored", label: "Restored" },
];

const LERP = 0.18;
const DEFAULT_ASPECT_RATIO = 3 / 2;
const DEFAULT_SIZES = "(max-width: 1024px) 100vw, 58vw";

/**
 * Before/after comparison: the original photo with the restored version
 * underneath. A soft "lens" follows the pointer (or drifts on its own
 * until touched) and reveals the restored photo through a CSS mask.
 * Position is written straight to CSS custom properties, so moving the
 * lens never re-renders React.
 */
export function RestorationLens({
  before,
  after,
  captions,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  sizes = DEFAULT_SIZES,
  preload = false,
  unoptimized = false,
  className,
}: RestorationLensProps) {
  const [mode, setMode] = useState<LensMode>("lens");
  const [idle, setIdle] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const seeded = useRef(false);
  const raf = useRef(0);
  const reduceMotion = useRef(false);

  // Pause the idle drift while the lens is off screen (see .mm-lens in
  // globals.css). Written straight to the DOM so it never re-renders.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new window.IntersectionObserver(([entry]) => {
      el.dataset.offscreen = entry.isIntersecting ? "false" : "true";
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paint = () => {
    const el = frameRef.current;
    if (!el) {
      raf.current = 0;
      return;
    }
    const k = reduceMotion.current ? 1 : LERP;
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;
    el.style.setProperty("--mm-x", `${current.current.x.toFixed(1)}px`);
    el.style.setProperty("--mm-y", `${current.current.y.toFixed(1)}px`);
    const moving =
      Math.abs(target.current.x - current.current.x) > 0.2 ||
      Math.abs(target.current.y - current.current.y) > 0.2;
    raf.current = moving ? window.requestAnimationFrame(paint) : 0;
  };

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    target.current = { x, y };
    if (!seeded.current) {
      current.current = { x, y };
      seeded.current = true;
    }
    if (idle) setIdle(false);
    if (mode !== "lens") setMode("lens");
    if (!raf.current) {
      reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      raf.current = window.requestAnimationFrame(paint);
    }
  };

  return (
    <figure className={cn("relative w-full", className)}>
      <div className="rounded-[4px] bg-print p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.3)] sm:p-3">
        <div
          ref={frameRef}
          className="mm-lens relative w-full cursor-crosshair touch-pan-y select-none overflow-hidden bg-scrim"
          style={{ aspectRatio }}
          data-mode={mode}
          data-idle={idle}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
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
          <div className="mm-lens__reveal absolute inset-0">
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
          </div>
          <div className="mm-lens__track" aria-hidden="true">
            <div className="mm-lens__ring">
              <span className="font-mono absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-scrim/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-scrim-foreground/90">
                {captions.ring}
              </span>
            </div>
          </div>
          <span className="font-mono pointer-events-none absolute left-3 top-3 rounded-full bg-scrim/75 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-scrim-foreground/85 sm:left-4 sm:top-4">
            {mode === "restored" ? captions.restored : captions.original}
          </span>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div
          role="group"
          aria-label="Compare the original and restored photo"
          className="inline-flex rounded-full border border-paper/12 bg-paper/[0.04] p-1"
        >
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={mode === item.value}
              onClick={() => setMode(item.value)}
              className={cn(
                "font-mono min-h-11 rounded-full px-3.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                mode === item.value
                  ? "bg-paper text-ink"
                  : "text-paper/60 hover:text-paper"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
          <span className="mm-hint-hover">Move over the photo</span>
          <span className="mm-hint-touch">Drag across the photo</span>
          {captions.note ? (
            <>
              <span aria-hidden="true"> · </span>
              {captions.note}
            </>
          ) : null}
        </p>
      </figcaption>
    </figure>
  );
}

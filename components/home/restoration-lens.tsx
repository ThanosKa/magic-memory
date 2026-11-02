"use client";

import type React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LensMode = "original" | "lens" | "restored";

const MODES: { value: LensMode; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "lens", label: "Lens" },
  { value: "restored", label: "Restored" },
];

const CAPTIONS: Record<LensMode, string> = {
  original: "Original scan",
  lens: "Original scan",
  restored: "Restored by Magic Memory",
};

const LERP = 0.18;

/**
 * The hero's signature: a blurry original with the restored version
 * underneath. A soft "lens" follows the pointer (or drifts on its own
 * until touched) and reveals the restored face through a CSS mask.
 * Position is written straight to CSS custom properties, so moving the
 * lens never re-renders React.
 */
export function RestorationLens() {
  const [mode, setMode] = useState<LensMode>("lens");
  const [idle, setIdle] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const seeded = useRef(false);
  const raf = useRef(0);

  const paint = () => {
    const el = frameRef.current;
    if (!el) {
      raf.current = 0;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 1 : LERP;
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
    if (!raf.current) raf.current = window.requestAnimationFrame(paint);
  };

  return (
    <figure className="relative w-full">
      <div className="rounded-[4px] bg-paper-deep p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.3)] sm:p-3">
        <div
          ref={frameRef}
          className="mm-lens relative aspect-[3/2] w-full cursor-crosshair select-none overflow-hidden bg-ink"
          data-mode={mode}
          data-idle={idle}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
        >
          <Image
            src="/couple-before.jpg"
            alt="Original photo: a blurry snapshot of a couple at a night fair"
            fill
            preload
            draggable={false}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="mm-lens__reveal absolute inset-0">
            <Image
              src="/couple-after.png"
              alt="The same photo restored: faces are sharp, with clear eyes and skin detail"
              fill
              loading="eager"
              draggable={false}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="mm-lens__ring" aria-hidden="true">
            <span className="font-mono absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-paper/90 backdrop-blur-sm">
              Restored
            </span>
          </div>
          <span className="font-mono pointer-events-none absolute left-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-paper/85 backdrop-blur-sm sm:left-4 sm:top-4">
            {CAPTIONS[mode]}
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
                "font-mono min-h-9 rounded-full px-3.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                mode === item.value
                  ? "bg-paper text-ink"
                  : "text-paper/60 hover:text-paper"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/45">
          <span className="mm-hint-hover">Move over the photo</span>
          <span className="mm-hint-touch">Drag across the photo</span>
          <span aria-hidden="true"> · </span>
          Sample restoration
        </p>
      </figcaption>
    </figure>
  );
}

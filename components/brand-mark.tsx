import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

/**
 * The Magic Memory mark: a lens split by the before/after seam. The outlined
 * half is the faded original, the solid half the restored print.
 *
 * Paper parts use `currentColor` and the seam uses the ember token, so the mark
 * follows the active theme. public/icon.svg, app/icon.png and app/apple-icon.png
 * draw the same lens on an ink tile, with a wider, full-height seam so it stays
 * visible at small sizes; regenerate them if the lens changes.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      <circle cx="16" cy="16" r="10.75" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 5.25a10.75 10.75 0 0 1 0 21.5z" fill="currentColor" />
      <rect x="15" y="1" width="2" height="30" rx="1" className="fill-ember" />
    </svg>
  );
}

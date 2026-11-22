import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

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

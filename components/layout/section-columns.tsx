import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionColumnsProps = {
  aside: ReactNode;
  children: ReactNode;
  stickyAside?: boolean;
  className?: string;
};

export function SectionColumns({ aside, children, stickyAside = false, className }: SectionColumnsProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]", className)}>
      <div className={cn(stickyAside && "lg:sticky lg:top-28 lg:self-start")}>{aside}</div>
      <div>{children}</div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlanGridProps = {
  children: ReactNode;
};

export function PlanGrid({ children }: PlanGridProps) {
  return (
    <ul className="grid overflow-hidden rounded-[20px] border border-ink/12 lg:grid-cols-3">
      {children}
    </ul>
  );
}

type PlanCellProps = {
  index: number;
  popular?: boolean;
  className?: string;
  children: ReactNode;
};

export function PlanCell({ index, popular = false, className, children }: PlanCellProps) {
  return (
    <li
      className={cn(
        "relative flex flex-col border-ink/12 p-7 sm:p-8",
        index > 0 && "border-t lg:border-l lg:border-t-0",
        popular && "bg-ink text-paper",
        className
      )}
    >
      {children}
    </li>
  );
}

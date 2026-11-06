import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlanGridProps = {
  children: ReactNode;
};

/** Three plans as one bordered sheet: stacked on phones and tablets, 3 columns on desktop. */
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

/**
 * One plan in a PlanGrid. Its `index` decides which inner hairlines it draws;
 * the popular plan is an ink card on the cream sheet.
 */
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

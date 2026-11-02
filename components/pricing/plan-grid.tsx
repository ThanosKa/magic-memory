import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlanGridProps = {
  children: ReactNode;
};

/** Four plans as one bordered sheet: 1 column on phones, 2 on tablets, 4 on desktop. */
export function PlanGrid({ children }: PlanGridProps) {
  return (
    <ul className="grid overflow-hidden rounded-[20px] border border-ink/12 sm:grid-cols-2 lg:grid-cols-4">
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
        index > 0 && "border-t sm:border-t-0",
        index % 2 === 1 && "sm:border-l",
        index >= 2 && "sm:border-t lg:border-t-0",
        index === 2 && "lg:border-l",
        popular && "bg-ink text-paper",
        className
      )}
    >
      {children}
    </li>
  );
}

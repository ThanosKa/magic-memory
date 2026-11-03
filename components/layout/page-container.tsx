import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main";
};

/** Max width and side gutters shared by every page (matches the home page). */
export const PAGE_CONTAINER_CLASS = "mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-14";

export function PageContainer({ children, className, as: Component = "div" }: PageContainerProps) {
  return <Component className={cn(PAGE_CONTAINER_CLASS, className)}>{children}</Component>;
}

import type { ReactNode } from "react";
import Link from "next/link";

type SecondaryLinkProps = {
  href: string;
  children: ReactNode;
};

/** The underlined text link that sits next to a primary pill. */
export function SecondaryLink({ href, children }: SecondaryLinkProps) {
  return (
    <Link
      href={href}
      className="focus-ring group inline-flex min-h-11 items-center text-[15px] font-medium text-paper/80 transition-colors hover:text-paper"
    >
      <span className="mm-underline">{children}</span>
    </Link>
  );
}

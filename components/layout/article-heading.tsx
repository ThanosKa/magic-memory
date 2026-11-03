import type { ReactNode } from "react";

type ArticleHeadingProps = {
  children: ReactNode;
};

/** Serif section heading for the glossary and audience (/for/*) pages. */
export function ArticleHeading({ children }: ArticleHeadingProps) {
  return <h2 className="font-serif mb-4 text-3xl tracking-[-0.01em] text-paper">{children}</h2>;
}

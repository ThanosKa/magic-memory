"use client";

import { type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type HighlighterAction = "highlight" | "underline" | "box";

type HighlighterProps = {
  children: ReactNode;
  action?: HighlighterAction;
  color?: string;
  multiline?: boolean;
  className?: string;
};

function getStyles(
  action: HighlighterAction,
  color: string,
  multiline: boolean
): CSSProperties {
  const base: CSSProperties = {
    display: "inline",
    boxDecorationBreak: multiline ? "clone" : "slice",
    WebkitBoxDecorationBreak: multiline ? "clone" : "slice",
    paddingInline: 2,
  };

  if (action === "underline") {
    base.boxShadow = `inset 0 -0.18em 0 ${color}`;
    return base;
  }

  if (action === "box") {
    base.boxShadow = `inset 0 0 0 2px ${color}`;
    base.borderRadius = 6;
    base.paddingInline = 4;
    base.paddingBlock = 2;
    return base;
  }

  base.boxShadow = `inset 0 -0.4em 0 ${color}`;
  return base;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  multiline = true,
  className,
}: HighlighterProps) {
  const style = getStyles(action, color, multiline);

  return (
    <span className={cn("relative inline", className)} style={style}>
      {children}
    </span>
  );
}

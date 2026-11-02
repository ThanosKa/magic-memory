import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Darkroom button. The default variant is the cream pill used for primary
 * actions everywhere (the home start button uses it too).
 *
 * - `tone="paper"` flips colours for cream sections (ink pill, ink outline).
 * - Add `<ButtonArrow />` as the last child for the arrow that nudges on hover.
 * - `default` and `lg` sizes are 44px+ tall; use them for primary actions.
 */
const buttonVariants = cva(
  "group/button focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-paper text-ink hover:bg-paper-deep",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-paper/20 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-ink",
        secondary: "bg-surface-3 text-paper hover:bg-paper/10",
        ghost: "text-paper/80 hover:bg-paper/[0.06] hover:text-paper",
        link: "mm-underline text-paper/80 hover:text-paper",
      },
      size: {
        default: "h-11 px-5 text-[15px]",
        sm: "h-10 px-4 text-[14px]",
        lg: "h-12 gap-2.5 px-6 text-[15px]",
        icon: "size-11",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
      // Keys are quoted so the theme guard does not mistake them for Tailwind's dark variant.
      tone: {
        "dark": "",
        "paper": "",
      },
    },
    compoundVariants: [
      { variant: "link", class: "h-auto rounded-none px-0 active:scale-100" },
      { tone: "paper", variant: "default", class: "bg-ink text-paper hover:bg-surface-3" },
      {
        tone: "paper",
        variant: "outline",
        class: "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
      },
      { tone: "paper", variant: "secondary", class: "bg-ink/[0.06] text-ink hover:bg-ink/10" },
      { tone: "paper", variant: "ghost", class: "text-ink/75 hover:bg-ink/[0.06] hover:text-ink" },
      { tone: "paper", variant: "link", class: "text-ink/75 hover:text-ink" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      tone: "dark",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, tone, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, tone, className }))}
      {...props}
    />
  );
}

/** Arrow for primary actions; nudges right when its button is hovered. */
function ButtonArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn("size-4 transition-transform duration-200 group-hover/button:translate-x-1", className)}
      aria-hidden="true"
    />
  );
}

export { Button, ButtonArrow, buttonVariants };
export type { ButtonProps };

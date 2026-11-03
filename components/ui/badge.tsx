import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/** Small mono uppercase pill. Use `ember` for the one highlight on a screen. */
const badgeVariants = cva(
  'font-mono inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] transition-colors focus-ring [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-paper text-ink [a&]:hover:bg-paper-deep',
        ember: 'border-transparent bg-ember text-ink',
        secondary: 'border-transparent bg-surface-3 text-paper/80 [a&]:hover:text-paper',
        destructive: 'border-destructive/30 bg-destructive/15 text-destructive',
        outline: 'border-paper/20 text-paper/70 [a&]:hover:border-paper/40 [a&]:hover:text-paper',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

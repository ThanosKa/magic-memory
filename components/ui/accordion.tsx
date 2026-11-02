'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Home FAQ style: hairline dividers, large sans question, muted answer.
 * Text takes the section's colour, so it works on ink and cream sections.
 * Give the root `border-t border-border` for a top rule above the first item.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b border-border', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-ring flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-[4px] py-6 text-left text-[17px] font-normal transition-colors disabled:pointer-events-none disabled:opacity-50 sm:text-[19px] [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-5 shrink-0 translate-y-0.5 opacity-50 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * Answers stay in the HTML while closed (FAQPage structured data lists them),
 * so the item is force-mounted and collapsed with CSS: grid rows 0fr → 1fr,
 * and `invisible` once closed so hidden answers leave the tab order and the
 * accessibility tree. The transition sits on the inner grid because Radix
 * zeroes transitions on the content node while it measures.
 */
function AccordionContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Content>, 'forceMount'>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      forceMount
      className="group/accordion-content"
      {...props}
    >
      <div className="invisible grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-200 ease-out group-data-[state=open]/accordion-content:visible group-data-[state=open]/accordion-content:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="min-h-0 overflow-hidden">
          <div className={cn('max-w-[60ch] pb-6 text-[15px] leading-[1.7] text-current/60', className)}>
            {children}
          </div>
        </div>
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

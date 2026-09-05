"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"

import { Icon } from "./icon"

/**
 * An accordion (HIG › Disclosure controls, in a list): an inset grouped list of rows that
 * each reveal a panel, one open at a time unless `multiple`. Rows follow the platform's list
 * metrics; the chevron turns as a row opens.
 */
type AccordionProps = AccordionPrimitive.Root.Props & {
  /** Allow several rows open at once. */
  multiple?: boolean
}

function Accordion({ className, multiple = false, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-list bg-card",
        className
      )}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group/accordion-item border-b-[0.5px] border-separator last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex min-h-(--list-row-min-height) w-full items-center justify-between gap-3 px-(--list-row-padding-x) py-(--list-row-padding-y) text-start text-[length:var(--list-font)] leading-snug text-label transition-[background-color] duration-(--duration-press) outline-none select-none hover:bg-fill-4 focus-visible:bg-fill-4 active:bg-fill-3 disabled:opacity-40",
          className
        )}
        {...props}
      >
        {children}
        <Icon
          icon={ArrowDown01Icon}
          weight="semibold"
          data-slot="accordion-chevron"
          className="shrink-0 text-label-3 transition-transform duration-(--duration-press) ease-(--ease-standard) group-data-open/accordion-item:rotate-180 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden transition-[height] duration-(--duration-overlay) ease-(--ease-standard) data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div
        data-slot="accordion-panel-content"
        className="px-(--list-row-padding-x) pb-(--list-row-padding-y) text-[length:var(--list-subtitle-font)] leading-snug text-label-2"
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger }
export type { AccordionProps }

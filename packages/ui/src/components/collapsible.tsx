"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"

import { Icon } from "./icon"

/**
 * Disclosure controls (HIG › Disclosure controls): a row whose chevron points along the
 * leading edge when collapsed and down when expanded, hiding details until they are relevant.
 */
function Collapsible({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("group/disclosure flex flex-col", className)}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "flex w-full items-center justify-between gap-2 py-2 text-start type-body text-label outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
      <Icon
        icon={ArrowRight01Icon}
        weight="semibold"
        data-slot="collapsible-chevron"
        className="text-label-3 transition-transform duration-(--duration-press) ease-(--ease-standard) group-data-open/disclosure:rotate-90 motion-reduce:transition-none"
      />
    </CollapsiblePrimitive.Trigger>
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden type-body text-label transition-[height] duration-(--duration-overlay) ease-(--ease-standard) data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }

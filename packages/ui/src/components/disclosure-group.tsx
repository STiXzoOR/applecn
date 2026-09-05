'use client'

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { cn } from 'cn'

import { Icon } from './icon'

/**
 * Disclosure controls (HIG › Disclosure controls): a row whose chevron points along the
 * leading edge when collapsed and down when expanded, hiding details until they are relevant.
 */
function DisclosureGroup({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="disclosure-group" className={cn('group/disclosure flex flex-col', className)} {...props} />
}

function DisclosureGroupTrigger({ className, children, ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="disclosure-group-trigger"
      className={cn(
        'type-body flex w-full items-center justify-between gap-2 py-2 text-start text-label outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
      <Icon
        icon={ArrowRight01Icon}
        weight="semibold"
        data-slot="disclosure-group-chevron"
        className="text-label-3 transition-transform duration-(--duration-press) ease-(--ease-standard) group-data-open/disclosure:rotate-90 motion-reduce:transition-none"
      />
    </CollapsiblePrimitive.Trigger>
  )
}

function DisclosureGroupPanel({ className, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="disclosure-group-panel"
      className={cn(
        'type-body h-(--collapsible-panel-height) overflow-hidden text-label transition-[height] duration-(--duration-overlay) ease-(--ease-standard) data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  )
}

export { DisclosureGroup, DisclosureGroupPanel, DisclosureGroupTrigger }

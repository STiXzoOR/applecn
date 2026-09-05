'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from 'cn'

/**
 * The segmented control (HIG › Segmented controls): a 32 pt capsule on the tertiary fill with a
 * 2 pt inset and a white, shadowed segment that slides to the selection. Built on Base UI Tabs
 * so the same list drives `Tabs` panels; on its own it is a single-choice picker.
 */
type SegmentedControlProps = TabsPrimitive.Root.Props & {
  'aria-label'?: string
  'aria-labelledby'?: string
}

function SegmentedControl({
  className,
  children,
  'aria-label': label,
  'aria-labelledby': labelledBy,
  ...props
}: SegmentedControlProps) {
  return (
    <TabsPrimitive.Root data-slot="segmented-control-root" className={cn('inline-flex', className)} {...props}>
      <SegmentedControlList aria-label={label} aria-labelledby={labelledBy}>
        {children}
      </SegmentedControlList>
    </TabsPrimitive.Root>
  )
}

function SegmentedControlList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="segmented-control"
      activateOnFocus
      className={cn(
        'relative inline-flex h-(--segmented-height) w-full items-stretch rounded-full bg-fill-3 p-(--segmented-inset)',
        className,
      )}
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="segmented-control-indicator"
        className="absolute top-(--segmented-inset) bottom-(--segmented-inset) left-0 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-background shadow-segment transition-[translate,width] duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:transition-none"
      />
      {children}
    </TabsPrimitive.List>
  )
}

function SegmentedControlItem({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="segmented-control-item"
      className={cn(
        'type-footnote relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 font-medium whitespace-nowrap text-label outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40 data-active:font-semibold [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem, SegmentedControlList }
export type { SegmentedControlProps }

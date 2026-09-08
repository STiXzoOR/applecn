"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../lib/utils"

/**
 * Tab views: a segmented control that switches between closely related subviews (the Calendar
 * "New Event" sheet). For an app's top-level sections use `TabBar`; for a picker that drives no
 * panels use `ToggleGroup`.
 *
 * The segmented styling lives here since spec §5.3 folded `segmented-control` into
 * `toggle-group`: this is the case that drives panels, so it keeps `role="tablist"`, keyboard
 * selection, and Base UI's `Tabs.Indicator` for the pill that slides to the selected tab. iOS 26:
 * a 32 pt capsule on the tertiary fill with a 2 pt inset and a white, shadowed pill; macOS 26:
 * 24 pt with 6 pt corners and an accent-filled selection; the web keeps TV's 32 pt pill.
 */
function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      activateOnFocus
      className={cn(
        "relative inline-flex h-(--segmented-height) w-full items-stretch rounded-segmented bg-fill-3 p-(--segmented-inset)",
        className
      )}
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="absolute top-(--segmented-inset) bottom-(--segmented-inset) left-0 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-[calc(var(--radius-segmented)-var(--segmented-inset))] bg-(--segmented-control-indicator-bg) shadow-(--segmented-control-indicator-shadow) transition-[translate,width] duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:transition-none"
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-[calc(var(--radius-segmented)-var(--segmented-inset))] px-3 text-[length:var(--segmented-font)] leading-none font-medium whitespace-nowrap text-label transition-[color] duration-(--duration-press) outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40 data-active:font-semibold data-active:text-(--segmented-control-item-active-text) [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 type-body outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsPanel,
  TabsPanel as TabsContent,
  TabsTab,
  TabsTab as TabsTrigger,
}

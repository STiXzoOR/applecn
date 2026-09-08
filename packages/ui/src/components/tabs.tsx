"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../lib/utils"

import {
  segmentedIndicatorClassName,
  segmentedItemClassName,
  segmentedTrackClassName,
} from "./toggle-group"

/**
 * Tab views: a segmented control that switches between closely related subviews (the Calendar
 * "New Event" sheet). For an app's top-level sections use `TabBar`; for a picker that drives no
 * panels use `ToggleGroup`.
 *
 * The segmented surface comes from `toggle-group`, which is where spec §5.3 folded
 * `segmented-control`: the track, the pill and a segment are one exported constant read by both
 * files rather than two copies of the same class strings, which §4.4 named the catalogue's only
 * true duplication. This is the case that drives panels, so what it adds is its own: a full-width
 * track, `role="tablist"` with keyboard selection, Base UI's `Tabs.Indicator` for the pill, and
 * `data-active` where a toggle group reads `data-pressed`. iOS 26: a 32 pt capsule on the
 * tertiary fill with a 2 pt inset and a white, shadowed pill; macOS 26: 24 pt with 6 pt corners
 * and an accent-filled selection; the web keeps TV's 32 pt pill.
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
      className={cn(segmentedTrackClassName, "w-full", className)}
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className={cn(
          segmentedIndicatorClassName,
          "w-(--active-tab-width) translate-x-(--active-tab-left)"
        )}
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
        segmentedItemClassName,
        "data-active:font-semibold data-active:text-(--toggle-group-pressed-text)",
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

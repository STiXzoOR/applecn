"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "cn"

import { SegmentedControlItem, SegmentedControlList } from "./segmented-control"

/**
 * Tab views: a segmented control that switches between closely related subviews (the Calendar
 * "New Event" sheet). For an app's top-level sections use `TabBar`.
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

const TabsList = SegmentedControlList
const TabsTab = SegmentedControlItem

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("flex-1 type-body outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsPanel, TabsTab }

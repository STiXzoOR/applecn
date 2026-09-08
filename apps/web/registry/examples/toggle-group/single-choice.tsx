"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@applecn/ui/components/toggle-group"

export default function ToggleGroupSingleChoice() {
  return (
    <ToggleGroup
      aria-label="Range"
      defaultValue={["week"]}
      className="w-full max-w-sm"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  )
}

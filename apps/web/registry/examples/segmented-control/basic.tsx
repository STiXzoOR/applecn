"use client"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@apple-ds/ui/components/segmented-control"

export default function SegmentedControlBasic() {
  return (
    <SegmentedControl
      aria-label="Range"
      defaultValue="week"
      className="w-full max-w-sm"
    >
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
      <SegmentedControlItem value="year">Year</SegmentedControlItem>
    </SegmentedControl>
  )
}

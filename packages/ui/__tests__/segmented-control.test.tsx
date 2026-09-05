import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "../src/components/segmented-control"

function Range() {
  return (
    <SegmentedControl defaultValue="day" aria-label="Range">
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  )
}

describe("SegmentedControl", () => {
  test("is a tab list with one selected segment", () => {
    render(<Range />)
    const list = screen.getByRole("tablist", { name: "Range" })
    expect(list).toHaveAttribute("data-slot", "segmented-control")
    expect(screen.getAllByRole("tab")).toHaveLength(3)
    expect(screen.getByRole("tab", { name: "Day" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  test("arrow keys move the selection", async () => {
    render(<Range />)
    screen.getByRole("tab", { name: "Day" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Week" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  test("is a 32 pt capsule with a 2 pt inset and a sliding white indicator", () => {
    render(<Range />)
    const list = screen.getByRole("tablist")
    expect(list.className).toContain("h-(--segmented-height)")
    expect(list.className).toContain("p-(--segmented-inset)")
    expect(list.className).toContain("rounded-full")
    expect(list.className).toContain("bg-fill-3")
    const indicator = list.querySelector(
      '[data-slot="segmented-control-indicator"]'
    )!
    expect(indicator.className).toContain("rounded-full")
    expect(indicator.className).toContain("bg-background")
    expect(indicator.className).toContain("shadow-segment")
    const tab = screen.getByRole("tab", { name: "Day" })
    expect(tab.className).toContain("type-footnote")
    expect(tab.className).toContain("data-active:font-semibold")
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Checkbox } from "../src/components/checkbox"

describe("Checkbox", () => {
  test("toggles and shows a check mark when on", async () => {
    render(<Checkbox aria-label="Remember me" />)
    const c = screen.getByRole("checkbox", { name: "Remember me" })
    expect(c).toHaveAttribute("aria-checked", "false")
    expect(c).toHaveAttribute("data-slot", "checkbox")
    expect(c.querySelector("svg")).toBeNull()
    await userEvent.click(c)
    expect(c).toHaveAttribute("aria-checked", "true")
    expect(
      c.querySelector('[data-slot="checkbox-indicator"] svg')
    ).not.toBeNull()
  })

  test("is a 22 pt circle on iOS and a 16 pt rounded square with a bezel on macOS, from the same classes", () => {
    render(<Checkbox aria-label="Shape" />)
    const c = screen.getByRole("checkbox")
    expect(c.className).toContain("size-(--checkbox-size)")
    expect(c.className).toContain("rounded-checkbox")
    expect(c.className).toContain("border-gray-3")
    expect(c.className).toContain("macos:data-unchecked:bg-background-3")
    expect(c.className).toContain("macos:shadow-control")
    expect(c.className).toContain("data-checked:bg-primary")
    expect(c.className).toContain("data-checked:border-primary")
  })

  test("supports the mixed state for a group-controlling checkbox", () => {
    render(<Checkbox aria-label="All styles" indeterminate />)
    const c = screen.getByRole("checkbox")
    expect(c).toHaveAttribute("aria-checked", "mixed")
    expect(c.querySelector('[data-slot="checkbox-indicator"]')).not.toBeNull()
  })
})

describe("Checkbox layout and state styling", () => {
  test("sizes the tick and the mixed dash against a filled indicator, never a percentage of an auto-sized box", () => {
    render(<Checkbox aria-label="Sizing" defaultChecked />)
    const indicator = screen
      .getByRole("checkbox")
      .querySelector('[data-slot="checkbox-indicator"]')!
    // The glyphs are sized in percentages, so the indicator must have a definite
    // size of its own — a shrink-to-fit grid collapses them to a few pixels.
    expect(indicator.className).toContain("size-full")
    expect(indicator.className).not.toContain("place-content-center")
  })

  test("dims and blocks the pointer when disabled", () => {
    render(<Checkbox aria-label="Unavailable" disabled />)
    const c = screen.getByRole("checkbox")
    expect(c).toHaveAttribute("data-disabled")
    // Base UI renders the root as a <span>, so `:disabled` never matches it.
    expect(c.className).not.toMatch(/(^|\s)disabled:/)
    expect(c.className).toContain("data-disabled:opacity-40")
    expect(c.className).toContain("data-disabled:cursor-not-allowed")
  })

  test("keeps its enlarged hit area inside the row gap so it cannot steal a neighbour's clicks", () => {
    render(<Checkbox aria-label="Hit area" />)
    const c = screen.getByRole("checkbox")
    expect(c.className).toContain("after:absolute")
    expect(c.className).not.toContain("after:-inset-2")
  })
})

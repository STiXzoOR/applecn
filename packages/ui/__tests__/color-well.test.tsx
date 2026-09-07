import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { ColorWell } from "../src/components/color-well"

describe("ColorWell", () => {
  test("is a colour input shown as the platform's well: a 28 pt ring on iOS, AppKit's 48×24 capsule on macOS", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const input = screen.getByLabelText("Highlight")
    expect(input).toHaveAttribute("type", "color")
    expect(input).toHaveValue("#ff3b30")
    const well = input.closest('[data-slot="color-well"]')!
    expect(well.className).toContain("rounded-(--color-well-radius)")
    expect(well.className).toContain("h-(--color-well-height)")
    expect(well.className).toContain("w-(--color-well-width)")
    expect(well.className).toContain(
      "border-(length:--color-well-border-width)"
    )
    expect(well.className).toContain("bg-(--color-well-bg)")
    expect(well.className).toContain("p-(--color-well-padding)")
    expect(well.className).toContain("shadow-(--color-well-shadow)")
    const swatch = well.querySelector('[data-slot="color-well-swatch"]')!
    expect(swatch.className).toContain("rounded-(--color-well-swatch-radius)")
  })
})

describe("ColorWell is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const well = screen
      .getByLabelText("Highlight")
      .closest('[data-slot="color-well"]')!
    expect(well.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const swatch = well.querySelector('[data-slot="color-well-swatch"]')!
    expect(swatch.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

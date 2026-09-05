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
    expect(well.className).toContain("rounded-full")
    expect(well.className).toContain("macos:rounded-control")
    const swatch = well.querySelector('[data-slot="color-well-swatch"]')!
    expect(swatch.className).toContain("rounded-full")
  })
})

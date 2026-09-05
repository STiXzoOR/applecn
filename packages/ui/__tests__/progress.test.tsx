import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Progress, ProgressCircular } from "../src/components/progress"

describe("Progress", () => {
  test("a linear bar exposes its value and paints the indicator to that width", () => {
    render(<Progress value={40} aria-label="Download" />)
    const bar = screen.getByRole("progressbar", { name: "Download" })
    expect(bar).toHaveAttribute("aria-valuenow", "40")
    const track = bar.querySelector('[data-slot="progress-track"]')!
    expect(track.className).toContain("h-(--progress-height)")
    expect(track.className).toContain("bg-fill-2")
    const indicator = bar.querySelector('[data-slot="progress-indicator"]')!
    expect(indicator.className).toContain("bg-primary")
    expect(indicator.getAttribute("style")).toMatch(/40%/)
  })

  test("an indeterminate bar has no value and animates", () => {
    render(<Progress value={null} aria-label="Working" />)
    const bar = screen.getByRole("progressbar", { name: "Working" })
    expect(bar).not.toHaveAttribute("aria-valuenow")
    expect(
      bar.querySelector('[data-slot="progress-indicator"]')!.className
    ).toContain("animate-")
  })

  test("the circular variant draws a ring whose dash offset follows the value", () => {
    render(<ProgressCircular value={25} aria-label="Upload" size="large" />)
    const ring = screen.getByRole("progressbar", { name: "Upload" })
    expect(ring).toHaveAttribute("aria-valuenow", "25")
    expect(ring.getAttribute("class")).toContain("size-(--spinner-large)")
    const arc = ring.querySelector(
      '[data-slot="progress-circular-indicator"]'
    ) as SVGCircleElement
    expect(arc.getAttribute("stroke-dashoffset")).toBe("75")
  })
})

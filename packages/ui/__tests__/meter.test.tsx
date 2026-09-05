import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Gauge, Meter } from "../src/components/meter"

describe("Meter", () => {
  test("is a labelled meter whose indicator fills to the value", () => {
    render(<Meter value={64} label="Storage" />)
    const meter = screen.getByRole("meter", { name: "Storage" })
    expect(meter).toHaveAttribute("aria-valuenow", "64")
    expect(meter).toHaveAttribute("data-slot", "meter")
    expect(screen.getByText("64%")).toHaveAttribute("data-slot", "meter-value")
    const track = meter.querySelector('[data-slot="meter-track"]')!
    expect(track.className).toContain("h-(--progress-height)")
    expect(track.className).toContain("bg-fill-2")
    const indicator = meter.querySelector('[data-slot="meter-indicator"]')!
    expect(indicator.className).toContain("bg-primary")
  })

  test("can be tinted for capacity levels", () => {
    render(<Meter value={92} label="Battery" color="red" />)
    expect(
      screen.getByRole("meter").querySelector('[data-slot="meter-indicator"]')!
        .className
    ).toContain("bg-system-red")
  })
})

describe("Gauge", () => {
  test("is a circular meter with the value in the middle", () => {
    render(<Gauge value={40} label="Move" />)
    const gauge = screen.getByRole("meter", { name: "Move" })
    expect(gauge).toHaveAttribute("aria-valuenow", "40")
    expect(gauge).toHaveAttribute("data-slot", "gauge")
    const indicator = gauge.querySelector('[data-slot="gauge-indicator"]')!
    expect(indicator).toHaveAttribute("stroke-dashoffset", "60")
    expect(screen.getByText("40")).toBeInTheDocument()
  })

  test("sizes come from the activity indicator tokens", () => {
    render(<Gauge value={10} label="Small" size="medium" />)
    expect(screen.getByRole("meter").className).toContain(
      "size-(--spinner-large)"
    )
  })
})

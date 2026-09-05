import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Slider } from "../src/components/slider"

describe("Slider", () => {
  test("exposes a slider thumb with its value and moves with the arrow keys", async () => {
    render(<Slider aria-label="Volume" defaultValue={40} step={5} />)
    // Base UI keeps the thumb `visibility: hidden` until it has measured it, which jsdom never does,
    // and a hidden element gets no accessible name; the label query finds the range input anyway.
    const thumb = screen.getByLabelText("Volume")
    expect(thumb).toHaveAttribute("type", "range")
    expect(thumb).toHaveAttribute("aria-valuenow", "40")
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(thumb).toHaveAttribute("aria-valuenow", "45")
  })

  test("is the iOS 26 slider: a 6 pt track with the 37×24 pill knob, from the platform tokens", () => {
    const { container } = render(
      <Slider aria-label="Brightness" defaultValue={50} />
    )
    const track = container.querySelector('[data-slot="slider-track"]')!
    expect(track.className).toContain("h-(--slider-track)")
    expect(track.className).toContain("bg-fill")
    expect(
      container.querySelector('[data-slot="slider-range"]')!.className
    ).toContain("bg-primary")
    const thumb = container.querySelector('[data-slot="slider-thumb"]')!
    expect(thumb.className).toContain("w-(--slider-thumb-width)")
    expect(thumb.className).toContain("h-(--slider-thumb-height)")
    expect(thumb.className).toContain("knob")
    expect(thumb.className).toContain("data-dragging:scale-110")
  })

  test("minimum and maximum value labels flank the track", () => {
    render(
      <Slider
        aria-label="Text size"
        defaultValue={2}
        min={1}
        max={3}
        minimumValueLabel={<span data-testid="min">A</span>}
        maximumValueLabel={<span data-testid="max">A</span>}
      />
    )
    expect(
      screen.getByTestId("min").closest('[data-slot="slider-minimum-label"]')
    ).not.toBeNull()
    expect(
      screen.getByTestId("max").closest('[data-slot="slider-maximum-label"]')
    ).not.toBeNull()
  })
})

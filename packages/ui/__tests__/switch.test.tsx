import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Switch, switchVariants } from "../src/components/switch"

describe("Switch", () => {
  test("is a switch that toggles on click and on Space", async () => {
    render(<Switch aria-label="Wi-Fi" />)
    const s = screen.getByRole("switch", { name: "Wi-Fi" })
    expect(s).toHaveAttribute("aria-checked", "false")
    expect(s).toHaveAttribute("data-slot", "switch")
    await userEvent.click(s)
    expect(s).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard(" ")
    expect(s).toHaveAttribute("aria-checked", "false")
  })

  test("is the iOS 26 switch: a 63×28 track with a 37×24 oval knob inset 2, from the platform tokens", () => {
    render(<Switch aria-label="Bluetooth" />)
    const s = screen.getByRole("switch")
    expect(s.className).toContain("w-(--switch-width)")
    expect(s.className).toContain("h-(--switch-height)")
    const thumb = s.querySelector('[data-slot="switch-thumb"]')!
    expect(thumb.className).toContain("w-(--switch-thumb-width)")
    expect(thumb.className).toContain("h-(--switch-thumb-height)")
    expect(thumb.className).toContain("knob")
    expect(thumb.className).toContain("start-(--switch-inset)")
    expect(thumb.className).toContain(
      "data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb-width)-2*var(--switch-inset))]"
    )
  })

  test("the knob stretches while pressed, like the Liquid Glass lens", () => {
    render(<Switch aria-label="Stretch" />)
    const thumb = screen
      .getByRole("switch")
      .querySelector('[data-slot="switch-thumb"]')!
    expect(thumb.className).toContain(
      "group-active/switch:w-[calc(var(--switch-thumb-width)+6px)]"
    )
    expect(thumb.className).toContain(
      "group-active/switch:data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb-width)-2*var(--switch-inset)-6px)]"
    )
  })

  test("on is system green by default and the accent colour on request; off is the tertiary label", () => {
    expect(switchVariants()).toContain("data-checked:bg-system-green")
    expect(switchVariants({ color: "tint" })).toContain(
      "data-checked:bg-primary"
    )
    expect(switchVariants()).toContain("data-unchecked:bg-label-3")
  })

  test("disabled switches are dimmed and inert", async () => {
    render(<Switch aria-label="Off" disabled />)
    const s = screen.getByRole("switch")
    expect(s).toHaveAttribute("aria-disabled", "true")
    expect(s).toHaveAttribute("data-disabled")
    await userEvent.click(s)
    expect(s).toHaveAttribute("aria-checked", "false")
  })
})

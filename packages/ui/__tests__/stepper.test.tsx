import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Stepper } from "../src/components/stepper"
import { PlatformProvider } from "../src/lib/platform"

describe("Stepper", () => {
  test("is a two-segment group that increments and decrements a value", async () => {
    render(<Stepper aria-label="Copies" defaultValue={1} min={0} max={3} />)
    const group = screen.getByRole("group", { name: "Copies" })
    expect(group).toHaveAttribute("data-slot", "stepper")
    const input = group.querySelector("input")!
    expect(input).toHaveValue("1")
    await userEvent.click(screen.getByRole("button", { name: "Increment" }))
    expect(input).toHaveValue("2")
    await userEvent.click(screen.getByRole("button", { name: "Decrement" }))
    expect(input).toHaveValue("1")
  })

  test("is the 94×32 capsule on iOS, with a hairline between the halves", () => {
    render(<Stepper aria-label="Copies" defaultValue={1} />)
    const group = screen.getByRole("group")
    expect(group).toHaveAttribute("data-orientation", "horizontal")
    expect(group.className).toContain("w-(--stepper-width)")
    expect(group.className).toContain("h-(--stepper-height)")
    expect(group.className).toContain("rounded-stepper")
    expect(group.className).toContain("bg-fill-3")
    expect(group.querySelector('[data-slot="stepper-divider"]')).not.toBeNull()
  })

  test("on macOS it is AppKit's 20×26 vertical stepper: increment above decrement, on the bezel", () => {
    render(
      <PlatformProvider platform="macos">
        <Stepper aria-label="Copies" defaultValue={1} />
      </PlatformProvider>
    )
    const group = screen.getByRole("group")
    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group.className).toContain("flex-col")
    expect(group.className).toContain("bg-background-3")
    expect(group.className).toContain("shadow-control")
    const buttons = screen.getAllByRole("button")
    expect(buttons[0]).toHaveAccessibleName("Increment")
    expect(buttons[1]).toHaveAccessibleName("Decrement")
  })

  test("disables the segment at a bound", () => {
    render(<Stepper aria-label="Copies" defaultValue={3} max={3} />)
    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Decrement" })).toBeEnabled()
  })
})

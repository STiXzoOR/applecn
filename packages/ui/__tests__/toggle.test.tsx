import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Toggle, toggleVariants } from "../src/components/toggle"

describe("Toggle", () => {
  test("is a pressable button that reports its state", async () => {
    render(<Toggle aria-label="Filter">F</Toggle>)
    const t = screen.getByRole("button", { name: "Filter" })
    expect(t).toHaveAttribute("aria-pressed", "false")
    expect(t).toHaveAttribute("data-slot", "toggle")
    await userEvent.click(t)
    expect(t).toHaveAttribute("aria-pressed", "true")
  })

  test("pressed state is the tinted fill, like the Phone app filter button", () => {
    expect(toggleVariants()).toContain("data-pressed:bg-primary/15")
    expect(toggleVariants()).toContain("data-pressed:text-primary")
  })

  test("sizes read the platform control heights and the shape defaults to a capsule", () => {
    expect(toggleVariants({ size: "small" })).toContain(
      "h-(--control-height-small)"
    )
    expect(toggleVariants()).toContain("rounded-full")
    expect(toggleVariants({ shape: "circle" })).toContain("aspect-square")
  })
})

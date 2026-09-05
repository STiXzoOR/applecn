import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { Button, buttonVariants } from "../src/components/button"
import { checkA11y } from "./helpers/axe"

describe("Button", () => {
  test("filled is the default style, at the regular size, as a capsule", () => {
    render(<Button>Continue</Button>)
    const b = screen.getByRole("button", { name: "Continue" })
    expect(b).toHaveAttribute("data-slot", "button")
    expect(b).toHaveAttribute("data-variant", "filled")
    expect(b).toHaveAttribute("data-size", "regular")
    expect(b).toHaveAttribute("data-shape", "capsule")
    expect(b.className).toContain("bg-primary")
    expect(b.className).toContain("h-(--control-height-regular)")
    expect(b.className).toContain("rounded-full")
    expect(b.className).toContain("type-body")
    expect(b.className).toContain("font-semibold")
  })

  test.each([
    ["tinted", "bg-primary/15"],
    ["gray", "bg-fill-3"],
    ["bordered", "border-border"],
    ["plain", "text-primary"],
    ["glass", "glass"],
    ["glass-prominent", "glass-prominent"],
    ["destructive", "text-destructive"],
    ["link", "underline-offset-4"],
  ] as const)("%s style", (variant, cls) => {
    expect(buttonVariants({ variant })).toContain(cls)
  })

  test.each(["mini", "small", "regular", "large", "xl"] as const)(
    "size %s reads its height from the platform tokens",
    (size) => {
      expect(buttonVariants({ size })).toContain(`h-(--control-height-${size})`)
    }
  )

  test("rounded uses the control radius; circle is square with no padding", () => {
    expect(buttonVariants({ shape: "rounded" })).toContain("rounded-lg")
    const circle = buttonVariants({ shape: "circle" })
    expect(circle).toContain("aspect-square")
    expect(circle).toContain("px-0")
  })

  test("icon-only buttons need a label to pass axe", async () => {
    const { container } = render(
      <Button shape="circle" aria-label="Close">
        <svg aria-hidden="true" />
      </Button>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })

  test("activates from the keyboard", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("disabled buttons are not clickable and are dimmed", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>
    )
    const b = screen.getByRole("button", { name: "No" })
    expect(b).toBeDisabled()
    expect(b.className).toContain("disabled:opacity-40")
  })
})

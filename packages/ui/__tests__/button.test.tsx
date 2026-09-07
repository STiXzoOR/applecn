import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { Button, buttonVariants } from "../src/components/button"
import { checkA11y } from "./helpers/axe"

describe("Button", () => {
  test("filled is the default style, at the regular size, in the platform's shape (a capsule on iOS, 6 pt corners on macOS)", () => {
    render(<Button>Continue</Button>)
    const b = screen.getByRole("button", { name: "Continue" })
    expect(b).toHaveAttribute("data-slot", "button")
    expect(b).toHaveAttribute("data-variant", "filled")
    expect(b).toHaveAttribute("data-size", "regular")
    expect(b).toHaveAttribute("data-shape", "automatic")
    expect(b.className).toContain("bg-primary")
    expect(b.className).toContain("h-(--control-height-regular)")
    expect(b.className).toContain("rounded-(--control-radius-regular)")
    expect(b.className).toContain("px-(--control-padding-x-regular)")
    expect(b.className).toContain("text-[length:var(--control-font-regular)]")
    expect(b.className).toContain("font-(--button-font-weight)")
  })

  test("the gray style is the macOS push-button bezel and apple.com's neutral pill", () => {
    const gray = buttonVariants({ variant: "gray" })
    expect(gray).toContain("bg-(--button-gray-bg)")
    expect(gray).toContain("text-(--button-gray-text)")
    expect(gray).toContain("shadow-(--button-gray-shadow)")
  })

  test.each([
    ["tinted", "bg-primary/15"],
    ["gray", "bg-(--button-gray-bg)"],
    ["bordered", "border-(--button-bordered-border)"],
    ["plain", "text-primary"],
    ["glass", "glass"],
    ["glass-prominent", "glass-prominent"],
    ["destructive", "text-destructive"],
    ["link", "underline-offset-4"],
  ] as const)("%s style", (variant, cls) => {
    expect(buttonVariants({ variant })).toContain(cls)
  })

  test.each(["mini", "small", "regular", "large", "xl"] as const)(
    "size %s reads its height, radius, padding and label size from the platform tokens",
    (size) => {
      const classes = buttonVariants({ size })
      expect(classes).toContain(`h-(--control-height-${size})`)
      expect(classes).toContain(`rounded-(--control-radius-${size})`)
      expect(classes).toContain(`px-(--control-padding-x-${size})`)
      expect(classes).toContain(`text-[length:var(--control-font-${size})]`)
    }
  )

  test("capsule forces a pill, rounded the lg corner; circle is square with no padding", () => {
    expect(buttonVariants({ shape: "capsule" })).toContain("rounded-full")
    expect(buttonVariants({ shape: "rounded" })).toContain("rounded-lg")
    const circle = buttonVariants({ shape: "circle" })
    expect(circle).toContain("aspect-square")
    expect(circle).toContain("px-0")
    expect(circle).toContain("rounded-full")
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

describe("Button is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", () => {
    render(<Button variant="bordered">Tokens</Button>)
    const b = screen.getByRole("button", { name: "Tokens" })
    expect(b.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(b.className).toContain("font-(--button-font-weight)")
    expect(b.className).toContain("active:scale-(--button-active-scale)")
    expect(b.className).toContain("border-(--button-bordered-border)")
    expect(b.className).toContain("bg-(--button-bordered-bg)")
    expect(b.className).toContain("text-(--button-bordered-text)")
    expect(b.className).toContain("shadow-(--button-bordered-shadow)")
    expect(b.className).toContain("hover:bg-(--button-bordered-hover-bg)")
    expect(b.className).toContain("hover:text-(--button-bordered-hover-text)")
  })

  test.each(["filled", "gray"] as const)(
    "%s carries no platform variant either",
    (variant) => {
      render(<Button variant={variant}>Tokens</Button>)
      const b = screen.getByRole("button", { name: "Tokens" })
      expect(b.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    }
  )
})

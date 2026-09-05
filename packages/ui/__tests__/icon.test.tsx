import { Search01Icon } from "@hugeicons/core-free-icons"
import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Icon, iconVariants } from "../src/components/icon"
import { checkA11y } from "./helpers/axe"

describe("Icon", () => {
  test("is decorative by default: an svg hidden from assistive technology", () => {
    const { container } = render(<Icon icon={Search01Icon} />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).toHaveAttribute("data-slot", "icon")
    expect(svg).toHaveAttribute("data-scale", "medium")
  })

  test("with a label it becomes an image with a name", async () => {
    const { container } = render(
      <Icon icon={Search01Icon} aria-label="Search" />
    )
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("role", "img")
    expect(svg).toHaveAttribute("aria-label", "Search")
    expect(svg).not.toHaveAttribute("aria-hidden")
    expect(await checkA11y(container)).toHaveNoViolations()
  })

  test("scales are relative to the text like SF Symbols", () => {
    expect(iconVariants({ scale: "small" })).toContain("size-[0.85em]")
    expect(iconVariants({ scale: "medium" })).toContain("size-[1.2em]")
    expect(iconVariants({ scale: "large" })).toContain("size-[1.5em]")
  })

  test("weights map to stroke widths", () => {
    const { container } = render(<Icon icon={Search01Icon} weight="bold" />)
    expect(container.querySelector("svg")).toHaveAttribute(
      "stroke-width",
      "2.5"
    )
  })
})

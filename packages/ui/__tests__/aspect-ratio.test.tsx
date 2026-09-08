import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { AspectRatio } from "../src/components/aspect-ratio"
import { checkA11y } from "./helpers/axe"

describe("AspectRatio", () => {
  test("holds its ratio open around whatever it is given", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="frame">
        <span role="img" aria-label="Hero" />
      </AspectRatio>
    )
    const frame = screen.getByTestId("frame")
    expect(frame).toHaveAttribute("data-slot", "aspect-ratio")
    expect(frame.className).toContain("relative")
    expect(frame.className).toContain("aspect-(--ratio)")
    expect(frame).toContainElement(screen.getByRole("img", { name: "Hero" }))
  })

  test("the ratio reaches CSS as a custom property, so any number works", () => {
    const { rerender } = render(<AspectRatio ratio={1} data-testid="frame" />)
    expect(screen.getByTestId("frame").getAttribute("style")).toContain(
      "--ratio: 1"
    )

    rerender(<AspectRatio ratio={4 / 3} data-testid="frame" />)
    expect(screen.getByTestId("frame").getAttribute("style")).toContain(
      `--ratio: ${4 / 3}`
    )
  })

  test("a caller's className and style survive", () => {
    render(
      <AspectRatio
        ratio={1}
        className="rounded-card"
        style={{ width: 200 }}
        data-testid="frame"
      />
    )
    const frame = screen.getByTestId("frame")
    expect(frame.className).toContain("rounded-card")
    expect(frame.getAttribute("style")).toContain("--ratio: 1")
    expect(frame).toHaveStyle({ width: "200px" })
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <span role="img" aria-label="Hero" />
      </AspectRatio>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

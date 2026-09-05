import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Glass, glassVariants } from "../src/components/glass"
import { Material, materialVariants } from "../src/components/material"

describe("Material", () => {
  test("renders the regular material by default", () => {
    render(<Material>Content</Material>)
    const el = screen.getByText("Content")
    expect(el).toHaveAttribute("data-slot", "material")
    expect(el).toHaveAttribute("data-thickness", "regular")
    expect(el.className).toContain("material-regular")
  })

  test("every thickness has its utility", () => {
    expect(materialVariants({ thickness: "ultra-thin" })).toContain(
      "material-ultra-thin"
    )
    expect(materialVariants({ thickness: "thin" })).toContain("material-thin")
    expect(materialVariants({ thickness: "thick" })).toContain("material-thick")
  })
})

describe("Glass", () => {
  test("renders regular glass as a capsule by default", () => {
    render(<Glass>Bar</Glass>)
    const el = screen.getByText("Bar")
    expect(el).toHaveAttribute("data-slot", "glass")
    expect(el).toHaveAttribute("data-variant", "regular")
    expect(el.className).toContain("glass")
    expect(el.className).toContain("rounded-full")
  })

  test("clear and prominent glass, rounded and circular shapes, interactivity", () => {
    expect(glassVariants({ variant: "clear" })).toContain("glass-clear")
    expect(glassVariants({ variant: "prominent" })).toContain("glass-prominent")
    expect(glassVariants({ shape: "rounded" })).toContain("rounded-4xl")
    expect(glassVariants({ shape: "circle" })).toContain("aspect-square")
    expect(glassVariants({ interactive: true })).toContain("pressable")
  })
})

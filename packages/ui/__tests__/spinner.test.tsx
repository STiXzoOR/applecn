import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Spinner, spinnerVariants } from "../src/components/spinner"

describe("Spinner (activity indicator)", () => {
  test("is a status region named Loading with eight bars", () => {
    render(<Spinner />)
    const s = screen.getByRole("status", { name: "Loading" })
    expect(s).toHaveAttribute("data-slot", "spinner")
    expect(s.querySelectorAll('[data-slot="spinner-bar"]')).toHaveLength(8)
  })

  test("medium and large read the platform sizes", () => {
    expect(spinnerVariants({ size: "medium" })).toContain(
      "size-(--spinner-medium)"
    )
    expect(spinnerVariants({ size: "large" })).toContain(
      "size-(--spinner-large)"
    )
  })

  test("the label can be changed and the bars stop under reduced motion", () => {
    render(<Spinner label="Syncing" />)
    expect(screen.getByRole("status", { name: "Syncing" })).toBeInTheDocument()
    expect(spinnerVariants()).toContain("motion-reduce:[&>*]:animate-none")
  })
})

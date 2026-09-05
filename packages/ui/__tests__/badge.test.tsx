import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Badge, badgeVariants } from "../src/components/badge"

describe("Badge", () => {
  test("a count badge is the red capsule from the tab bar", () => {
    render(<Badge>3</Badge>)
    const b = screen.getByText("3")
    expect(b).toHaveAttribute("data-slot", "badge")
    expect(b).toHaveAttribute("data-variant", "count")
    expect(b.className).toContain("bg-system-red")
    expect(b.className).toContain("text-white")
    expect(b.className).toContain("h-(--badge-height)")
    expect(b.className).toContain("min-w-(--badge-min-width)")
    expect(b.className).toContain("rounded-full")
  })

  test("tag and filled variants", () => {
    expect(badgeVariants({ variant: "tag" })).toContain("bg-primary/15")
    expect(badgeVariants({ variant: "tag" })).toContain("text-primary")
    expect(badgeVariants({ variant: "filled" })).toContain("bg-primary")
    expect(badgeVariants({ variant: "filled" })).toContain(
      "text-primary-foreground"
    )
  })

  test("a live badge announces changes", () => {
    render(<Badge live>12</Badge>)
    expect(screen.getByRole("status")).toHaveTextContent("12")
  })
})

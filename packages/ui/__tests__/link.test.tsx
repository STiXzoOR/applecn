import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Link, linkVariants } from "../src/components/link"

describe("Link", () => {
  test("is an anchor in the link colour", () => {
    render(<Link href="/pricing">See pricing</Link>)
    const link = screen.getByRole("link", { name: "See pricing" })
    expect(link).toHaveAttribute("href", "/pricing")
    expect(link).toHaveAttribute("data-slot", "link")
    expect(link.className).toContain("text-link")
    expect(link.className).toContain("hover:underline")
  })

  test("chevron adds apple.com's trailing › and the button style is a pill", () => {
    render(
      <Link href="/more" chevron>
        Learn more
      </Link>
    )
    const link = screen.getByRole("link", { name: /Learn more/ })
    expect(link.querySelector('[data-slot="link-chevron"]')).not.toBeNull()
    expect(linkVariants({ variant: "button" })).toContain("rounded-full")
    expect(linkVariants({ variant: "button" })).toContain("bg-primary")
  })
})

import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../src/components/pagination"
import { checkA11y } from "./helpers/axe"

function Pages({ page = 2 }: { page?: number } = {}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#1" />
        </PaginationItem>
        {[1, 2, 3].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href={`#${n}`} isActive={n === page}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#9" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe("Pagination", () => {
  test("is a named navigation landmark over a list of pages", () => {
    render(<Pages />)
    const nav = screen.getByRole("navigation", { name: "pagination" })
    expect(nav).toHaveAttribute("data-slot", "pagination")
    const list = nav.querySelector('[data-slot="pagination-content"]')!
    expect(list.tagName).toBe("UL")
    expect(list.querySelectorAll('[data-slot="pagination-item"]').length).toBe(
      6
    )
    expect(list.firstElementChild!.tagName).toBe("LI")
  })

  test("each page stays a link, and the current one is marked exactly once", () => {
    render(<Pages page={2} />)
    const current = screen.getByRole("link", { name: "2" })
    expect(current).toHaveAttribute("data-slot", "pagination-link")
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current).toHaveAttribute("data-active", "true")
    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute(
      "aria-current"
    )
    expect(
      screen.getAllByRole("link").filter((a) => a.hasAttribute("aria-current"))
    ).toHaveLength(1)
  })

  test("a page wears the small circular control, the current one tinted", () => {
    render(<Pages page={2} />)
    const current = screen.getByRole("link", { name: "2" })
    expect(current).toHaveAttribute("data-variant", "tinted")
    expect(current.className).toContain("h-(--control-height-small)")
    expect(current.className).toContain("aspect-square")
    expect(current.className).toContain("rounded-full")
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "data-variant",
      "plain"
    )
  })

  test("Previous and Next keep their names, and give the label a line of its own on wide screens", () => {
    render(<Pages />)
    const previous = screen.getByRole("link", { name: "Go to previous page" })
    expect(previous).toHaveAttribute("data-shape", "automatic")
    const label = previous.querySelector("span")!
    expect(label).toHaveTextContent("Previous")
    expect(label.className).toContain("hidden")
    expect(label.className).toContain("sm:block")
    expect(
      screen.getByRole("link", { name: "Go to next page" })
    ).toHaveTextContent("Next")
  })

  test("the label of either end can be renamed", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#1" text="Newer" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#3" text="Older" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole("link", { name: "Go to previous page" })
    ).toHaveTextContent("Newer")
    expect(
      screen.getByRole("link", { name: "Go to next page" })
    ).toHaveTextContent("Older")
  })

  /**
   * shadcn puts `aria-hidden` on the ellipsis and an `sr-only` "More pages" INSIDE it, which
   * hides the whole subtree: the label can never be announced, and copying it verbatim shipped a
   * span that does nothing. The glyph is the decoration and the label is the meaning, so the
   * hiding belongs on the glyph — which `Icon` already does for an unlabelled icon.
   */
  test("the gap announces itself, and only its glyph is decoration", () => {
    render(<Pages />)
    const ellipsis = document.querySelector(
      '[data-slot="pagination-ellipsis"]'
    )!
    expect(ellipsis).not.toHaveAttribute("aria-hidden")
    expect(ellipsis.querySelector('[data-slot="icon"]')).toHaveAttribute(
      "aria-hidden"
    )
    expect(ellipsis).toHaveTextContent("More pages")
    expect(ellipsis.className).toContain("size-(--control-height-small)")
  })

  test("has no accessibility violations", async () => {
    const { container } = render(<Pages />)
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

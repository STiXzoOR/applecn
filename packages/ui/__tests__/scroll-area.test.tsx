import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { ScrollArea } from "../src/components/scroll-area"

describe("ScrollArea", () => {
  test("wraps its content in a viewport with overlay scrollbars that only show while scrolling", () => {
    render(
      <ScrollArea className="h-40" aria-label="Notes">
        <p>Content</p>
      </ScrollArea>
    )
    const root = screen
      .getByText("Content")
      .closest('[data-slot="scroll-area"]')!
    expect(root).not.toBeNull()
    const viewport = root.querySelector('[data-slot="scroll-area-viewport"]')!
    expect(viewport.className).toContain("overscroll-contain")
    const scrollbar = root.querySelector('[data-slot="scroll-area-scrollbar"]')!
    expect(scrollbar).toHaveAttribute("data-orientation", "vertical")
    expect(scrollbar.className).toContain("opacity-0")
    expect(scrollbar.className).toContain("data-scrolling:opacity-100")
    expect(scrollbar.className).toContain("data-hovering:opacity-100")
    const thumb = root.querySelector('[data-slot="scroll-area-thumb"]')!
    expect(thumb.className).toContain("rounded-full")
    expect(thumb.className).toContain("bg-label-3")
  })

  test("can scroll horizontally too", () => {
    render(
      <ScrollArea orientation="horizontal" aria-label="Shelf">
        <p>Wide</p>
      </ScrollArea>
    )
    const root = screen.getByText("Wide").closest('[data-slot="scroll-area"]')!
    expect(
      root.querySelector('[data-slot="scroll-area-scrollbar"]')
    ).toHaveAttribute("data-orientation", "horizontal")
  })
})

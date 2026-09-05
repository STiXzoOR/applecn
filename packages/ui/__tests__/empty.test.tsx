import { Search01Icon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "../src/components/empty"

describe("Empty (ContentUnavailableView)", () => {
  test("centres a large symbol, a bold title and a secondary description", () => {
    render(
      <Empty>
        <EmptyIcon icon={Search01Icon} />
        <EmptyTitle>No Results</EmptyTitle>
        <EmptyDescription>
          Check the spelling or try a new search.
        </EmptyDescription>
        <EmptyActions>
          <button type="button">Clear</button>
        </EmptyActions>
      </Empty>
    )
    const title = screen.getByRole("heading", { name: "No Results" })
    expect(title.className).toContain("type-title-2")
    expect(title.className).toContain("font-bold")
    const root = title.closest('[data-slot="empty"]')!
    expect(root.className).toContain("text-center")
    const icon = root.querySelector('[data-slot="empty-icon"] svg')!
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(
      screen.getByText("Check the spelling or try a new search.").className
    ).toContain("text-label-2")
    expect(
      screen
        .getByRole("button", { name: "Clear" })
        .closest('[data-slot="empty-actions"]')
    ).not.toBeNull()
  })
})

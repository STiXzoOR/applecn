import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { SearchField } from "../src/components/search-field"

describe("SearchField", () => {
  test("is a search box with the magnifier, a Search placeholder, on a capsule", () => {
    render(<SearchField aria-label="Search apps" />)
    const box = screen.getByRole("searchbox", { name: "Search apps" })
    expect(box).toHaveAttribute("placeholder", "Search")
    const root = box.closest('[data-slot="search-field"]')!
    expect(root.className).toContain("h-(--search-field-height)")
    expect(root.className).toContain("rounded-full")
    expect(root.className).toContain("bg-fill-3")
    expect(root.querySelector('[data-slot="search-field-icon"]')).not.toBeNull()
  })

  test("shows Clear once there is text, and Cancel while editing; Cancel clears and blurs", async () => {
    render(<SearchField aria-label="Search" />)
    const box = screen.getByRole("searchbox")
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull()
    await userEvent.click(box)
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    await userEvent.type(box, "maps")
    await userEvent.click(screen.getByRole("button", { name: "Clear text" }))
    expect(box).toHaveValue("")
    await userEvent.type(box, "maps")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(box).toHaveValue("")
    expect(box).not.toHaveFocus()
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull()
  })

  test("Escape clears the text", async () => {
    render(<SearchField aria-label="Search" />)
    const box = screen.getByRole("searchbox")
    await userEvent.type(box, "music")
    await userEvent.keyboard("{Escape}")
    expect(box).toHaveValue("")
  })
})

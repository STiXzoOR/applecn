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
    expect(root.className).toContain("rounded-search")
    expect(root.className).toContain("bg-(--search-field-bg)")
    expect(root.className).toContain("shadow-(--search-field-shadow)")
    expect(root.className).toContain("ps-(--search-field-padding-start)")
    expect(root.className).toContain(
      "border-(length:--search-field-border-width)"
    )
    expect(root.className).toContain("text-[length:var(--text-field-font)]")
    expect(root.querySelector('[data-slot="search-field-icon"]')).not.toBeNull()
  })

  /**
   * The capsule IS shadcn's `InputGroup` (spec §5.6): the group draws the field, the magnifier and
   * the clear button are its addons and the search box its control, so the capsule's chrome and
   * the click-to-focus behaviour are the primitive's rather than a second copy of them. The Apple
   * `data-slot` values stay on top — `ItemSeparator` overrides `Separator`'s the same way, which
   * is shadcn's own convention — so the addons are what proves the composition.
   */
  test("is built on input-group: the magnifier is an addon and the box the group's control", async () => {
    render(<SearchField aria-label="Search" />)
    const box = screen.getByRole("searchbox")
    const capsule = box.closest('[data-slot="search-field"]')!
    expect(capsule).toHaveAttribute("role", "group")
    expect(
      capsule.querySelectorAll('[data-slot="input-group-addon"]')
    ).toHaveLength(1)
    await userEvent.type(box, "maps")
    expect(
      capsule.querySelectorAll('[data-slot="input-group-addon"]')
    ).toHaveLength(2)
    expect(
      screen
        .getByRole("button", { name: "Clear text" })
        .closest('[data-slot="input-group-addon"]')
    ).toHaveAttribute("data-align", "inline-end")
  })

  test("clicking the magnifier puts the caret in the box, as tapping Apple's capsule does", async () => {
    render(<SearchField aria-label="Search" />)
    const box = screen.getByRole("searchbox")
    await userEvent.click(
      box
        .closest('[data-slot="search-field"]')!
        .querySelector('[data-slot="input-group-addon"]')!
    )
    expect(box).toHaveFocus()
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

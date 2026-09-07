import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "../src/components/menu"

function Actions() {
  return (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem>
          Copy
          <MenuShortcut>⌘C</MenuShortcut>
        </MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked>Show Ruler</MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuContent>
    </Menu>
  )
}

describe("Menu", () => {
  test("opens a menu of items from its trigger and closes on Escape", async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    const menu = await screen.findByRole("menu")
    expect(menu).toHaveAttribute("data-slot", "menu-content")
    expect(screen.getAllByRole("menuitem")).toHaveLength(3)
    expect(
      screen.getByRole("menuitemcheckbox", { name: /Show Ruler/ })
    ).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("menu")).toBeNull()
  })

  test("ArrowDown moves focus to the first item", async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    await screen.findByRole("menu")
    await userEvent.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: /Copy/ })).toHaveFocus()
  })

  test("is a 250 pt glass menu with 44 pt rows, thick group separators and red destructive items", async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    const menu = await screen.findByRole("menu")
    expect(menu.className).toContain("min-w-(--menu-width)")
    expect(menu.className).toContain("rounded-menu")
    expect(menu.className).toContain("p-(--menu-padding)")
    expect(menu.className).toContain("glass")
    const copy = screen.getByRole("menuitem", { name: /Copy/ })
    expect(copy.className).toContain("h-(--menu-item-height)")
    expect(copy.className).toContain("rounded-menu-item")
    expect(copy.className).toContain("text-[length:var(--menu-font)]")
    expect(copy.className).toContain(
      "data-highlighted:bg-(--menu-item-highlight-bg)"
    )
    expect(copy.className).toContain(
      "data-highlighted:text-(--menu-item-highlight-text)"
    )
    expect(copy.querySelector('[data-slot="menu-shortcut"]')).toHaveTextContent(
      "⌘C"
    )
    expect(
      screen.getByRole("menuitem", { name: "Delete" }).className
    ).toContain("text-destructive")
    const separator = menu.querySelector('[data-slot="menu-separator"]')!
    expect(separator.className).toContain("h-(--menu-separator-height)")
    expect(separator.className).toContain("bg-(--menu-separator-bg)")
  })
})

describe("Menu is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    const menu = await screen.findByRole("menu")
    expect(menu.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const copy = screen.getByRole("menuitem", { name: /Copy/ })
    expect(copy.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(copy.className).toContain("gap-(--menu-item-gap)")
    expect(copy.className).toContain("px-(--menu-item-px)")
    expect(copy.className).toContain("focus:bg-(--menu-item-highlight-bg)")
    expect(copy.className).toContain("focus:text-(--menu-item-highlight-text)")
    expect(copy.className).toContain(
      "data-highlighted:[&_[data-slot=menu-shortcut]]:text-(--menu-shortcut-highlight-text)"
    )
    const separator = menu.querySelector('[data-slot="menu-separator"]')!
    expect(separator.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(separator.className).toContain("mx-(--menu-separator-mx)")
  })
})

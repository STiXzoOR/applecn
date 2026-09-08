import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../src/components/menubar"

function Bar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Recent</MenubarLabel>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem>Close Window</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

describe("Menubar", () => {
  test("is the macOS menu bar: a menubar of top-level menus that open on click", async () => {
    render(<Bar />)
    const bar = screen.getByRole("menubar")
    expect(bar).toHaveAttribute("data-slot", "menubar")
    expect(bar.className).toContain("h-(--menu-bar-height)")
    const file = screen.getByRole("menuitem", { name: "File" })
    expect(file.className).toContain("data-popup-open:bg-selection")
    await userEvent.click(file)
    const item = await screen.findByRole("menuitem", { name: /New Window/ })
    expect(item.className).toContain("h-(--menu-item-height)")
    expect(item.closest('[data-slot="menubar-content"]')!.className).toContain(
      "rounded-menu"
    )
  })

  test("the group label and separator read from the shared menu tokens", async () => {
    render(<Bar />)
    await userEvent.click(screen.getByRole("menuitem", { name: "File" }))
    const label = await screen.findByText("Recent")
    expect(label.className).toContain("px-(--menu-item-px)")
    expect(label.className).toContain("py-(--menu-label-py)")
    expect(label.className).toContain(
      "text-[length:var(--menu-label-font-size)]"
    )
    expect(label.className).toContain("leading-(--menu-label-leading)")
    expect(label.className).toContain("font-(--menu-label-weight)")
    expect(label.className).toContain("tracking-(--menu-label-tracking)")
    const separator = label
      .closest('[data-slot="menubar-content"]')!
      .querySelector('[data-slot="menubar-separator"]')!
    expect(separator.className).toContain("mx-(--menu-separator-mx)")
    expect(separator.className).toContain("h-(--menu-separator-height)")
    expect(separator.className).toContain("bg-(--menu-separator-bg)")
  })
})

describe("Menubar is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(<Bar />)
    await userEvent.click(screen.getByRole("menuitem", { name: "File" }))
    const label = await screen.findByText("Recent")
    expect(label.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const separator = label
      .closest('[data-slot="menubar-content"]')!
      .querySelector('[data-slot="menubar-separator"]')!
    expect(separator.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

describe("Menubar takes shadcn's markup unchanged", () => {
  test("a radio group marks the chosen view and switches on click", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup defaultValue="list">
              <MenubarRadioItem value="icons">as Icons</MenubarRadioItem>
              <MenubarRadioItem value="list">as List</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    await userEvent.click(screen.getByRole("menuitem", { name: "View" }))
    const chosen = await screen.findByRole("menuitemradio", { name: "as List" })
    expect(chosen).toHaveAttribute("aria-checked", "true")
    expect(chosen.closest('[data-slot="menubar-radio-group"]')).not.toBeNull()
    expect(
      chosen.querySelector('[data-slot="menubar-radio-item-indicator"]')
    ).not.toBeNull()
    expect(
      chosen.closest('[data-slot="menubar-portal"]'),
      "the content portals through MenubarPortal"
    ).not.toBeNull()
    expect(MenubarPortal).toBeTypeOf("function")
  })
})

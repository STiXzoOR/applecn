import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "../src/components/menubar"

describe("Menubar", () => {
  test("is the macOS menu bar: a menubar of top-level menus that open on click", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
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
})

import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../src/components/context-menu"

function Photo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Photo</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe("ContextMenu", () => {
  test("opens on a secondary click and closes on Escape", async () => {
    render(<Photo />)
    fireEvent.contextMenu(screen.getByText("Photo"))
    const menu = await screen.findByRole("menu")
    expect(menu).toHaveAttribute("data-slot", "context-menu-content")
    expect(menu.className).toContain("glass")
    expect(
      screen.getByRole("menuitem", { name: "Delete" }).className
    ).toContain("text-destructive")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("menu")).toBeNull()
  })

  test("the group label and separator read from the shared menu tokens", async () => {
    render(<Photo />)
    fireEvent.contextMenu(screen.getByText("Photo"))
    const label = await screen.findByText("Edit")
    expect(label.className).toContain("px-(--menu-item-px)")
    expect(label.className).toContain("py-(--menu-label-py)")
    expect(label.className).toContain(
      "text-[length:var(--menu-label-font-size)]"
    )
    expect(label.className).toContain("leading-(--menu-label-leading)")
    expect(label.className).toContain("font-(--menu-label-weight)")
    expect(label.className).toContain("tracking-(--menu-label-tracking)")
    const separator = label
      .closest('[data-slot="context-menu-content"]')!
      .querySelector('[data-slot="context-menu-separator"]')!
    expect(separator.className).toContain("mx-(--menu-separator-mx)")
    expect(separator.className).toContain("h-(--menu-separator-height)")
    expect(separator.className).toContain("bg-(--menu-separator-bg)")
  })
})

describe("ContextMenu is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(<Photo />)
    fireEvent.contextMenu(screen.getByText("Photo"))
    const label = await screen.findByText("Edit")
    expect(label.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const separator = label
      .closest('[data-slot="context-menu-content"]')!
      .querySelector('[data-slot="context-menu-separator"]')!
    expect(separator.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

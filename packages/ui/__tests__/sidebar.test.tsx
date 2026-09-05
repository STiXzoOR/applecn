import { Folder01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "../src/components/sidebar"

describe("Sidebar", () => {
  test("is a navigation of labelled groups on the regular material with the current item filled", () => {
    render(
      <Sidebar aria-label="Library">
        <SidebarHeader>Notes</SidebarHeader>
        <SidebarGroup label="Favorites">
          <SidebarItem icon={StarIcon} href="/starred" current>
            Starred
          </SidebarItem>
          <SidebarItem icon={Folder01Icon} href="/all">
            All Notes
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>
    )
    const nav = screen.getByRole("navigation", { name: "Library" })
    expect(nav).toHaveAttribute("data-slot", "sidebar")
    expect(nav.className).toContain("material-regular")
    expect(screen.getByText("Favorites").className).toContain("type-caption-1")
    const starred = screen.getByRole("link", { name: "Starred" })
    expect(starred).toHaveAttribute("aria-current", "page")
    expect(starred.className).toContain("aria-[current=page]:bg-fill-3")
    expect(starred.className).toContain("h-(--list-row-min-height)")
    expect(
      starred
        .querySelector('[data-slot="sidebar-item-icon"]')!
        .getAttribute("class")
    ).toContain("text-primary")
  })

  test("a collapsible group hides its items", async () => {
    render(
      <Sidebar aria-label="Library">
        <SidebarGroup label="Folders" collapsible defaultOpen={false}>
          <SidebarItem href="/work">Work</SidebarItem>
        </SidebarGroup>
      </Sidebar>
    )
    expect(screen.queryByRole("link", { name: "Work" })).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Folders" }))
    expect(screen.getByRole("link", { name: "Work" })).toBeVisible()
  })
})

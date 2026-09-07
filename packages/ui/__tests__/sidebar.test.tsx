import { Folder01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
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
    expect(screen.getByText("Favorites").className).toContain(
      "text-(--sidebar-group-label-text)"
    )
    const starred = screen.getByRole("link", { name: "Starred" })
    expect(starred).toHaveAttribute("aria-current", "page")
    expect(starred.className).toContain("aria-[current=page]:bg-fill-3")
    expect(starred.className).toContain("h-(--sidebar-row-height)")
    expect(starred.className).toContain("rounded-sidebar")
    expect(starred.className).toContain("text-[length:var(--sidebar-font)]")
    expect(starred.className).toContain("gap-(--sidebar-item-gap)")
    expect(nav.className).toContain("w-(--sidebar-width)")
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

describe("SidebarItem as a link", () => {
  test("passes the caller's attributes through to the anchor", () => {
    render(
      <SidebarItem href="https://example.com" target="_blank" rel="noreferrer">
        GitHub
      </SidebarItem>
    )
    const link = screen.getByRole("link", { name: "GitHub" })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })
})

describe("a collapsible Sidebar", () => {
  function Library() {
    return (
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar collapsible aria-label="Library" title="Browse">
          <SidebarGroup>
            <SidebarItem href="/albums">Albums</SidebarItem>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    )
  }

  test("stands in the layout on a wide window and hides its trigger there", () => {
    render(<Library />)
    const nav = screen.getByRole("navigation", { name: "Library" })
    expect(nav.className).toContain("lg:flex")
    expect(nav.className).toContain("hidden")
    expect(screen.getByRole("button", { name: "Menu" }).className).toContain(
      "lg:hidden"
    )
  })

  test("presents the same rows in a sheet when the trigger is used", async () => {
    render(<Library />)
    expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const sheet = await screen.findByRole("dialog")
    // The sheet is modal, so its copy of the rows is the only one exposed.
    const rows = screen.getAllByRole("link", { name: "Albums" })
    expect(rows).toHaveLength(1)
    expect(sheet).toContainElement(rows[0]!)
  })

  test("stays a plain nav when it is not collapsible", () => {
    render(
      <Sidebar aria-label="Plain">
        <SidebarGroup>
          <SidebarItem href="/a">A</SidebarItem>
        </SidebarGroup>
      </Sidebar>
    )
    const nav = screen.getByRole("navigation", { name: "Plain" })
    expect(nav.className).not.toContain("hidden")
  })
})

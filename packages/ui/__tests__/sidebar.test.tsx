import { Folder01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { setViewport } from "./helpers/viewport"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarItem,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
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

describe("Sidebar composed shadcn's way", () => {
  function Library() {
    return (
      <SidebarProvider>
        <Sidebar collapsible="offcanvas" aria-label="Library">
          <SidebarHeader>
            <SidebarInput aria-label="Search" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Favorites</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add" />
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Starred</SidebarMenuButton>
                    <SidebarMenuAction aria-label="More" />
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/all">
                          All Notes
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>Content</SidebarInset>
      </SidebarProvider>
    )
  }

  test("is shadcn's offcanvas structure: wrapper, spacer, fixed container, inner nav", () => {
    render(<Library />)
    expect(
      document.querySelector('[data-slot="sidebar-wrapper"]')
    ).not.toBeNull()
    const root = document.querySelector('[data-slot="sidebar"]')!
    expect(root).toHaveAttribute("data-state", "expanded")
    expect(root).toHaveAttribute("data-side", "left")
    expect(document.querySelector('[data-slot="sidebar-gap"]')).not.toBeNull()
    const container = document.querySelector('[data-slot="sidebar-container"]')!
    expect(container.className).toContain("fixed")
    const nav = screen.getByRole("navigation", { name: "Library" })
    expect(nav).toHaveAttribute("data-slot", "sidebar-inner")
    expect(container).toContainElement(nav)
    expect(nav.className).toContain("material-regular")
  })

  test("every part shadcn composes with is here and stamps its own slot", () => {
    render(<Library />)
    for (const slot of [
      "sidebar-content",
      "sidebar-group-content",
      "sidebar-input",
      "sidebar-inset",
      "sidebar-menu",
      "sidebar-menu-badge",
      "sidebar-menu-item",
      "sidebar-menu-skeleton",
      "sidebar-menu-sub",
      "sidebar-menu-sub-item",
      "sidebar-rail",
      "sidebar-separator",
    ])
      expect(
        document.querySelector(`[data-slot="${slot}"]`),
        slot
      ).not.toBeNull()
    const button = screen.getByRole("button", { name: "Starred" })
    expect(button).toHaveAttribute("data-slot", "sidebar-menu-button")
    // Base UI writes a boolean state as a bare attribute, which is what `data-active:` matches.
    expect(button).toHaveAttribute("data-active", "")
    expect(button.className).toContain("h-(--sidebar-row-height)")
    expect(button.className).toContain("rounded-sidebar")
    expect(screen.getByRole("link", { name: "All Notes" })).toHaveAttribute(
      "data-slot",
      "sidebar-menu-sub-button"
    )
  })

  test("the rail collapses and expands the standing sidebar", async () => {
    // The standing sidebar only exists on a wide window; on a narrow one the rail's toggle
    // reaches the sheet instead, which is `isMobile` doing its job.
    setViewport("desktop")
    render(<Library />)
    const root = document.querySelector('[data-slot="sidebar"]')!
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle Sidebar" })
    )
    expect(root).toHaveAttribute("data-state", "collapsed")
    expect(root).toHaveAttribute("data-collapsible", "offcanvas")
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle Sidebar" })
    )
    expect(root).toHaveAttribute("data-state", "expanded")
  })

  test("a menu button takes another element through `render`, as shadcn's does", () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none" aria-label="Library">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/work">Work</a>} />
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    )
    const link = screen.getByRole("link", { name: "Work" })
    expect(link).toHaveAttribute("data-slot", "sidebar-menu-button")
    expect(link).toHaveAttribute("href", "/work")
  })
})

describe("useSidebar", () => {
  test("answers with shadcn's state, and refuses outside a provider", () => {
    expect(() => renderHook(() => useSidebar())).toThrow(/SidebarProvider/)
    const { result } = renderHook(() => useSidebar(), {
      wrapper: ({ children }) => <SidebarProvider>{children}</SidebarProvider>,
    })
    expect(result.current.state).toBe("expanded")
    expect(result.current.open).toBe(true)
    expect(result.current.openMobile).toBe(false)
    expect(typeof result.current.toggleSidebar).toBe("function")
  })
})

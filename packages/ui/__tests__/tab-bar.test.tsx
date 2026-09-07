import { Home01Icon, Search01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { TabBar, TabBarItem, TabBarSearch } from "../src/components/tab-bar"

describe("TabBar", () => {
  test("is a floating glass capsule of labelled tabs with the current one tinted", () => {
    render(
      <TabBar aria-label="Main" value="home">
        <TabBarItem value="home" icon={Home01Icon} label="Home" href="/" />
        <TabBarItem
          value="you"
          icon={UserIcon}
          label="You"
          href="/you"
          badge={3}
        />
        <TabBarSearch icon={Search01Icon} href="/search" />
      </TabBar>
    )
    const nav = screen.getByRole("navigation", { name: "Main" })
    expect(nav).toHaveAttribute("data-slot", "tab-bar")
    expect(nav.className).toContain("inset-x-(--tab-bar-inset)")
    const capsule = nav.querySelector('[data-slot="tab-bar-capsule"]')!
    expect(capsule.className).toContain("glass")
    expect(capsule.className).toContain("h-(--tab-bar-height)")
    expect(capsule.className).toContain("p-(--tab-bar-item-inset)")
    expect(capsule.className).toContain("rounded-full")
    const home = screen.getByRole("link", { name: "Home" })
    expect(home).toHaveAttribute("aria-current", "page")
    expect(home.className).toContain("h-(--tab-bar-item)")
    expect(home.className).toContain("text-[length:var(--tab-bar-label)]")
    expect(home.className).toContain("aria-[current=page]:text-primary")
    expect(home.className).toContain("aria-[current=page]:bg-fill-3")
    expect(screen.getByRole("link", { name: /You/ })).not.toHaveAttribute(
      "aria-current"
    )
    expect(screen.getByText("3")).toHaveAttribute("data-slot", "badge")
    expect(screen.getByRole("link", { name: "Search" })).toHaveAttribute(
      "data-slot",
      "tab-bar-search"
    )
  })

  test("button items select through onValueChange, and minimized shows only the current tab", async () => {
    const onValueChange = vi.fn()
    render(
      <TabBar
        aria-label="Main"
        value="home"
        onValueChange={onValueChange}
        minimized
      >
        <TabBarItem value="home" icon={Home01Icon} label="Home" />
        <TabBarItem value="you" icon={UserIcon} label="You" />
      </TabBar>
    )
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "true"
    )
    // A hidden element has no accessible name, so find the minimized tab by its label text.
    expect(screen.getByText("You").closest("button")).not.toBeVisible()
    await userEvent.click(screen.getByRole("button", { name: "Home" }))
    expect(onValueChange).toHaveBeenCalledWith("home")
  })
})

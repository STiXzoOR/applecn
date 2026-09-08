import { Home01Icon, Search01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { cn } from "cn"
import { describe, expect, test, vi } from "vitest"

import { TabBar, TabBarItem, TabBarSearch } from "../src/components/tab-bar"
import { Tabs, TabsList, TabsTab } from "../src/components/tabs"
import {
  segmentedItemClassName,
  segmentedTrackClassName,
} from "../src/components/toggle-group"

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

/**
 * Spec §5.6 gave `tab-bar` a `tabs` base. Spiked and abandoned: `tabs` is applecn's segmented
 * control driving panels — its track, pill and segment are `toggle-group`'s three exported
 * constants, which §5.3 folded into one place precisely so nothing else would copy them — and a
 * tab bar is a floating Liquid Glass platter of app-level navigation. The shapes rhyme; the
 * surface, the semantics and every measured number are different.
 *
 * The first claim below is the one that decides it, and it is the defect class
 * `named-utility-collision.test.ts` guards: the track's fill would paint over the platter's glass,
 * and there is no class that clears the fill without clearing the glass too.
 */
describe("TabBar cannot be rebuilt on tabs", () => {
  test("the track's fill would paint over the platter's glass, and cannot be cleared off it", () => {
    expect(segmentedTrackClassName).toContain("bg-fill-3")
    // `cn` knows nothing of `glass`, so both survive and emission order decides. Measured against
    // the built stylesheet on 2026-09-08: `.glass` at 43,910 and `.bg-fill-3` at 49,166, so the
    // tertiary fill wins and a Liquid Glass platter renders flat.
    expect(cn("bg-fill-3", "glass")).toBe("bg-fill-3 glass")
    // And it cannot be neutralised: every `bg-*` is emitted after `glass` too, so the class that
    // clears the track's fill clears the platter's background with it.
    expect(cn("glass", "bg-transparent")).toBe("glass bg-transparent")
  })

  test("a list always carries a sliding indicator; a tab bar's selection is a lens on the item", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTab value="a">A</TabsTab>
        </TabsList>
      </Tabs>
    )
    // `TabsList` renders the indicator itself, so a platter built on it grows a pill it has no
    // use for; the tab bar tints the current item in place.
    expect(
      document.querySelector('[data-slot="tabs-indicator"]')
    ).not.toBeNull()
    render(
      <TabBar aria-label="Main" value="home">
        <TabBarItem value="home" icon={Home01Icon} label="Home" href="/" />
      </TabBar>
    )
    expect(
      screen
        .getByRole("navigation", { name: "Main" })
        .querySelector("[data-slot$='indicator']")
    ).toBeNull()
    expect(screen.getByRole("link", { name: "Home" }).className).toContain(
      "aria-[current=page]:bg-fill-3"
    )
  })

  test("a segment hides its overflow; a tab bar hangs its badge outside the item", () => {
    expect(segmentedItemClassName).toContain("overflow-hidden")
    render(
      <TabBar aria-label="Main" value="you">
        <TabBarItem
          value="you"
          icon={UserIcon}
          label="You"
          href="/you"
          badge={3}
        />
      </TabBar>
    )
    const badge = screen.getByText("3")
    expect(badge.className).toContain("-end-2.5")
    expect(badge.className).toContain("-top-1.5")
    expect(screen.getByRole("link", { name: /You/ }).className).not.toContain(
      "overflow-hidden"
    )
  })

  test("a tab bar is navigation, and its items are links; tabs are a tablist over panels", () => {
    render(
      <TabBar aria-label="Main" value="home">
        <TabBarItem value="home" icon={Home01Icon} label="Home" href="/" />
        <TabBarSearch icon={Search01Icon} href="/search" />
      </TabBar>
    )
    const nav = screen.getByRole("navigation", { name: "Main" })
    expect(nav.tagName).toBe("NAV")
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    // The search button sits OUTSIDE the platter, as a second 62 pt circle — a child a tablist
    // has no place for, since every child of a `role="tablist"` must be a tab.
    expect(
      nav.querySelector('[data-slot="tab-bar-search"]')!.parentElement
    ).toBe(nav)
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTab value="a">A</TabsTab>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })

  test("the platter's numbers are the ones a segmented track would overrule", () => {
    render(
      <TabBar aria-label="Main" value="home">
        <TabBarItem value="home" icon={Home01Icon} label="Home" href="/" />
      </TabBar>
    )
    const capsule = document.querySelector('[data-slot="tab-bar-capsule"]')!
    expect(capsule.className).toContain("h-(--tab-bar-height)")
    expect(capsule.className).toContain("p-(--tab-bar-item-inset)")
    // 62 pt against the track's 32, and a 4 pt inset against its 2.
    expect(segmentedTrackClassName).toContain("h-(--segmented-height)")
    expect(segmentedTrackClassName).toContain("p-(--segmented-inset)")
    const item = screen.getByRole("link", { name: "Home" })
    expect(item.className).toContain("min-w-11")
    expect(item.className).toContain("text-[length:var(--tab-bar-label)]")
    // 44 pt and a 10 pt label against a segment's 32 pt minimum and 13 pt type.
    expect(segmentedItemClassName).toContain("min-w-(--segmented-height)")
    expect(segmentedItemClassName).toContain(
      "text-[length:var(--segmented-font)]"
    )
  })
})

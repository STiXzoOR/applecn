import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsPanel,
  TabsTab,
  TabsTrigger,
} from "../src/components/tabs"
import {
  segmentedIndicatorClassName,
  segmentedItemClassName,
  segmentedTrackClassName,
} from "../src/components/toggle-group"

function Views() {
  return (
    <Tabs defaultValue="events">
      <TabsList aria-label="Kind">
        <TabsTab value="events">Event</TabsTab>
        <TabsTab value="reminders">Reminder</TabsTab>
      </TabsList>
      <TabsPanel value="events">Event form</TabsPanel>
      <TabsPanel value="reminders">Reminder form</TabsPanel>
    </Tabs>
  )
}

describe("Tabs", () => {
  test("shows the selected panel and switches on click", async () => {
    render(<Views />)
    expect(screen.getByText("Event form")).toBeVisible()
    expect(screen.queryByText("Reminder form")).toBeNull()
    await userEvent.click(screen.getByRole("tab", { name: "Reminder" }))
    expect(screen.getByText("Reminder form")).toBeVisible()
  })

  test("the tab list is a segmented control and tabs control their panels", () => {
    render(<Views />)
    const list = screen.getByRole("tablist", { name: "Kind" })
    expect(list).toHaveAttribute("data-slot", "tabs-list")
    const tab = screen.getByRole("tab", { name: "Event" })
    expect(tab).toHaveAttribute("data-slot", "tabs-trigger")
    const panel = screen.getByRole("tabpanel")
    expect(panel).toHaveAttribute("data-slot", "tabs-content")
    expect(tab.getAttribute("aria-controls")).toBe(panel.id)
  })

  test("shadcn's names reach the same components as Base UI's", () => {
    expect(TabsTrigger).toBe(TabsTab)
    expect(TabsContent).toBe(TabsPanel)
  })

  test("arrow keys move the selection, so the panel follows the focus", async () => {
    render(<Views />)
    screen.getByRole("tab", { name: "Event" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Reminder" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  test("is a 32 pt capsule on iOS (24 pt, 6 pt corners on macOS) with a 2 pt inset and a sliding indicator", () => {
    render(<Views />)
    const list = screen.getByRole("tablist")
    expect(list.className).toContain("h-(--segmented-height)")
    expect(list.className).toContain("p-(--segmented-inset)")
    expect(list.className).toContain("rounded-segmented")
    expect(list.className).toContain("bg-fill-3")
    const indicator = list.querySelector('[data-slot="tabs-indicator"]')!
    expect(indicator.className).toContain(
      "rounded-[calc(var(--radius-segmented)-var(--segmented-inset))]"
    )
    expect(indicator.className).toContain("bg-(--toggle-group-pressed-bg)")
    expect(indicator.className).toContain(
      "shadow-(--toggle-group-pressed-shadow)"
    )
    const tab = screen.getByRole("tab", { name: "Event" })
    expect(tab.className).toContain("text-[length:var(--segmented-font)]")
    expect(tab.className).toContain("font-medium")
    expect(tab.className).toContain("data-active:font-semibold")
    expect(tab.className).toContain(
      "data-active:text-(--toggle-group-pressed-text)"
    )
  })

  test("a tab too narrow for its label clips inside the track instead of painting outside it", () => {
    render(<Views />)
    const tab = screen.getByRole("tab", { name: "Event" })
    expect(tab.className).toContain("min-w-(--segmented-height)")
    expect(tab.className).toContain("overflow-hidden")
  })

  /**
   * Spec §4.4 recorded the segmented tracks as the catalogue's only true duplication, and §5.3
   * folded `segmented-control` into `toggle-group` to remove it. What shipped removed the FILE
   * and kept the duplication: two copies of the track, pill and item class strings in two modules,
   * painted from two token families with identical values — and inside that same phase the two
   * copies had already drifted (`min-w-0` against `min-w-(--segmented-height)`, one transition
   * list against another, and nothing comparing them).
   *
   * So the surface is one constant now, exported from the module §5.3 gave it to, and read here
   * the way `drawer` reads `dialogPopupClassName`. What each surface adds on top is what genuinely
   * differs: `Tabs` spans its container and keys off `data-active`, `ToggleGroup` hugs and keys
   * off `data-pressed`.
   */
  test("the segmented surface is one constant, shared with toggle-group rather than copied", () => {
    render(<Views />)
    const list = screen.getByRole("tablist")
    expect(list.className).toContain(segmentedTrackClassName)
    expect(
      list.querySelector('[data-slot="tabs-indicator"]')!.className
    ).toContain(segmentedIndicatorClassName)
    expect(screen.getByRole("tab", { name: "Event" }).className).toContain(
      segmentedItemClassName
    )
  })
})

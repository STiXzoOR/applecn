import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Window, WindowContent, WindowTitleBar } from "../src/components/window"

describe("Window", () => {
  test("is a macOS 26 window: 16 pt corners, a 32 pt title bar with 14 pt traffic lights, the dialog shadow", () => {
    render(
      <Window aria-label="Finder">
        <WindowTitleBar title="Documents" />
        <WindowContent>Files</WindowContent>
      </Window>
    )
    const win = screen.getByRole("region", { name: "Finder" })
    expect(win).toHaveAttribute("data-slot", "window")
    expect(win.className).toContain("rounded-window")
    expect(win.closest("[data-platform]")).toHaveAttribute(
      "data-platform",
      "macos"
    )
    expect(win.className).toContain("shadow-dialog")
    const bar = win.querySelector('[data-slot="window-title-bar"]')!
    expect(bar.className).toContain("h-(--window-title-bar)")
    const lights = win.querySelectorAll('[data-slot="window-traffic-light"]')
    expect(lights).toHaveLength(3)
    expect(lights[0]!.className).toContain("size-(--window-traffic-light)")
    expect(lights[0]!.className).toContain("bg-system-red")
    expect(screen.getByText("Documents").className).toContain("font-semibold")
  })

  test("a toolbar-style title bar is the 52 pt unified bar with items on either side", () => {
    render(
      <Window aria-label="Notes">
        <WindowTitleBar
          title="Notes"
          toolbar
          trailing={<button type="button">Share</button>}
        />
      </Window>
    )
    const bar = screen
      .getByRole("region")
      .querySelector('[data-slot="window-title-bar"]')!
    expect(bar.className).toContain("h-(--toolbar-height)")
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()
  })
})

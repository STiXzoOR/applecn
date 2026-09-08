import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../src/components/resizable"
import {
  SplitView,
  SplitViewContent,
  SplitViewDetail,
  SplitViewSidebar,
} from "../src/components/split-view"

describe("SplitView", () => {
  test("lays out sidebar, content and detail as labelled regions with hairline dividers", () => {
    render(
      <SplitView columns={3}>
        <SplitViewSidebar>Sidebar</SplitViewSidebar>
        <SplitViewContent>List</SplitViewContent>
        <SplitViewDetail>Detail</SplitViewDetail>
      </SplitView>
    )
    const root = screen
      .getByRole("region", { name: "Sidebar" })
      .closest('[data-slot="split-view"]')!
    expect(root).toHaveAttribute("data-columns", "3")
    expect(root.className).toContain(
      "lg:grid-cols-[var(--split-view-sidebar-width)_var(--split-view-content-width)_1fr]"
    )
    expect(screen.getByRole("region", { name: "Content" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Detail" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Sidebar" }).className).toContain(
      "lg:border-e-[0.5px]"
    )
  })

  test("two columns drop the content column", () => {
    render(
      <SplitView columns={2}>
        <SplitViewSidebar>Sidebar</SplitViewSidebar>
        <SplitViewDetail>Detail</SplitViewDetail>
      </SplitView>
    )
    const root = screen
      .getByRole("region", { name: "Sidebar" })
      .closest('[data-slot="split-view"]')!
    expect(root.className).toContain(
      "lg:grid-cols-[var(--split-view-sidebar-width)_1fr]"
    )
  })
})

/**
 * Spec §5.6 gave `split-view` a `resizable` base so it would gain "the drag it never had".
 * Spiked on `react-resizable-panels@4.12.4`, the library `resizable` wraps, and abandoned: the
 * split view's two published behaviours — the measured pane widths, and the collapse to one
 * column below `lg` — are both things the library takes over and neither can be given back.
 *
 * Each claim below is the spike, kept executable rather than described.
 */
describe("SplitView cannot be rebuilt on resizable", () => {
  test("the pane widths are measured CSS tokens, and a panel's size is an inline flex ratio", () => {
    render(
      <SplitView columns={2}>
        <SplitViewSidebar>Sidebar</SplitViewSidebar>
        <SplitViewDetail>Detail</SplitViewDetail>
      </SplitView>
    )
    const root = screen
      .getByRole("region", { name: "Sidebar" })
      .closest('[data-slot="split-view"]')!
    // 320 pt on iOS, 240 on macOS, 260 on the web, all from one class.
    expect(root.className).toContain("var(--split-view-sidebar-width)")

    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="320px">Sidebar</ResizablePanel>
        <ResizablePanel>Detail</ResizablePanel>
      </ResizablePanelGroup>
    )
    const panel = document.querySelector('[data-slot="resizable-panel"]')!
    // The library writes the size as a flex ratio of the group, and takes no `var()`: its
    // `defaultSize` is a number of pixels or a string with a unit, so a per-idiom token can only
    // reach it as a literal in the component, which is the one thing a token exists to prevent.
    expect(panel.getAttribute("style")).toContain("flex:")
    expect(panel.getAttribute("style")).not.toContain(
      "--split-view-sidebar-width"
    )
  })

  test("the group fixes its own layout inline, so the one-column collapse cannot survive", () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel>Sidebar</ResizablePanel>
      </ResizablePanelGroup>
    )
    const group = document.querySelector('[data-slot="resizable-panel-group"]')!
    const style = group.getAttribute("style")!
    expect(style).toContain("display: flex")
    expect(style).toContain("flex-direction: row")
    // `split-view` is `grid-cols-1` until `lg`, which is how three panes become a phone's single
    // column. A class cannot beat an inline declaration, and the library documents these four as
    // un-overridable, so the rebuilt view would stay side by side at every width.
    render(
      <SplitView columns={3}>
        <SplitViewSidebar>Sidebar</SplitViewSidebar>
        <SplitViewContent>List</SplitViewContent>
        <SplitViewDetail>Detail</SplitViewDetail>
      </SplitView>
    )
    const root = screen
      .getByRole("region", { name: "Sidebar" })
      .closest('[data-slot="split-view"]')!
    expect(root.className).toContain("grid-cols-1")
  })

  test("a pane is a labelled region; a panel wraps its children in a scroll box it owns", () => {
    render(
      <SplitView columns={2}>
        <SplitViewSidebar>Sidebar</SplitViewSidebar>
        <SplitViewDetail>Detail</SplitViewDetail>
      </SplitView>
    )
    const pane = screen.getByRole("region", { name: "Sidebar" })
    expect(pane.tagName).toBe("SECTION")
    expect(pane).toHaveAttribute("data-slot", "split-view-sidebar")

    render(
      <ResizablePanelGroup>
        <ResizablePanel>
          <section aria-label="Spiked sidebar">Sidebar</section>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
    const panel = document.querySelector('[data-slot="resizable-panel"]')!
    // `resizable.tsx` records it: a panel's `className` lands on the box the library wraps the
    // children in, not on the panel. So the pane's own element cannot BE the panel — it nests
    // two library divs inside it, and every pane grows a wrapper it did not have.
    expect(panel.tagName).toBe("DIV")
    expect(
      screen.getByRole("region", { name: "Spiked sidebar" }).parentElement
    ).not.toBe(panel)
  })
})

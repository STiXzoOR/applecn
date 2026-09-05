import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

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

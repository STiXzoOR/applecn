import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../src/components/resizable"
import { checkA11y } from "./helpers/axe"

function Inspector({
  orientation = "horizontal",
  withHandle,
}: {
  orientation?: "horizontal" | "vertical"
  withHandle?: boolean
} = {}) {
  return (
    <ResizablePanelGroup orientation={orientation} aria-label="Editor">
      <ResizablePanel defaultSize="30">Sidebar</ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel>Canvas</ResizablePanel>
    </ResizablePanelGroup>
  )
}

describe("Resizable", () => {
  test("is a group of panels split by a draggable separator", () => {
    render(<Inspector />)
    const group = screen
      .getByText("Sidebar")
      .closest('[data-slot="resizable-panel-group"]')!
    expect(group).not.toBeNull()
    // The panel wraps its children in a scroll box of the library's own, so the slot is the
    // ancestor rather than the element holding the text.
    expect(
      group.querySelectorAll('[data-slot="resizable-panel"]')
    ).toHaveLength(2)
    expect(
      screen.getByText("Sidebar").closest('[data-slot="resizable-panel"]')
    ).not.toBeNull()
    const handle = screen.getByRole("separator")
    expect(handle).toHaveAttribute("data-slot", "resizable-handle")
    // The separator is the drag affordance, so it has to be reachable and reportable.
    expect(handle).toHaveAttribute("aria-valuenow")
    expect(handle).toHaveAttribute("aria-controls")
  })

  test("the divider is Apple's half-point hairline over a widened drag strip", () => {
    render(<Inspector />)
    const handle = screen.getByRole("separator")
    expect(handle).toHaveAttribute("aria-orientation", "vertical")
    expect(handle.className).toContain("w-[0.5px]")
    expect(handle.className).toContain("bg-separator")
    // 4 px of hit area either side of a half-point line, as shadcn draws it.
    expect(handle.className).toContain("after:w-1")
    expect(handle.className).toContain("focus-visible:ring-4")
    expect(handle.className).toContain("focus-visible:ring-ring/60")
  })

  test("a vertical group turns the hairline on its side", () => {
    render(<Inspector orientation="vertical" />)
    const handle = screen.getByRole("separator")
    // The library reports the separator's own axis, which is the group's inverted.
    expect(handle).toHaveAttribute("aria-orientation", "horizontal")
    expect(handle.className).toContain(
      "aria-[orientation=horizontal]:h-[0.5px]"
    )
    expect(handle.className).toContain("aria-[orientation=horizontal]:w-full")
  })

  test("withHandle draws the grabber, sized off the small control", () => {
    render(<Inspector withHandle />)
    const grip = screen
      .getByRole("separator")
      .querySelector('[data-slot="resizable-handle-grip"]')!
    expect(grip).not.toBeNull()
    expect(grip.className).toContain("h-(--control-height-small)")
    expect(grip.className).toContain("rounded-full")
    expect(grip.className).toContain("bg-fill-2")
    expect(screen.queryByRole("separator")!.querySelector("div")).toBe(grip)
  })

  test("no grabber unless it is asked for, as shadcn does", () => {
    render(<Inspector />)
    expect(
      screen
        .getByRole("separator")
        .querySelector('[data-slot="resizable-handle-grip"]')
    ).toBeNull()
  })

  test("the caller's className dresses each part", () => {
    render(
      <ResizablePanelGroup className="rounded-card" aria-label="Editor">
        <ResizablePanel className="p-4">Sidebar</ResizablePanel>
        <ResizableHandle className="opacity-50" />
        <ResizablePanel>Canvas</ResizablePanel>
      </ResizablePanelGroup>
    )
    // The library puts a panel's `className` on the scroll box it wraps the children in, not on
    // the `data-slot` element — upstream's behaviour, forwarded unchanged, so a shadcn user's
    // markup lands where theirs does.
    expect(screen.getByText("Sidebar").className).toContain("p-4")
    expect(screen.getByRole("separator").className).toContain("opacity-50")
    expect(
      screen
        .getByText("Sidebar")
        .closest('[data-slot="resizable-panel-group"]')!.className
    ).toContain("rounded-card")
  })

  test("has no accessibility violations", async () => {
    const { container } = render(<Inspector withHandle />)
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

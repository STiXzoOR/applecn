import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "../src/components/sheet"
import { checkA11y } from "./helpers/axe"

function Inspector({
  side,
  showCloseButton,
}: {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
} = {}) {
  return (
    <Sheet>
      <SheetTrigger>Inspector</SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Arrange</SheetTitle>
          <SheetDescription>Position and size.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

describe("Sheet", () => {
  test("is an edge panel with a title and description wired to it", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    const panel = await screen.findByRole("dialog", { name: "Arrange" })
    expect(panel).toHaveAttribute("data-slot", "sheet-content")
    expect(panel).toHaveAccessibleDescription("Position and size.")
    expect(panel.querySelector('[data-slot="sheet-title"]')).not.toBeNull()
    expect(
      panel.querySelector('[data-slot="sheet-description"]')
    ).not.toBeNull()
    expect(panel.querySelector('[data-slot="sheet-header"]')).not.toBeNull()
    expect(panel.querySelector('[data-slot="sheet-footer"]')).not.toBeNull()
  })

  test("is the iPadOS and macOS inspector: the sidebar width on the raised surface", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    const panel = await screen.findByRole("dialog")
    expect(panel.className).toContain("w-(--sidebar-width)")
    expect(panel.className).toContain("bg-popover")
    expect(panel.className).toContain("shadow-dialog")
    expect(panel).toHaveAttribute("data-elevated")
  })

  test("takes shadcn's four sides, and comes from the trailing edge by default", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    const panel = await screen.findByRole("dialog")
    expect(panel).toHaveAttribute("data-side", "right")
    expect(panel.className).toContain("right-0")
    expect(panel.className).toContain("data-ending-style:translate-x-full")
  })

  test.each([
    ["left", "left-0", "data-ending-style:-translate-x-full"],
    ["top", "top-0", "data-ending-style:-translate-y-full"],
    ["bottom", "bottom-0", "data-ending-style:translate-y-full"],
  ] as const)("side=%s attaches to that edge", async (side, edge, exit) => {
    render(<Inspector side={side} />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    const panel = await screen.findByRole("dialog")
    expect(panel).toHaveAttribute("data-side", side)
    expect(panel.className).toContain(edge)
    expect(panel.className).toContain(exit)
  })

  test("the overlay is the sheet scrim, and it is stamped as shadcn stamps it", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    expect(overlay).not.toBeNull()
    expect(overlay!.className).toContain("var(--sheet-scrim)")
  })

  test("shows a close button, which showCloseButton={false} takes away", async () => {
    const { unmount } = render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "data-slot",
      "sheet-close"
    )
    unmount()

    render(<Inspector showCloseButton={false} />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
  })

  test("Done and Escape dismiss it", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    await userEvent.click(screen.getByRole("button", { name: "Done" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  test("the portal and the overlay are writable by hand, as shadcn's dialog pair is", async () => {
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetOverlay data-testid="overlay" />
          <SheetContent showCloseButton={false}>
            <SheetTitle>Arrange</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    )
    await screen.findByRole("dialog")
    expect(screen.getByTestId("overlay")).toHaveAttribute(
      "data-slot",
      "sheet-overlay"
    )
  })

  test("has no accessibility violations", async () => {
    render(<Inspector />)
    await userEvent.click(screen.getByRole("button", { name: "Inspector" }))
    await screen.findByRole("dialog")
    expect(await checkA11y(document.body)).toHaveNoViolations()
  })
})

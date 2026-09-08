import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { cn } from "cn"
import { describe, expect, test } from "vitest"

import * as drawer from "../src/components/drawer"
import { Drawer, DrawerClose, DrawerContent } from "../src/components/drawer"
import {
  ActionSheet,
  ActionSheetAction,
  ActionSheetCancel,
  ActionSheetContent,
  ActionSheetTrigger,
} from "../src/components/action-sheet"
import { setViewport } from "./helpers/viewport"

function Draft() {
  return (
    <ActionSheet>
      <ActionSheetTrigger>Close</ActionSheetTrigger>
      <ActionSheetContent
        title="Unsaved Draft"
        message="You can save it for later."
      >
        <ActionSheetAction destructive>Delete Draft</ActionSheetAction>
        <ActionSheetAction>Save Draft</ActionSheetAction>
        <ActionSheetCancel>Cancel</ActionSheetCancel>
      </ActionSheetContent>
    </ActionSheet>
  )
}

describe("ActionSheet", () => {
  test("on a phone it rises from the bottom as the iOS 26 card: 34 pt corners, 48 pt capsule actions 8 pt apart, Cancel bolder", async () => {
    setViewport("phone")
    render(<Draft />)
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    const sheet = await screen.findByRole("dialog", { name: "Unsaved Draft" })
    expect(sheet).toHaveAttribute("data-slot", "action-sheet-content")
    expect(sheet).toHaveAttribute("data-presentation", "sheet")
    const card = sheet.querySelector('[data-slot="action-sheet-card"]')!
    expect(card.className).toContain("rounded-[var(--action-sheet-radius)]")
    expect(card.className).toContain("glass")
    const group = sheet.querySelector('[data-slot="action-sheet-group"]')!
    expect(group.className).toContain("p-(--action-sheet-inset)")
    expect(group.className).toContain("gap-(--action-sheet-gap)")
    const del = screen.getByRole("button", { name: "Delete Draft" })
    expect(del.className).toContain("h-(--action-sheet-row-height)")
    expect(del.className).toContain("rounded-full")
    expect(del.className).toContain("bg-fill-3")
    expect(del.className).toContain("text-destructive")
    const cancelGroup = sheet.querySelector(
      '[data-slot="action-sheet-cancel-group"]'
    )!
    expect(cancelGroup).toContainElement(
      screen.getByRole("button", { name: "Cancel" })
    )
    expect(screen.getByRole("button", { name: "Cancel" }).className).toContain(
      "font-semibold"
    )
  })

  test("on a desktop it is a popover anchored to the trigger", async () => {
    setViewport("desktop")
    render(<Draft />)
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    const sheet = await screen.findByRole("dialog", { name: "Unsaved Draft" })
    expect(sheet).toHaveAttribute("data-presentation", "popover")
    expect(
      sheet.querySelector('[data-slot="action-sheet-cancel-group"]')
    ).toBeNull()
    const del = screen.getByRole("button", { name: "Delete Draft" })
    expect(del.className).toContain("hover:bg-(--action-sheet-item-hover-bg)")
    expect(del.className).toContain(
      "hover:text-(--action-sheet-item-hover-text-destructive)"
    )
    const save = screen.getByRole("button", { name: "Save Draft" })
    expect(save.className).toContain(
      "hover:text-(--action-sheet-item-hover-text-default)"
    )
  })

  test("Cancel and Escape dismiss it", async () => {
    render(<Draft />)
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    await screen.findByRole("dialog")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

/**
 * Spec §5.6 gives `action-sheet` a `drawer` base, and it is the right base: this module reaches
 * past `drawer` into `@base-ui/react/drawer` and `@base-ui/react/popover`, which is the layering
 * rule's exact violation. Task 39 nonetheless does NOT do it, because §5.2's correction has Task
 * 44 restructuring the same seam — and the three things blocking the rebuild are all things Task
 * 44 either supplies or moves.
 *
 * Each is pinned below, so the day 44 lands the blockers can be re-run rather than re-argued.
 */
describe("ActionSheet's rebuild on drawer waits for Task 44", () => {
  test("drawer exposes no popup parts, and its content is a sheet an action sheet is not", async () => {
    // The card an action sheet needs is a `Viewport` + `Popup` + `Content` of its own; `drawer`
    // publishes only the composed `DrawerContent`.
    for (const part of ["DrawerViewport", "DrawerPopup", "DrawerCard"])
      expect(drawer).not.toHaveProperty(part)
    setViewport("phone")
    render(
      <Drawer defaultOpen>
        <DrawerContent>body</DrawerContent>
      </Drawer>
    )
    // And the composed one always draws the grabber, which an action sheet does not have, and
    // paints itself opaque where an action sheet's card is glass on a transparent stack.
    expect(
      document.querySelector('[data-slot="drawer-swipe-handle"]')
    ).not.toBeNull()
    expect(
      document.querySelector('[data-slot="drawer-popup"]')!.className
    ).toContain("bg-popover")
  })

  test("a drawer close is not an action row: the two type styles do not merge", () => {
    // `DrawerClose` writes `type-body`; an action row writes the alert title size. A named text
    // style and an arbitrary length are not one `cn` group, so both would survive and emission
    // order would pick the row's type — the collision `named-utility-collision.test.ts` guards.
    expect(cn("type-body", "text-[length:var(--alert-title-font)]")).toBe(
      "type-body text-[length:var(--alert-title-font)]"
    )
    // And a drawer close dims under the finger where an action capsule scales.
    setViewport("phone")
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerClose>Done</DrawerClose>
        </DrawerContent>
      </Drawer>
    )
    const close = screen.getByRole("button", { name: "Done" })
    expect(close.className).toContain("type-body")
    expect(close.className).toContain("active:opacity-60")
    expect(close.className).not.toContain("active:scale-[0.97]")
  })

  test("on a desktop the two present differently, which is the delegation Task 44 moves", async () => {
    setViewport("desktop")
    render(<Draft />)
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    const popover = await screen.findByRole("dialog", { name: "Unsaved Draft" })
    // An action sheet becomes a popover ANCHORED to its trigger; a drawer becomes a centred
    // dialog. `drawer` cannot supply this half, and its own half is what §5.2's correction takes
    // out of it.
    expect(popover).toHaveAttribute("data-presentation", "popover")
    expect(popover.className).toContain("rounded-menu")
    expect(popover.className).not.toContain("rounded-dialog")
  })
})

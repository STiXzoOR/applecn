import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

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

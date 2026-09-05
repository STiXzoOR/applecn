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
  test("on a phone it rises from the bottom: a titled group of 56 pt rows and a separate Cancel", async () => {
    setViewport("phone")
    render(<Draft />)
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    const sheet = await screen.findByRole("dialog", { name: "Unsaved Draft" })
    expect(sheet).toHaveAttribute("data-slot", "action-sheet-content")
    expect(sheet).toHaveAttribute("data-presentation", "sheet")
    const group = sheet.querySelector('[data-slot="action-sheet-group"]')!
    expect(group.className).toContain("rounded-4xl")
    expect(group.className).toContain("material-thick")
    const del = screen.getByRole("button", { name: "Delete Draft" })
    expect(del.className).toContain("h-(--action-sheet-row-height)")
    expect(del.className).toContain("text-destructive")
    const cancelGroup = sheet.querySelector(
      '[data-slot="action-sheet-cancel-group"]'
    )!
    expect(cancelGroup.className).toContain("mt-(--action-sheet-cancel-gap)")
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

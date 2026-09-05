import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/dialog"

function Rename() {
  return (
    <Dialog>
      <DialogTrigger>Rename</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>Enter a new name.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <button type="button">Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  test("is a rounded card with a title and description wired to it", async () => {
    render(<Rename />)
    await userEvent.click(screen.getByRole("button", { name: "Rename" }))
    const dialog = await screen.findByRole("dialog", { name: "Rename Folder" })
    expect(dialog).toHaveAttribute("data-slot", "dialog-content")
    expect(dialog).toHaveAccessibleDescription("Enter a new name.")
    expect(dialog.className).toContain("rounded-lg")
    expect(dialog.className).toContain("bg-popover")
    expect(dialog.className).toContain("shadow-dialog")
    expect(
      dialog.querySelector('[data-slot="dialog-footer"]')
    ).toContainElement(screen.getByRole("button", { name: "Save" }))
  })

  test("Cancel and Escape dismiss it", async () => {
    render(<Rename />)
    await userEvent.click(screen.getByRole("button", { name: "Rename" }))
    await screen.findByRole("dialog")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Rename" }))
    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

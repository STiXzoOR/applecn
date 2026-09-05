import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../src/components/alert-dialog"

function DeleteNote(props: { third?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete Note?</AlertDialogTitle>
        <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {props.third ? (
            <AlertDialogAction>Move to Trash</AlertDialogAction>
          ) : null}
          <AlertDialogAction variant="destructive" preferred>
            Delete
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog", () => {
  test("is a 270 pt alert on thick material with left-aligned text and 44 pt buttons", async () => {
    render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog", {
      name: "Delete Note?",
    })
    expect(alert).toHaveAttribute("data-slot", "alert-dialog-content")
    expect(alert.className).toContain("w-(--alert-width)")
    expect(alert.className).toContain("rounded-4xl")
    expect(alert.className).toContain("material-thick")
    expect(alert.className).toContain("text-start")
    expect(alert).toHaveAccessibleDescription("This can’t be undone.")
    const del = screen.getByRole("button", { name: "Delete" })
    expect(del.className).toContain("h-(--alert-button-height)")
    expect(del.className).toContain("text-destructive")
    expect(del.className).toContain("font-semibold")
    expect(
      screen.getByRole("button", { name: "Cancel" }).className
    ).not.toContain("font-semibold")
  })

  test("two short actions sit side by side; three stack", async () => {
    const { unmount } = render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    expect(
      (await screen.findByRole("alertdialog")).querySelector(
        '[data-slot="alert-dialog-actions"]'
      )
    ).toHaveAttribute("data-layout", "horizontal")
    await userEvent.keyboard("{Escape}")
    unmount()
    render(<DeleteNote third />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    expect(
      (await screen.findByRole("alertdialog")).querySelector(
        '[data-slot="alert-dialog-actions"]'
      )
    ).toHaveAttribute("data-layout", "stacked")
  })

  test("Cancel and Escape dismiss it", async () => {
    render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    await screen.findByRole("alertdialog")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("alertdialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    await screen.findByRole("alertdialog")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })
})

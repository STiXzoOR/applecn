import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { checkA11y } from "./helpers/axe"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
  test("is the iOS 26 alert: 320 pt, 34 pt corners, glass, left-aligned text and 48 pt capsule actions inset 16", async () => {
    render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog", {
      name: "Delete Note?",
    })
    expect(alert).toHaveAttribute("data-slot", "alert-dialog-content")
    expect(alert.className).toContain("w-(--alert-width)")
    expect(alert.className).toContain("rounded-alert")
    expect(alert.className).toContain("glass")
    expect(alert.className).toContain("[text-align:var(--alert-text-align)]")
    expect(alert).toHaveAccessibleDescription("This can’t be undone.")
    const title = screen.getByText("Delete Note?")
    expect(title.className).toContain("text-[length:var(--alert-title-font)]")
    expect(title.className).toContain("font-semibold")
    expect(screen.getByText("This can’t be undone.").className).toContain(
      "text-[length:var(--alert-message-font)]"
    )
    const actions = alert.querySelector('[data-slot="alert-dialog-actions"]')!
    expect(actions.className).toContain("p-(--alert-button-inset)")
    expect(actions.className).toContain("gap-(--alert-button-gap)")
    const del = screen.getByRole("button", { name: "Delete" })
    expect(del.className).toContain("h-(--alert-button-height)")
    expect(del.className).toContain("rounded-(--alert-button-radius)")
    expect(del.className).toContain("bg-(--alert-button-bg-preferred)")
    expect(del.className).toContain(
      "text-(--alert-button-text-destructive-preferred)"
    )
    expect(del.className).toContain(
      "font-(--alert-button-font-weight-preferred)"
    )
    const cancel = screen.getByRole("button", { name: "Cancel" })
    expect(cancel.className).not.toContain(
      "font-(--alert-button-font-weight-preferred)"
    )
    expect(cancel.className).toContain("font-(--alert-button-font-weight)")
    expect(cancel.className).toContain("bg-(--alert-button-bg)")
    expect(cancel.className).not.toContain("bg-(--alert-button-bg-preferred)")
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

describe("AlertDialog is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog")
    expect(alert.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const title = screen.getByText("Delete Note?")
    expect(title.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(title.className).toContain("px-(--alert-title-px)")
    expect(title.className).toContain("pt-(--alert-title-pt)")
    const description = screen.getByText("This can’t be undone.")
    expect(description.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(description.className).toContain("px-(--alert-description-px)")
    expect(description.className).toContain("text-(--alert-description-text)")
    const cancel = screen.getByRole("button", { name: "Cancel" })
    expect(cancel.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(cancel.className).toContain(
      "active:scale-(--alert-button-active-scale)"
    )
    expect(cancel.className).toContain("shadow-(--alert-button-shadow)")
  })
})

/**
 * shadcn's own alert-dialog markup, pasted unchanged (spec §3): a Portal holding an Overlay and
 * the Content, a Header around the title and description, a Footer around the actions.
 */
function ShadcnShaped() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
          <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" preferred>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog takes shadcn's markup", () => {
  test("the header groups the title and description without spacing them twice", async () => {
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog")
    const header = alert.querySelector('[data-slot="alert-dialog-header"]')!
    expect(header.className).toContain("flex-col")
    expect(header.className).not.toMatch(/(^|\s)gap-/)
    expect(header).toContainElement(screen.getByText("Delete Note?"))
    expect(header).toContainElement(screen.getByText("This can’t be undone."))
  })

  test("the footer lays the actions out the way AlertDialogActions does", async () => {
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog")
    const footer = alert.querySelector('[data-slot="alert-dialog-footer"]')!
    expect(footer).toHaveAttribute("data-layout", "horizontal")
    expect(footer.className).toContain("p-(--alert-button-inset)")
    expect(footer.className).toContain("gap-(--alert-button-gap)")
    expect(footer.className).toContain("grid-cols-2")
  })

  test("the content portals an overlay that dims the screen", async () => {
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    await screen.findByRole("alertdialog")
    const overlay = document.querySelector(
      '[data-slot="alert-dialog-overlay"]'
    )!
    expect(overlay.className).toContain("fixed inset-0")
    expect(overlay.className).toContain(
      "[background-color:rgb(0_0_0/var(--sheet-scrim))]"
    )
  })
})

describe("AlertDialog accessibility", () => {
  test("the titled composition has no violations", async () => {
    render(<DeleteNote />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const alert = await screen.findByRole("alertdialog", {
      name: "Delete Note?",
    })
    expect(await checkA11y(alert)).toHaveNoViolations()
  })
})

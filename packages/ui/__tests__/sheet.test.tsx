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
  SheetTitle,
  SheetToolbar,
  SheetTrigger,
} from "../src/components/sheet"
import { setViewport } from "./helpers/viewport"

function NewEvent(props: { detent?: "medium" | "large" }) {
  return (
    <Sheet>
      <SheetTrigger>New Event</SheetTrigger>
      <SheetContent detent={props.detent}>
        <SheetToolbar
          cancel={<SheetClose>Cancel</SheetClose>}
          done={<button type="button">Add</button>}
        >
          <SheetTitle>New Event</SheetTitle>
        </SheetToolbar>
        <p>Form</p>
      </SheetContent>
    </Sheet>
  )
}

describe("Sheet", () => {
  test("on a phone it is a bottom sheet with a grabber and the sheet radius", async () => {
    setViewport("phone")
    render(<NewEvent />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog", { name: "New Event" })
    expect(sheet).toHaveAttribute("data-slot", "sheet-content")
    expect(sheet).toHaveAttribute("data-presentation", "sheet")
    expect(sheet.querySelector('[data-slot="sheet-grabber"]')).not.toBeNull()
    expect(sheet.className).toContain("rounded-t-sheet")
    expect(
      sheet.querySelector('[data-slot="sheet-toolbar"]')!.className
    ).toContain("h-(--sheet-toolbar-height)")
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument()
  })

  test("a medium detent rests at half height", async () => {
    setViewport("phone")
    render(<NewEvent detent="medium" />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog")
    expect(sheet).toHaveAttribute("data-detent", "medium")
    expect(sheet.className).toContain("h-[50dvh]")
  })

  test("on a desktop it is a centred card without a grabber", async () => {
    setViewport("desktop")
    render(<NewEvent />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog", { name: "New Event" })
    expect(sheet).toHaveAttribute("data-presentation", "dialog")
    expect(sheet.querySelector('[data-slot="sheet-grabber"]')).toBeNull()
    expect(sheet.className).toContain("rounded-dialog")
  })

  test("Cancel and Escape dismiss it", async () => {
    render(<NewEvent />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    await screen.findByRole("dialog")
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

/**
 * shadcn's Drawer markup, pasted unchanged (spec §3, §5.1): a Header around the title and
 * description, a Footer around the actions. Task 15 renames these to Drawer*.
 */
function ShadcnShaped() {
  return (
    <Sheet>
      <SheetTrigger>New Event</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Event</SheetTitle>
          <SheetDescription>Add it to your calendar.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

describe("Sheet takes shadcn's Drawer markup", () => {
  test("the header holds the title and description on the sheet's inset", async () => {
    setViewport("phone")
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog")
    const header = sheet.querySelector('[data-slot="sheet-header"]')!
    expect(header.className).toContain("flex-col")
    expect(header.className).toContain("px-4")
    expect(header).toContainElement(
      screen.getByText("Add it to your calendar.")
    )
  })

  test.each(["phone", "desktop"] as const)(
    "on a %s the footer sits under the body",
    async (viewport) => {
      setViewport(viewport)
      render(<ShadcnShaped />)
      await userEvent.click(screen.getByRole("button", { name: "New Event" }))
      const sheet = await screen.findByRole("dialog")
      const footer = sheet.querySelector('[data-slot="sheet-footer"]')!
      expect(footer.className).toContain("mt-auto")
      expect(footer.className).toContain("px-4")
      expect(footer).toContainElement(
        screen.getByRole("button", { name: "Cancel" })
      )
    }
  )
})

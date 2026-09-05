import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Sheet,
  SheetClose,
  SheetContent,
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
    expect(sheet.className).toContain("rounded-4xl")
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

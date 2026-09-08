import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerToolbar,
  DrawerTrigger,
} from "../src/components/drawer"
import { checkA11y } from "./helpers/axe"
import { setViewport } from "./helpers/viewport"

function NewEvent(props: { detent?: "medium" | "large" }) {
  return (
    <Drawer>
      <DrawerTrigger>New Event</DrawerTrigger>
      <DrawerContent detent={props.detent}>
        <DrawerToolbar
          cancel={<DrawerClose>Cancel</DrawerClose>}
          done={<button type="button">Add</button>}
        >
          <DrawerTitle>New Event</DrawerTitle>
        </DrawerToolbar>
        <p>Form</p>
      </DrawerContent>
    </Drawer>
  )
}

describe("Drawer", () => {
  test("on a phone it is a bottom sheet with a grabber and the sheet radius", async () => {
    setViewport("phone")
    render(<NewEvent />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog", { name: "New Event" })
    expect(sheet).toHaveAttribute("data-slot", "drawer-popup")
    expect(sheet).toHaveAttribute("data-presentation", "sheet")
    expect(
      sheet.querySelector('[data-slot="drawer-swipe-handle"]')
    ).not.toBeNull()
    expect(sheet.className).toContain("rounded-t-sheet")
    expect(
      sheet.querySelector('[data-slot="drawer-toolbar"]')!.className
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
    expect(sheet.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull()
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
 * description, a Footer around the actions. Task 15's rename put these under `Drawer*`, which is
 * what a shadcn user pastes.
 */
function ShadcnShaped() {
  return (
    <Drawer>
      <DrawerTrigger>New Event</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Event</DrawerTitle>
          <DrawerDescription>Add it to your calendar.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

describe("Drawer takes shadcn's Drawer markup unchanged", () => {
  test("the header holds the title and description on the sheet's inset", async () => {
    setViewport("phone")
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const sheet = await screen.findByRole("dialog")
    const header = sheet.querySelector('[data-slot="drawer-header"]')!
    expect(header.className).toContain("flex-col")
    expect(header.className).toContain("px-4")
    expect(header).toContainElement(
      screen.getByText("Add it to your calendar.")
    )
  })

  test("every part a shadcn user targets in CSS answers to a drawer-* slot", async () => {
    setViewport("phone")
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const popup = await screen.findByRole("dialog")
    // shadcn puts `drawer-popup` on the Popup and `drawer-content` on the scrolling
    // region inside it; the two are not interchangeable.
    expect(popup).toHaveAttribute("data-slot", "drawer-popup")
    const viewport = popup.parentElement!
    expect(viewport).toHaveAttribute("data-slot", "drawer-viewport")
    expect(
      viewport.parentElement!.querySelector('[data-slot="drawer-overlay"]')
    ).not.toBeNull()
    for (const slot of [
      "drawer-content",
      "drawer-header",
      "drawer-title",
      "drawer-description",
      "drawer-footer",
      "drawer-close",
    ])
      expect(
        popup.querySelector(`[data-slot="${slot}"]`),
        `${slot} is missing`
      ).not.toBeNull()
    expect(
      document.querySelector('[data-slot="drawer-trigger"]')
    ).not.toBeNull()
  })

  test.each(["phone", "desktop"] as const)(
    "on a %s the footer sits under the body",
    async (viewport) => {
      setViewport(viewport)
      render(<ShadcnShaped />)
      await userEvent.click(screen.getByRole("button", { name: "New Event" }))
      const sheet = await screen.findByRole("dialog")
      const footer = sheet.querySelector('[data-slot="drawer-footer"]')!
      expect(footer.className).toContain("mt-auto")
      expect(footer.className).toContain("px-4")
      expect(footer).toContainElement(
        screen.getByRole("button", { name: "Cancel" })
      )
    }
  )
})

describe("Drawer exposes the parts shadcn composes with", () => {
  test("the overlay, the portal and the swipe handle are all exported", async () => {
    for (const part of [DrawerOverlay, DrawerPortal, DrawerSwipeHandle])
      expect(part).toBeTypeOf("function")
    setViewport("phone")
    render(<ShadcnShaped />)
    await userEvent.click(screen.getByRole("button", { name: "New Event" }))
    const popup = await screen.findByRole("dialog")
    expect(
      popup.closest('[data-slot="drawer-portal"]'),
      "the content portals through DrawerPortal"
    ).not.toBeNull()
  })
})

describe("Drawer accessibility", () => {
  test.each(["phone", "desktop"] as const)(
    "has no violations open on a %s",
    async (viewport) => {
      setViewport(viewport)
      render(<ShadcnShaped />)
      await userEvent.click(screen.getByRole("button", { name: "New Event" }))
      await screen.findByRole("dialog")
      // The drawer is portaled out of the render container, so axe runs on the document.
      expect(await checkA11y(document.body)).toHaveNoViolations()
    }
  )
})

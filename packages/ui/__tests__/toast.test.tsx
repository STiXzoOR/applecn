import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Button } from "../src/components/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  Toaster,
  ToastViewport,
  toast as toastManager,
  useToast,
  useToastManager,
} from "../src/components/toast"

function Notify() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Messages",
          description: "Ada: Running five minutes late.",
          timeout: 0,
        })
      }
    >
      Notify
    </Button>
  )
}

describe("Toast", () => {
  test("adds a notification banner with a title and message, dismissable with its close button", async () => {
    render(
      <Toaster>
        <Notify />
      </Toaster>
    )
    await userEvent.click(screen.getByRole("button", { name: "Notify" }))
    const toast = await screen.findByRole("dialog")
    expect(toast).toHaveAttribute("data-slot", "toast")
    expect(toast.className).toContain("glass")
    expect(toast.className).toContain("rounded-card")
    expect(screen.getByText("Messages").className).toContain("font-semibold")
    expect(screen.getByText("Ada: Running five minutes late.")).toBeVisible()
    await userEvent.click(toast.querySelector('[data-slot="toast-close"]')!)
    expect(screen.queryByText("Messages")).toBeNull()
  })

  test("the viewport's placement and width read from tokens", async () => {
    render(
      <Toaster>
        <Notify />
      </Toaster>
    )
    await userEvent.click(screen.getByRole("button", { name: "Notify" }))
    const viewport = (await screen.findByRole("dialog")).closest(
      '[data-slot="toast-viewport"]'
    )!
    expect(viewport.className).toContain("top-(--toast-top)")
    expect(viewport.className).toContain("right-(--toast-right)")
    expect(viewport.className).toContain("left-(--toast-left)")
    expect(viewport.className).toContain("translate-x-(--toast-translate-x)")
    expect(viewport.className).toContain("w-(--toast-width)")
  })
})

describe("Toast is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(
      <Toaster>
        <Notify />
      </Toaster>
    )
    await userEvent.click(screen.getByRole("button", { name: "Notify" }))
    const viewport = (await screen.findByRole("dialog")).closest(
      '[data-slot="toast-viewport"]'
    )!
    expect(viewport.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

describe("Toast composed shadcn's way", () => {
  test("the parts Toaster renders are the parts a caller can render themselves", async () => {
    function List() {
      const { toasts } = useToastManager()
      return toasts.map((item) => (
        <Toast key={item.id} toast={item}>
          <ToastContent>
            <ToastTitle />
            <ToastDescription />
          </ToastContent>
          <ToastAction />
          <ToastClose />
        </Toast>
      ))
    }
    render(
      <ToastProvider>
        <Notify />
        <ToastPortal>
          <ToastViewport>
            <List />
          </ToastViewport>
        </ToastPortal>
      </ToastProvider>
    )
    await userEvent.click(screen.getByRole("button", { name: "Notify" }))
    const banner = await screen.findByRole("dialog")
    expect(banner).toHaveAttribute("data-slot", "toast")
    expect(banner.className).toContain("glass")
    expect(banner.querySelector('[data-slot="toast-content"]')).not.toBeNull()
    expect(screen.getByText("Messages")).toHaveAttribute(
      "data-slot",
      "toast-title"
    )
  })
})

describe("the toast manager", () => {
  test("`toast` posts from outside React, and `useToast` still names the hook", () => {
    expect(useToast).toBe(useToastManager)
    expect(typeof toastManager.add).toBe("function")
  })
})

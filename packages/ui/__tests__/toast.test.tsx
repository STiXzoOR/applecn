import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Button } from "../src/components/button"
import { Toaster, useToast } from "../src/components/toast"

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
})

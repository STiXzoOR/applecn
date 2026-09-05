import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "../src/components/popover"

describe("Popover", () => {
  test("opens a dialog with an arrow pointing at its trigger, and closes on an outside press", async () => {
    render(
      <div>
        <Popover>
          <PopoverTrigger>Info</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Calendar</PopoverTitle>
            <PopoverDescription>Change the date.</PopoverDescription>
          </PopoverContent>
        </Popover>
        <button type="button">Outside</button>
      </div>
    )
    await userEvent.click(screen.getByRole("button", { name: "Info" }))
    const popover = await screen.findByRole("dialog", { name: "Calendar" })
    expect(popover).toHaveAttribute("data-slot", "popover-content")
    expect(popover.className).toContain("rounded-4xl")
    expect(popover.className).toContain("material-regular")
    expect(popover.className).toContain("shadow-glass")
    expect(popover.querySelector('[data-slot="popover-arrow"]')).not.toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Outside" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { checkA11y } from "./helpers/axe"
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
    expect(popover.className).toContain("rounded-popover")
    expect(popover.className).toContain("glass")
    // `glass` writes `--elevation-glass` itself, and swaps it for the dialog elevation under
    // reduced transparency. A `shadow-glass` beside it is emitted later and unconditionally, so
    // it wins in BOTH states and that fallback never lands — see
    // `named-utility-collision.test.ts`.
    expect(popover.className).not.toContain("shadow-")
    expect(popover.querySelector('[data-slot="popover-arrow"]')).not.toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Outside" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

describe("Popover accessibility", () => {
  test("a titled popover names its dialog and has no violations", async () => {
    render(
      <Popover>
        <PopoverTrigger>Info</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Calendar</PopoverTitle>
          <PopoverDescription>Change the date.</PopoverDescription>
        </PopoverContent>
      </Popover>
    )
    await userEvent.click(screen.getByRole("button", { name: "Info" }))
    const popover = await screen.findByRole("dialog", { name: "Calendar" })
    expect(await checkA11y(popover)).toHaveNoViolations()
  })

  test("an untitled popover still names its dialog", async () => {
    render(
      <Popover>
        <PopoverTrigger>Info</PopoverTrigger>
        <PopoverContent>
          <p>No title here.</p>
        </PopoverContent>
      </Popover>
    )
    await userEvent.click(screen.getByRole("button", { name: "Info" }))
    const popover = await screen.findByRole("dialog")
    expect(await checkA11y(popover)).toHaveNoViolations()
  })
})

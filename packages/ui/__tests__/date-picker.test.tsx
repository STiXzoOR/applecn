import { readFileSync } from "node:fs"
import { join } from "node:path"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, test } from "vitest"

import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from "../src/components/date-picker"
import { PlatformProvider } from "../src/lib/platform"
import { checkA11y } from "./helpers/axe"

const SEPTEMBER = new Date(2026, 8, 15)

const day = (iso: string) =>
  document.querySelector<HTMLButtonElement>(`td[data-day="${iso}"] button`)!

describe("DatePicker", () => {
  test("compact is UIDatePicker's grey field, opening the calendar in a popover", async () => {
    const user = userEvent.setup()
    render(<DatePicker defaultValue={SEPTEMBER} defaultMonth={SEPTEMBER} />)

    const trigger = screen.getByRole("button")
    expect(trigger).toHaveAttribute("data-slot", "date-picker-trigger")
    // `variant="gray"` already reads the tint on iOS and the label colour on macOS and the web,
    // through `--button-gray-text` — which is exactly what UIDatePicker's compact field does.
    expect(trigger).toHaveAttribute("data-variant", "gray")
    expect(trigger.textContent).toBe(SEPTEMBER.toLocaleDateString())
    expect(screen.queryByRole("grid")).toBeNull()

    await user.click(trigger)
    expect(screen.getByRole("grid")).toBeInTheDocument()
    expect(day("2026-09-15")).toHaveAttribute("data-selected-single", "true")
  })

  /**
   * `DatePickerContent` destructures `aria-label` for the popover branch, where axe needs a name
   * on the `role="dialog"`. The inline branch returned the calendar without forwarding it, so a
   * caller naming an inline picker was silently ignored.
   */
  test("an inline picker keeps the name its caller gave it", () => {
    render(
      <DatePicker presentation="inline" defaultValue={SEPTEMBER}>
        <DatePickerContent aria-label="Departure" />
      </DatePicker>
    )
    expect(screen.getByLabelText("Departure")).toBeInTheDocument()
  })

  test("inline is the month grid itself, with no trigger and no popover", () => {
    const { container } = render(
      <DatePicker presentation="inline" defaultValue={SEPTEMBER} />
    )
    expect(
      container.querySelector('[data-slot="date-picker"]')
    ).toHaveAttribute("data-presentation", "inline")
    expect(screen.getByRole("grid")).toBeInTheDocument()
    expect(
      screen.queryByTestId("nothing") ??
        container.querySelector('[data-slot="date-picker-trigger"]')
    ).toBeNull()
  })

  test("picking a day reports it and closes the popover", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<Date | undefined>(undefined)
      return (
        <>
          <DatePicker
            value={value}
            onValueChange={setValue}
            defaultMonth={SEPTEMBER}
          />
          <output>{value ? value.toDateString() : "none"}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole("status").textContent).toBe("none")

    await user.click(screen.getByRole("button"))
    await user.click(day("2026-09-10"))
    expect(screen.getByRole("status").textContent).toBe(
      new Date(2026, 8, 10).toDateString()
    )
    expect(
      screen.queryByRole("grid"),
      "the popover closes on a pick"
    ).toBeNull()
  })

  // A Node server cannot know the reader's locale, so it renders `9/8/2026` where an `en-GB`
  // browser hydrates `08/09/2026`; this threw a real hydration error in a browser before the
  // attribute was added, and React's own answer for locale-formatted dates is to suppress it.
  // Asserted against the source because React strips `suppressHydrationWarning` before the DOM,
  // so there is nothing in a rendered tree to read it back from.
  test("the locale-formatted label does not fight hydration", () => {
    const source = readFileSync(
      join(import.meta.dirname, "../src/components/date-picker.tsx"),
      "utf8"
    )
    const trigger = source.slice(source.indexOf("function DatePickerTrigger"))
    expect(trigger.slice(0, trigger.indexOf("</PopoverTrigger>"))).toContain(
      "suppressHydrationWarning"
    )
  })

  test("with no date it shows the placeholder and says it is empty", () => {
    render(<DatePicker placeholder="Choose a day" />)
    const trigger = screen.getByRole("button")
    expect(trigger.textContent).toBe("Choose a day")
    expect(trigger).toHaveAttribute("data-empty", "true")
  })

  test("the label is the locale's date, and a caller can format it themselves", () => {
    render(
      <DatePicker
        defaultValue={SEPTEMBER}
        format={(date) => `Day ${date.getDate()}`}
      />
    )
    expect(screen.getByRole("button").textContent).toBe("Day 15")
  })

  test("the trigger and the content are replaceable, as the catalogue's roots allow", async () => {
    const user = userEvent.setup()
    render(
      <DatePicker defaultValue={SEPTEMBER} defaultMonth={SEPTEMBER}>
        <DatePickerTrigger>Pick</DatePickerTrigger>
        <DatePickerContent captionLayout="dropdown" />
      </DatePicker>
    )
    const trigger = screen.getByRole("button")
    expect(trigger.textContent).toBe("Pick")
    await user.click(trigger)
    // One trigger and one calendar, so the root supplied neither on top of what it was given.
    expect(screen.getAllByRole("grid")).toHaveLength(1)
    expect(screen.getAllByRole("combobox")).toHaveLength(2)
  })

  test("open is controllable the way every overlay in the catalogue is", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open it
          </button>
          <DatePicker
            open={open}
            onOpenChange={setOpen}
            defaultMonth={SEPTEMBER}
          />
        </>
      )
    }
    render(<Controlled />)
    expect(screen.queryByRole("grid")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Open it" }))
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  test("renders on every idiom", () => {
    for (const platform of ["ios", "macos", "web"] as const) {
      const { unmount } = render(
        <PlatformProvider platform={platform}>
          <DatePicker presentation="inline" defaultValue={SEPTEMBER} />
        </PlatformProvider>
      )
      expect(screen.getByRole("grid")).toBeInTheDocument()
      unmount()
    }
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <DatePicker presentation="inline" defaultValue={SEPTEMBER} />
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })

  test("the compact field and its open popover have none either", async () => {
    const user = userEvent.setup()
    render(<DatePicker defaultValue={SEPTEMBER} defaultMonth={SEPTEMBER} />)
    await user.click(screen.getByRole("button"))
    expect(await checkA11y(document.body)).toHaveNoViolations()
  })
})

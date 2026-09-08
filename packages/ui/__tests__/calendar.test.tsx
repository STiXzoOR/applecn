import { readFileSync } from "node:fs"
import { join } from "node:path"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { describe, expect, test } from "vitest"

import { Calendar, CalendarDayButton } from "../src/components/calendar"
import { PlatformProvider } from "../src/lib/platform"
import { checkA11y } from "./helpers/axe"

/** September 2026, so every assertion below names a date that is actually on screen. */
const MONTH = new Date(2026, 8, 1)

/**
 * One day, by the ISO date `react-day-picker` writes on the cell. Not by accessible name: the
 * day button's label is the full "Tuesday, September 15th, 2026", and not by text either, since
 * the outside days repeat "1", "2" and "30" in the same grid.
 */
const day = (iso: string) =>
  document.querySelector<HTMLButtonElement>(`td[data-day="${iso}"] button`)!

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

describe("Calendar", () => {
  test("is a month grid under shadcn's one data-slot", () => {
    const { container } = render(<Calendar month={MONTH} />)
    expect(
      container.querySelector('[data-slot="calendar"]'),
      "shadcn stamps `calendar` from its Root override, and it is the only slot it stamps"
    ).not.toBeNull()
    expect(screen.getByRole("grid")).toBeInTheDocument()
    expect(screen.getByText("September 2026")).toBeInTheDocument()
  })

  // `mode` is what makes the grid interactive: with none, `react-day-picker` renders the numbers
  // as text and no `DayButton` at all, so every assertion about a day names a mode.
  test("a day is a hit target you can hit, drawn as a circle", () => {
    render(<Calendar mode="single" month={MONTH} />)
    // `--hit-target` is Apple's own minimum target — 44 pt on iOS and the web, 28 on macOS — and
    // a calendar day is exactly that. No calendar-specific metric was invented for it.
    expect(day("2026-09-15").className).toContain("size-(--hit-target)")
    expect(day("2026-09-15").className).toContain("rounded-full")
    expect(day("2026-09-15")).toHaveAttribute("data-slot", "button")
  })

  test("a selected day fills the circle, and the unselected say so rather than going quiet", async () => {
    const user = userEvent.setup()
    function Single() {
      const [date, setDate] = useState<Date | undefined>(undefined)
      return (
        <Calendar
          mode="single"
          month={MONTH}
          selected={date}
          onSelect={setDate}
        />
      )
    }
    render(<Single />)
    // `react-day-picker` leaves `modifiers.selected` undefined on an unselected day rather than
    // false, so the attribute is absent rather than "false" — shadcn's markup does the same, and
    // the fidelity harness reads the resting state as its absence.
    expect(day("2026-09-15")).not.toHaveAttribute("data-selected-single")
    await user.click(day("2026-09-15"))
    expect(day("2026-09-15")).toHaveAttribute("data-selected-single", "true")
    expect(day("2026-09-16")).not.toHaveAttribute("data-selected-single")
    expect(day("2026-09-15").className).toContain(
      "data-[selected-single=true]:bg-primary"
    )
    expect(day("2026-09-15").className).toContain(
      "data-[selected-single=true]:text-primary-foreground"
    )
  })

  test("the day button declares no resting colour, so today's tint reaches the number", () => {
    const today = new Date()
    render(<Calendar mode="single" month={today} today={today} />)
    const cell = day(iso(today)).closest("td")!
    expect(cell.className, "Apple draws today's number in the tint").toContain(
      "text-primary"
    )
    // The tint is inherited, which is why it needs no rule of its own to outrank: the button
    // carries `text-inherit` and only overrules it when it is itself painted.
    expect(day(iso(today)).className).toContain("text-inherit")
  })

  test("a range fills its ends and bands its middle", async () => {
    const user = userEvent.setup()
    function Range() {
      const [range, setRange] = useState<DateRange | undefined>(undefined)
      return (
        <Calendar
          mode="range"
          month={MONTH}
          selected={range}
          onSelect={setRange}
        />
      )
    }
    render(<Range />)
    await user.click(day("2026-09-10"))
    await user.click(day("2026-09-13"))
    expect(day("2026-09-10")).toHaveAttribute("data-range-start", "true")
    expect(day("2026-09-13")).toHaveAttribute("data-range-end", "true")
    expect(day("2026-09-11")).toHaveAttribute("data-range-middle", "true")
    expect(day("2026-09-11").className).toContain(
      "data-[range-middle=true]:bg-fill-3"
    )
    // Logical, not physical: the band's ends have to swap under RTL, and the catalogue is
    // RTL-correct throughout. shadcn writes `rounded-l-*`/`rounded-r-*` here.
    expect(day("2026-09-10").className).toContain(
      "data-[range-start=true]:rounded-s-full"
    )
  })

  test("the nav buttons take shadcn's buttonVariant, defaulting to Apple's plain", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Calendar defaultMonth={MONTH} />)
    expect(
      screen.getByRole("button", { name: /previous/i }).className,
      "plain is applecn's tinted, chromeless chevron — shadcn's ghost"
    ).toContain("text-primary")
    await user.click(screen.getByRole("button", { name: /next/i }))
    expect(screen.getByText("October 2026")).toBeInTheDocument()

    rerender(<Calendar defaultMonth={MONTH} buttonVariant="gray" />)
    expect(
      screen.getByRole("button", { name: /previous/i }).className
    ).toContain("bg-(--button-gray-bg)")
  })

  test("shadcn's DayPicker props are forwarded, not swallowed", () => {
    const { container, rerender } = render(
      <Calendar month={MONTH} showOutsideDays={false} />
    )
    // September 2026 opens on a Tuesday, so the first two cells belong to August.
    const first = () => container.querySelector('[role="gridcell"]')!
    expect(first().textContent).toBe("")
    rerender(<Calendar month={MONTH} showOutsideDays />)
    expect(first().textContent).toBe("30")

    rerender(<Calendar defaultMonth={MONTH} captionLayout="dropdown" />)
    expect(
      screen.getAllByRole("combobox").length,
      "captionLayout=dropdown swaps the label for month and year selects"
    ).toBe(2)
  })

  test("a caller's classNames replace the slot they name, as shadcn's do", () => {
    render(
      <Calendar month={MONTH} classNames={{ weekday: "uppercase-weekday" }} />
    )
    const weekday = screen.getByRole("grid").querySelector("th")!
    expect(weekday.className).toBe("uppercase-weekday")
  })

  // shadcn's `data-day` is locale-formatted, so a Node server writes `8/30/2026` where an
  // `en-GB` browser hydrates `30/08/2026` — a real attribute mismatch on every day of every
  // server-rendered calendar, seen in a browser. Asserted against the source because React
  // strips `suppressHydrationWarning` before the DOM.
  test("the locale-formatted data-day does not fight hydration", () => {
    const source = readFileSync(
      join(import.meta.dirname, "../src/components/calendar.tsx"),
      "utf8"
    )
    const button = source.slice(source.indexOf("function CalendarDayButton"))
    expect(button.slice(0, button.indexOf("className="))).toContain(
      "suppressHydrationWarning"
    )
  })

  test("CalendarDayButton is exported for a caller's own components override", () => {
    expect(typeof CalendarDayButton).toBe("function")
    render(
      <Calendar
        mode="single"
        month={MONTH}
        components={{
          DayButton: (props) => (
            <CalendarDayButton {...props} className="ring-2" />
          ),
        }}
      />
    )
    expect(day("2026-09-15").className).toContain("ring-2")
  })

  test("renders on every idiom", () => {
    for (const platform of ["ios", "macos", "web"] as const) {
      const { unmount } = render(
        <PlatformProvider platform={platform}>
          <Calendar month={MONTH} />
        </PlatformProvider>
      )
      expect(screen.getByRole("grid")).toBeInTheDocument()
      unmount()
    }
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <Calendar mode="single" month={MONTH} selected={new Date(2026, 8, 15)} />
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

"use client"

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Button, buttonVariants } from "./button"
import { Icon } from "./icon"

/**
 * A month grid (shadcn's Calendar, on `react-day-picker` — the library its Base UI variant wraps;
 * the two exports, the one `data-slot` and every prop are shadcn's). Apple's is `UICalendarView`
 * and the graphical `NSDatePicker`: a day is a circle you can hit, so the cell is `--hit-target`
 * (44 pt on iOS and the web, 28 on macOS — Apple's own minimum target, not a calendar metric
 * invented for this), today's number takes the tint, and a selected day fills that circle.
 *
 * Two things read differently to shadcn's copy and both are house style rather than divergence:
 * the range band is drawn with logical properties (`rounded-s-*`, `after:end-0`), because the
 * catalogue is RTL-correct throughout; and colours are the applecn ramp. Exports, `data-slot` and
 * props are unchanged.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "plain",
  locale,
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--hit-target) p-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--hit-target) p-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--hit-target) w-full items-center justify-center px-(--hit-target)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--hit-target) w-full items-center justify-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--control-radius-small)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none",
          captionLayout === "label"
            ? "type-headline"
            : "flex items-center gap-1 rounded-(--control-radius-small) type-headline [&>svg]:size-3.5 [&>svg]:text-label-2",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 type-caption-1 font-normal text-label-2 select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--hit-target) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "type-caption-1 text-label-3 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-full",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-full"
            : "[&:first-child[data-selected=true]_button]:rounded-s-full",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-s-full bg-fill-3 after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-fill-3",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-full bg-fill-3 after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-fill-3",
          defaultClassNames.range_end
        ),
        // Today is a COLOUR on the cell rather than a rule on the button, and that is the whole
        // reason the button below declares no resting colour of its own: an inherited tint is
        // beaten by the button's own selected paint without either rule having to outrank the
        // other in the cascade. Apple draws today's number in the tint and fills the circle when
        // it is also the selection.
        today: cn("text-primary", defaultClassNames.today),
        outside: cn(
          "text-label-3 aria-selected:text-label-3",
          defaultClassNames.outside
        ),
        disabled: cn("text-label-3 opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        ),
        Chevron: ({ className, orientation, ...props }) => (
          <Icon
            icon={
              orientation === "left"
                ? ArrowLeft01Icon
                : orientation === "right"
                  ? ArrowRight01Icon
                  : ArrowDown01Icon
            }
            className={cn("size-4", className)}
            {...props}
          />
        ),
        DayButton: (props) => <CalendarDayButton locale={locale} {...props} />,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--hit-target) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

/**
 * One day. `variant="plain"` with `text-inherit` over it is applecn's ghost — transparent, no
 * colour of its own, the hover fill the rest of the catalogue uses — which is what lets the
 * cell's `today` tint reach the number and lets the selected rules below overrule it by sitting
 * on the element itself.
 *
 * `data-selected-single` and the three `data-range-*` are shadcn's own computed attributes, kept
 * exactly: `react-day-picker` marks every day of a range `selected`, so a lone selection and the
 * ends of a range are only distinguishable by composing the modifiers here.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <Button
      variant="plain"
      size="regular"
      shape="circle"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex size-(--hit-target) min-w-(--hit-target) flex-col gap-1 rounded-full p-0 leading-none font-normal text-inherit",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-4 group-data-[focused=true]/day:ring-ring/60",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        "data-[range-start=true]:rounded-s-full data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:rounded-e-full data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-fill-3 data-[range-middle=true]:text-label",
        "[&>span]:type-caption-2 [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

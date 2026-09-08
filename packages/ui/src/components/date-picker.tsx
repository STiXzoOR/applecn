"use client"

import { cn } from "../lib/utils"
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/**
 * A date picker (HIG › Pickers). shadcn ships no `date-picker` component — its docs page is a
 * composition of `popover`, `calendar` and `button` — so this is applecn's, built on those two
 * primitives and never past them, and its surface is its own rather than borrowed.
 *
 * Apple's is `UIDatePicker`, and two of its three presentations are what a browser can honestly
 * draw. `compact` is the small grey field that opens a calendar: `variant="gray"` already reads
 * `--button-gray-text`, which is the tint on iOS and the label colour on macOS and the web —
 * exactly what UIKit and AppKit do, so no paint was invented for it. `inline` is the month grid
 * in place. The third, `wheels`, is a `UIPickerView` — momentum, snapping and a bent cylinder of
 * type — which is a primitive in its own right rather than anything `calendar` and `popover`
 * compose, and it is deliberately not here.
 *
 * One finding that is not this component's to fix: `PopoverContent` gives its `role="dialog"`
 * popup no accessible name of its own, so any popover without a `PopoverTitle` fails axe's
 * `aria-dialog-name` — and `popover.test.tsx` has no `checkA11y` case that would have said so.
 * `DatePickerContent` names its own popup below.
 */
interface DatePickerContextValue {
  readonly value: Date | undefined
  readonly setValue: (date: Date | undefined) => void
  readonly presentation: DatePickerPresentation
  readonly format: (date: Date) => string
  readonly placeholder: string
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null)

/** The picker's value, the way `useSidebar` and `useCarousel` hand back their roots' state. */
function useDatePicker(): DatePickerContextValue {
  const context = useContext(DatePickerContext)
  if (!context)
    throw new Error("useDatePicker must be used within a <DatePicker>")
  return context
}

type DatePickerPresentation = "compact" | "inline"

type DatePickerProps = Omit<ComponentProps<"div">, "defaultValue"> & {
  presentation?: DatePickerPresentation
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** What the compact field shows with no date. */
  placeholder?: string
  /** How the compact field writes the date. The locale's own format by default. */
  format?: (date: Date) => string
  /** The month the calendar opens on, forwarded to the default `DatePickerContent`. */
  defaultMonth?: Date
  children?: ReactNode
}

function DatePicker({
  presentation = "compact",
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  placeholder = "Select date",
  format = (date) => date.toLocaleDateString(),
  defaultMonth,
  className,
  children,
  ...props
}: DatePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const currentValue = value ?? uncontrolledValue
  const isOpen = open ?? uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }
  const setValue = (next: Date | undefined) => {
    if (value === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
    setOpen(false)
  }

  // The catalogue's root pattern (`Breadcrumb`, `Carousel`, `InputOTP`): a root supplies the
  // parts it was not given, so the shorthand and the explicit composition reach one tree.
  const given = Children.toArray(children)
  const has = (part: unknown) =>
    given.some((child) => isValidElement(child) && child.type === part)

  const body = (
    <>
      {presentation === "compact" && !has(DatePickerTrigger) ? (
        <DatePickerTrigger />
      ) : null}
      {children}
      {has(DatePickerContent) ? null : (
        <DatePickerContent defaultMonth={defaultMonth} />
      )}
    </>
  )

  return (
    <DatePickerContext.Provider
      value={{
        value: currentValue,
        setValue,
        presentation,
        format,
        placeholder,
      }}
    >
      <div
        data-slot="date-picker"
        data-presentation={presentation}
        className={cn("w-fit", className)}
        {...props}
      >
        {presentation === "compact" ? (
          <Popover open={isOpen} onOpenChange={setOpen}>
            {body}
          </Popover>
        ) : (
          body
        )}
      </div>
    </DatePickerContext.Provider>
  )
}

/**
 * The compact field. `data-empty` is what a caller styles the placeholder through, and it is on
 * the element rather than in a class so the same rule works from a stylesheet.
 *
 * `suppressHydrationWarning` is React's own remedy for the one thing this element does: format a
 * date in the reader's locale. A Node server has no way to know that locale, so it renders
 * `9/8/2026` where an `en-GB` browser hydrates `08/09/2026`, React throws a hydration error and
 * discards the tree. The warning is suppressed rather than the formatting made deterministic
 * because the client's answer is the correct one — measured in a browser, where this component
 * threw exactly that error before the attribute was added.
 */
function DatePickerTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof PopoverTrigger>) {
  const { value, format, placeholder } = useDatePicker()
  return (
    <PopoverTrigger
      data-slot="date-picker-trigger"
      data-empty={value === undefined}
      suppressHydrationWarning
      className={cn("tabular-nums data-[empty=true]:text-label-3", className)}
      render={<Button variant="gray" />}
      {...props}
    >
      {children ?? (value ? format(value) : placeholder)}
    </PopoverTrigger>
  )
}

/**
 * The month grid — in a popover when the field opens it, in place when it is inline. Every
 * `Calendar` prop passes through, so `captionLayout`, `disabled`, `today` and the rest are the
 * ones a caller already knows.
 */
function DatePickerContent({
  className,
  "aria-label": label = "Choose a date",
  ...props
}: Omit<ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">) {
  const { value, setValue, presentation } = useDatePicker()
  const inline = presentation === "inline"
  const calendar = (
    <Calendar
      mode="single"
      selected={value}
      onSelect={setValue}
      defaultMonth={value}
      className={cn(inline && className)}
      // The label is destructured for the popover branch below, where it names the popup. Inline
      // there is no popup, so it has to reach the grid itself or a caller who names an inline
      // picker is silently ignored.
      {...(inline ? { "aria-label": label } : {})}
      {...props}
    />
  )
  if (inline) return calendar
  // The popup is a `role="dialog"`, and a calendar gives it nothing to be named by: there is no
  // title to show — Apple's compact picker opens straight onto the grid — so axe fails
  // `aria-dialog-name` without one. The label is a prop, defaulted rather than hardcoded.
  return (
    <PopoverContent
      aria-label={label}
      className={cn("w-auto p-2", className)}
      align="start"
    >
      {calendar}
    </PopoverContent>
  )
}

export { DatePicker, DatePickerContent, DatePickerTrigger, useDatePicker }
export type { DatePickerPresentation, DatePickerProps }

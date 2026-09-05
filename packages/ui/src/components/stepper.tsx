"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { cn } from "cn"

import { Icon } from "./icon"

/**
 * The stepper (HIG › Steppers): the 94×32 pt two-segment control. It shows no value itself —
 * pair it with a label or text field bound to `onValueChange`. The value input stays in the
 * tree for the keyboard and assistive technology, visually hidden.
 */
type StepperProps = NumberFieldPrimitive.Root.Props & {
  "aria-label": string
  className?: string
}

function Stepper({ className, "aria-label": label, ...props }: StepperProps) {
  return (
    <NumberFieldPrimitive.Root data-slot="stepper-root" {...props}>
      <NumberFieldPrimitive.Group
        role="group"
        aria-label={label}
        data-slot="stepper"
        className={cn(
          "inline-flex h-(--stepper-height) w-(--stepper-width) shrink-0 items-stretch overflow-hidden rounded-lg bg-fill-3",
          className
        )}
      >
        <NumberFieldPrimitive.Decrement
          aria-label="Decrement"
          data-slot="stepper-decrement"
          className="flex flex-1 items-center justify-center text-label transition-[background-color] duration-(--duration-press) outline-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-inset active:bg-fill-2 disabled:pointer-events-none disabled:opacity-30"
        >
          <Icon icon={MinusSignIcon} weight="bold" />
        </NumberFieldPrimitive.Decrement>
        <span
          data-slot="stepper-divider"
          aria-hidden="true"
          className="my-1.5 w-[0.5px] bg-separator"
        />
        <NumberFieldPrimitive.Input
          aria-label={label}
          data-slot="stepper-input"
          className="sr-only"
        />
        <NumberFieldPrimitive.Increment
          aria-label="Increment"
          data-slot="stepper-increment"
          className="flex flex-1 items-center justify-center text-label transition-[background-color] duration-(--duration-press) outline-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-inset active:bg-fill-2 disabled:pointer-events-none disabled:opacity-30"
        >
          <Icon icon={PlusSignIcon} weight="bold" />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  )
}

export { Stepper }
export type { StepperProps }

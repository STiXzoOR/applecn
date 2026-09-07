"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"

import { usePlatform } from "../lib/platform"
import { Icon } from "./icon"

/**
 * The stepper (HIG › Steppers). iOS 26: the 94×32 capsule with − and + halves; macOS 26:
 * AppKit's 20×26 vertical control with stacked chevrons on the bezel; the web a 64×28 pair.
 * It shows no value itself — pair it with a label or text field bound to `onValueChange`. The
 * value input stays in the tree for the keyboard and assistive technology, visually hidden.
 */
type StepperProps = NumberFieldPrimitive.Root.Props & {
  "aria-label": string
  className?: string
}

const segmentClassName =
  "flex flex-1 items-center justify-center text-label transition-[background-color] duration-(--duration-press) outline-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-inset active:bg-fill-2 disabled:pointer-events-none disabled:opacity-30"

function Stepper({ className, "aria-label": label, ...props }: StepperProps) {
  const vertical = usePlatform() === "macos"
  const increment = (
    <NumberFieldPrimitive.Increment
      aria-label="Increment"
      data-slot="stepper-increment"
      className={segmentClassName}
    >
      <Icon
        icon={vertical ? ArrowUp01Icon : PlusSignIcon}
        weight="bold"
        scale={vertical ? "small" : "medium"}
      />
    </NumberFieldPrimitive.Increment>
  )
  const decrement = (
    <NumberFieldPrimitive.Decrement
      aria-label="Decrement"
      data-slot="stepper-decrement"
      className={segmentClassName}
    >
      <Icon
        icon={vertical ? ArrowDown01Icon : MinusSignIcon}
        weight="bold"
        scale={vertical ? "small" : "medium"}
      />
    </NumberFieldPrimitive.Decrement>
  )
  const divider = (
    <span
      data-slot="stepper-divider"
      aria-hidden="true"
      className={cn(
        "bg-separator",
        vertical ? "mx-0 h-[0.5px] w-full" : "my-1.5 w-[0.5px]"
      )}
    />
  )
  return (
    <NumberFieldPrimitive.Root data-slot="stepper-root" {...props}>
      <NumberFieldPrimitive.Group
        role="group"
        aria-label={label}
        data-slot="stepper"
        data-orientation={vertical ? "vertical" : "horizontal"}
        className={cn(
          "inline-flex h-(--stepper-height) w-(--stepper-width) shrink-0 items-stretch overflow-hidden rounded-stepper bg-fill-3",
          vertical && "flex-col bg-background-3 shadow-control",
          className
        )}
      >
        {vertical ? increment : decrement}
        {divider}
        <NumberFieldPrimitive.Input
          aria-label={label}
          data-slot="stepper-input"
          className="sr-only"
        />
        {vertical ? decrement : increment}
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  )
}

export { Stepper }
export type { StepperProps }

"use client"

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { usePlatform } from "../lib/platform"
import { Icon } from "./icon"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "./number-field"

/**
 * The stepper (HIG › Steppers). iOS 26: the 94×32 capsule with − and + halves; macOS 26:
 * AppKit's 20×26 vertical control with stacked chevrons on the bezel; the web a 64×28 pair.
 * It shows no value itself — pair it with a label or text field bound to `onValueChange`. The
 * value input stays in the tree for the keyboard and assistive technology, visually hidden.
 *
 * A stepper IS a number field with its box hidden (spec §5.7.1, approved 2026-09-08), so it is
 * built on `number-field` rather than on `@base-ui/react` — the governing rule is that an Apple
 * component composes applecn's primitives and never reaches past them, and this file reached past
 * `number-field` into Base UI's for the increment, decrement and clamping the primitive already
 * wraps.
 *
 * What that costs is written out below, because it is the interesting part. `number-field`'s group
 * is an `input-group`, and Apple's stepper capsule shares NO value with the text field's: the
 * height, width, radius, fill, hairline, shadow, padding and gap are all overruled here. Measured
 * in a browser on all three idioms, the composed capsule lands on the same numbers as the
 * hand-written one — the radius survives because Tailwind emits `rounded-stepper` after
 * `rounded-field`, which is a race and is recorded as one.
 *
 * The shadow is left to the group on purpose, and that is a measured decision rather than an
 * omission. `shadow-control` is a named theme shadow `cn` does not know, so it never merges with
 * anything and the winner is whichever Tailwind emits later — writing `shadow-none` here to clear
 * the group's put the macOS bezel out entirely. It is not needed: `--input-shadow` is `0 0 #0000`
 * on iOS and the web, and on macOS it is `var(--elevation-control)`, which is exactly what
 * `shadow-control` resolves to, so the race has one answer on every idiom.
 *
 * The one class that is neither Apple's nor the group's is the type size. `input-group` writes
 * `--text-field-font` on the container, and `Icon` sizes in `em`, so a stepper composed through it
 * would take the field's type rather than the body type its glyphs were sized off before — no
 * difference on iOS or macOS, where the two tokens agree, but 14 pt against 17 on the web, which
 * shrinks a 20.4 px glyph to 16.8. Pinning `--type-body-size` reproduces exactly what the stepper
 * rendered when it was inheriting, and stops it depending on what it is nested in.
 */
type StepperProps = Omit<ComponentProps<typeof NumberField>, "size"> & {
  "aria-label": string
  className?: string
}

const segmentClassName = "flex-1 px-0 shrink"

function Stepper({ className, "aria-label": label, ...props }: StepperProps) {
  const vertical = usePlatform() === "macos"
  const increment = (
    <NumberFieldIncrement
      data-slot="stepper-increment"
      className={segmentClassName}
    >
      <Icon
        icon={vertical ? ArrowUp01Icon : PlusSignIcon}
        weight="bold"
        scale={vertical ? "small" : "medium"}
      />
    </NumberFieldIncrement>
  )
  const decrement = (
    <NumberFieldDecrement
      data-slot="stepper-decrement"
      className={segmentClassName}
    >
      <Icon
        icon={vertical ? ArrowDown01Icon : MinusSignIcon}
        weight="bold"
        scale={vertical ? "small" : "medium"}
      />
    </NumberFieldDecrement>
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
    <NumberField data-slot="stepper-root" className="block w-auto" {...props}>
      <NumberFieldGroup
        role="group"
        aria-label={label}
        data-slot="stepper"
        data-orientation={vertical ? "vertical" : "horizontal"}
        className={cn(
          "inline-flex h-(--stepper-height) w-(--stepper-width) shrink-0 flex-nowrap items-stretch gap-0 overflow-hidden rounded-stepper border-0 bg-fill-3 p-0 text-[length:var(--type-body-size)] focus-within:ring-0",
          vertical && "flex-col bg-background-3 shadow-control",
          className
        )}
      >
        {vertical ? increment : decrement}
        {divider}
        <NumberFieldInput
          aria-label={label}
          data-slot="stepper-input"
          className="sr-only"
        />
        {vertical ? decrement : increment}
      </NumberFieldGroup>
    </NumberField>
  )
}

export { Stepper }
export type { StepperProps }

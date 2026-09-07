"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "../lib/utils"

/**
 * Radio buttons (HIG › Toggles): two to five mutually exclusive options. Each item is a ring
 * that fills with the tint and shows a white dot when selected, the way AppKit's 16 pt radio
 * does on macOS 26; the sizes come from the platform tokens (22 pt on iOS).
 */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex size-(--radio-size) shrink-0 items-center justify-center rounded-full border-(length:--radio-border-width) bg-transparent shadow-(--radio-shadow) transition-[border-color,background-color] duration-(--duration-press) ease-(--ease-standard) outline-none after:absolute after:-inset-x-2 after:-inset-y-1.5 focus-visible:ring-4 focus-visible:ring-ring/60 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-unchecked:border-(--radio-border) data-unchecked:bg-(--radio-bg) data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span className="block size-(--radio-dot) rounded-full bg-white" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }

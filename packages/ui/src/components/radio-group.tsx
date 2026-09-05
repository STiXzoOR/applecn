"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

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
        "group/radio-group-item peer relative flex size-(--radio-size) shrink-0 items-center justify-center rounded-full border-[1.5px] border-gray-3 bg-transparent transition-[border-color,background-color] duration-(--duration-press) ease-(--ease-standard) outline-none after:absolute after:-inset-2 focus-visible:ring-4 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary macos:border-[0.5px] macos:border-separator macos:bg-background-3 macos:shadow-control macos:data-checked:border-primary macos:data-checked:bg-primary web:border web:border-label-4 web:bg-background-3",
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

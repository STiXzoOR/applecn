"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"

import { Icon } from "./icon"

/**
 * The checkbox (HIG › Toggles). On iOS it is the 22 pt circle of a list in selection mode; on
 * macOS 26 the 16 pt rounded square (4 pt corners) on the control bezel; the web a 16 pt square
 * — the same classes, switched by the platform tokens. Supports the mixed state for a checkbox
 * that controls a group.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative flex size-(--checkbox-size) shrink-0 items-center justify-center rounded-checkbox border-[1.5px] border-gray-3 bg-transparent text-primary-foreground transition-[background-color,border-color] duration-(--duration-press) ease-(--ease-standard) outline-none after:absolute after:-inset-x-2 after:-inset-y-1.5 focus-visible:ring-4 focus-visible:ring-ring/60 aria-invalid:border-destructive data-indeterminate:border-primary data-indeterminate:bg-primary data-checked:border-primary data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-40 macos:border macos:shadow-control macos:data-unchecked:border-label-3 macos:data-unchecked:bg-background-3 web:border web:data-unchecked:border-label-4 web:data-unchecked:bg-background-3",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex size-full items-center justify-center text-current group-data-indeterminate/checkbox:[&_svg]:hidden"
      >
        <Icon
          icon={Tick02Icon}
          weight="bold"
          scale="medium"
          className="size-[70%]"
        />
        <span
          aria-hidden="true"
          className="hidden h-[1.5px] w-[50%] rounded-full bg-current group-data-indeterminate/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

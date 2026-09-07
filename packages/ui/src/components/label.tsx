"use client"

import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/**
 * A control's label (HIG › Labels): body text, never dimmed unless the control is disabled.
 * Base UI renders toggles as a `<span>`, so the disabled state travels on `data-disabled`
 * rather than the `:disabled` pseudo-class — matched whether the control is wrapped or beside.
 */
function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 type-body text-label select-none peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-40 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Label }

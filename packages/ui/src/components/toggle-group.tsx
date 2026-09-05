"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cn } from "cn"

/**
 * A toggle group (HIG › Segmented controls, the select-any style): a joined set of toggle
 * buttons on the fill — Keynote's bold/italic/underline — single-select by default, or
 * `multiple`. It shares the segmented control's geometry: the platform's height and corner, a
 * white pressed segment with the segment shadow on iOS and the web, the accent fill on macOS.
 */
type ToggleGroupProps = ToggleGroupPrimitive.Props & {
  "aria-label"?: string
}

function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(
        "inline-flex h-(--segmented-height) items-stretch rounded-segmented bg-fill-3 p-(--segmented-inset)",
        className
      )}
      {...props}
    />
  )
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex min-w-(--segmented-height) flex-1 items-center justify-center gap-1.5 rounded-[calc(var(--radius-segmented)-var(--segmented-inset))] px-3 text-[length:var(--segmented-font)] leading-none font-medium whitespace-nowrap text-label transition-[background-color,box-shadow,color] duration-(--duration-press) ease-(--ease-standard) outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40 data-pressed:bg-background data-pressed:font-semibold data-pressed:shadow-segment macos:data-pressed:bg-primary macos:data-pressed:text-white macos:data-pressed:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
export type { ToggleGroupProps }

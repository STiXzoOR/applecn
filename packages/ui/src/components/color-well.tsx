"use client"

import { cn } from "../lib/utils"
import { useState, type ComponentProps } from "react"

/**
 * A colour well (HIG › Color wells): the native colour input, presented as Apple does — a
 * 28 pt ring around the swatch on iOS 26, AppKit's 48×24 capsule with the swatch inside on
 * macOS 26. Activating it opens the system colour picker.
 */
type ColorWellProps = Omit<ComponentProps<"input">, "type" | "size"> & {
  "aria-label": string
}

function ColorWell({
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: ColorWellProps) {
  const [internal, setInternal] = useState(String(defaultValue ?? "#000000"))
  const current = value !== undefined ? String(value) : internal
  return (
    <label
      data-slot="color-well"
      className={cn(
        "relative inline-flex h-(--color-well-height) w-(--color-well-width) cursor-pointer items-center justify-center rounded-(--color-well-radius) border-(length:--color-well-border-width) border-gray-3 bg-(--color-well-bg) p-(--color-well-padding) shadow-(--color-well-shadow) outline-none focus-within:ring-4 focus-within:ring-ring/60",
        className
      )}
    >
      <span
        data-slot="color-well-swatch"
        aria-hidden="true"
        className="block size-full rounded-(--color-well-swatch-radius)"
        style={{ backgroundColor: current }}
      />
      <input
        type="color"
        data-slot="color-well-input"
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        value={current}
        onChange={(event) => {
          setInternal(event.target.value)
          onChange?.(event)
        }}
        {...props}
      />
    </label>
  )
}

export { ColorWell }
export type { ColorWellProps }

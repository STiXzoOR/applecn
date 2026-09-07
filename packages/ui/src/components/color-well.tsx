"use client"

import { cn } from "cn"
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
        "relative inline-flex size-7 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-gray-3 p-0.5 outline-none focus-within:ring-4 focus-within:ring-ring/60 macos:h-(--control-height-regular) macos:w-12 macos:rounded-control macos:border-0 macos:bg-background-3 macos:p-1 macos:shadow-control",
        className
      )}
    >
      <span
        data-slot="color-well-swatch"
        aria-hidden="true"
        className="block size-full rounded-full macos:rounded-[calc(var(--radius-control)-4px)]"
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

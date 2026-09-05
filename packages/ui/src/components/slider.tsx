"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"
import type { ReactNode } from "react"

/**
 * The slider (HIG › Sliders): a 4 pt track that fills from the minimum to a 28 pt white thumb
 * (20 pt on macOS), with optional images at either end that illustrate the extremes.
 */
type SliderProps = SliderPrimitive.Root.Props & {
  /** Image or glyph at the minimum end (leading). */
  minimumValueLabel?: ReactNode
  /** Image or glyph at the maximum end (trailing). */
  maximumValueLabel?: ReactNode
  "aria-label"?: string
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  minimumValueLabel,
  maximumValueLabel,
  "aria-label": label,
  ...props
}: SliderProps) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [value ?? defaultValue ?? min]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "flex items-center gap-3 data-horizontal:w-full data-vertical:h-full",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      {minimumValueLabel ? (
        <span
          data-slot="slider-minimum-label"
          aria-hidden="true"
          className="flex shrink-0 items-center text-label-2"
        >
          {minimumValueLabel}
        </span>
      ) : null}
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-40 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-fill select-none data-horizontal:h-(--slider-track) data-horizontal:w-full data-vertical:h-full data-vertical:w-(--slider-track)"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            aria-label={values.length === 1 ? label : undefined}
            className="block size-(--slider-thumb) shrink-0 rounded-full bg-white shadow-thumb transition-[box-shadow] duration-(--duration-press) select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
      {maximumValueLabel ? (
        <span
          data-slot="slider-maximum-label"
          aria-hidden="true"
          className="flex shrink-0 items-center text-label-2"
        >
          {maximumValueLabel}
        </span>
      ) : null}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }

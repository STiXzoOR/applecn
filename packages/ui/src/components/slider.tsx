"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"
import type { ReactNode } from "react"

/**
 * The slider (HIG › Sliders). iOS 26: a 6 pt track that fills from the minimum to a 37×24
 * white pill knob, which grows into the Liquid Glass lens while dragged; macOS 26: a 4 pt track
 * with a 20×16 oval knob; the web keeps TV's 5 pt track and 13 pt round thumb. Optional images
 * at either end illustrate the extremes.
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
      thumbAlignment="center"
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
      <SliderPrimitive.Control className="relative flex min-h-(--slider-thumb-height) w-full touch-none items-center py-1 select-none data-disabled:opacity-40 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
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
            className="block h-(--slider-thumb-height) w-(--slider-thumb-width) shrink-0 knob select-none focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:outline-hidden disabled:pointer-events-none data-dragging:scale-110"
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

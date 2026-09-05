"use client"

import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

/**
 * Gauges (HIG › Gauges): a value within a known range that is not progress — storage used,
 * battery, a fitness ring. `Meter` is the linear gauge on the progress-bar track with a label
 * and the value as a percentage; `Gauge` the circular one with the value in the centre, at the
 * activity-indicator sizes. Both can take a system colour for capacity levels.
 */
const meterColors = {
  tint: "bg-primary",
  green: "bg-system-green",
  yellow: "bg-system-yellow",
  orange: "bg-system-orange",
  red: "bg-system-red",
} as const

type MeterColor = keyof typeof meterColors

type MeterProps = Omit<MeterPrimitive.Root.Props, "children"> & {
  label?: ReactNode
  color?: MeterColor
  /** Hide the percentage at the trailing edge. */
  hideValue?: boolean
}

function Meter({
  className,
  label,
  color = "tint",
  hideValue = false,
  value,
  min = 0,
  max = 100,
  ...props
}: MeterProps) {
  const percent = Math.round(((value - min) / (max - min)) * 100)
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      data-color={color}
      value={value}
      min={min}
      max={max}
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}
      {...props}
    >
      {label ? (
        <MeterPrimitive.Label
          data-slot="meter-label"
          className="type-footnote text-label"
        >
          {label}
        </MeterPrimitive.Label>
      ) : null}
      {!hideValue ? (
        <MeterPrimitive.Value
          data-slot="meter-value"
          className="ms-auto type-footnote text-label-2 tabular-nums"
        >
          {() => `${percent}%`}
        </MeterPrimitive.Value>
      ) : null}
      <MeterPrimitive.Track
        data-slot="meter-track"
        className="relative flex h-(--progress-height) w-full basis-full items-center overflow-hidden rounded-full bg-fill-2"
      >
        <MeterPrimitive.Indicator
          data-slot="meter-indicator"
          className={cn(
            "h-full rounded-full transition-[width] duration-(--duration-overlay) ease-(--ease-standard)",
            meterColors[color]
          )}
        />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  )
}

const gaugeVariants = cva("relative inline-grid shrink-0 place-items-center", {
  variants: {
    size: {
      small: "size-(--spinner-medium)",
      medium: "size-(--spinner-large)",
      large: "size-16",
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

const gaugeStrokes = {
  tint: "stroke-primary",
  green: "stroke-system-green",
  yellow: "stroke-system-yellow",
  orange: "stroke-system-orange",
  red: "stroke-system-red",
} as const

type GaugeProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof gaugeVariants> & {
    value: number
    min?: number
    max?: number
    label: string
    color?: MeterColor
    /** Text in the centre; the value by default. */
    children?: ReactNode
  }

function Gauge({
  className,
  size = "medium",
  value,
  min = 0,
  max = 100,
  label,
  color = "tint",
  children,
  ...props
}: GaugeProps) {
  const percent = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  )
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      data-slot="gauge"
      data-color={color}
      className={cn(gaugeVariants({ size }), className)}
      {...props}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="col-start-1 row-start-1 size-full -rotate-90"
      >
        <circle
          data-slot="gauge-track"
          cx="18"
          cy="18"
          r="15"
          strokeWidth="4"
          className="stroke-fill-2"
        />
        <circle
          data-slot="gauge-indicator"
          cx="18"
          cy="18"
          r="15"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 - percent}
          className={cn(
            "transition-[stroke-dashoffset] duration-(--duration-overlay) ease-(--ease-standard)",
            gaugeStrokes[color]
          )}
        />
      </svg>
      <span
        data-slot="gauge-value"
        className={cn(
          "col-start-1 row-start-1 font-semibold text-label tabular-nums",
          size === "large" ? "type-headline" : "type-caption-2"
        )}
      >
        {children ?? Math.round(value)}
      </span>
    </div>
  )
}

export { Gauge, Meter, gaugeVariants, meterColors }
export type { GaugeProps, MeterColor, MeterProps }

"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * Progress indicators (HIG › Progress indicators). `Progress` is the 4 pt linear bar that fills
 * from the leading edge; `value={null}` makes it indeterminate. `ProgressCircular` fills a ring
 * clockwise at the activity-indicator sizes.
 */
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn(
        "relative flex h-(--progress-height) w-full items-center overflow-hidden rounded-full bg-fill-2",
        className
      )}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full rounded-full bg-primary transition-[width] duration-(--duration-overlay) ease-(--ease-standard) data-indeterminate:w-1/3 data-indeterminate:animate-[progress-indeterminate_1.5s_ease-in-out_infinite] motion-reduce:data-indeterminate:animate-none",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("type-footnote text-label", className)}
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn(
        "ms-auto type-footnote text-label-2 tabular-nums",
        className
      )}
      {...props}
    />
  )
}

const progressCircularVariants = cva(
  "inline-block shrink-0 -rotate-90 text-primary",
  {
    variants: {
      size: {
        medium: "size-(--spinner-medium)",
        large: "size-(--spinner-large)",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
)

type ProgressCircularProps = Omit<ComponentProps<"svg">, "children"> &
  VariantProps<typeof progressCircularVariants> & {
    /** 0–100, or `null` for indeterminate. */
    value: number | null
  }

function ProgressCircular({
  className,
  size = "medium",
  value,
  ...props
}: ProgressCircularProps) {
  const determinate = value !== null
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : 25
  return (
    <svg
      data-slot="progress-circular"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      {...(determinate ? { "aria-valuenow": clamped } : {})}
      viewBox="0 0 36 36"
      fill="none"
      className={cn(
        progressCircularVariants({ size }),
        !determinate && "animate-spin motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <circle
        data-slot="progress-circular-track"
        cx="18"
        cy="18"
        r="15"
        strokeWidth="3"
        className="stroke-fill-2"
      />
      <circle
        data-slot="progress-circular-indicator"
        cx="18"
        cy="18"
        r="15"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset={100 - clamped}
        className="stroke-current transition-[stroke-dashoffset] duration-(--duration-overlay) ease-(--ease-standard)"
      />
    </svg>
  )
}

export {
  Progress,
  ProgressCircular,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
  progressCircularVariants,
}
export type { ProgressCircularProps }

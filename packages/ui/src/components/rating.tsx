"use client"

import { StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { useId, useState, type ComponentProps, type KeyboardEvent } from "react"

import { Icon } from "./icon"

/**
 * A rating indicator (HIG › Rating indicators): five stars, filled to the value, as on the
 * App Store. Read-only by default (an image with the value in its name); with
 * `onValueChange` it becomes a radio group of stars that the arrow keys move through.
 */
type RatingProps = Omit<ComponentProps<"div">, "onChange"> & {
  /** 0–`max`, halves allowed when read-only. */
  value: number
  max?: number
  label: string
  onValueChange?: (value: number) => void
  size?: "small" | "medium" | "large"
}

const sizes = {
  small: "[&_svg]:size-3",
  medium: "[&_svg]:size-4",
  large: "[&_svg]:size-6",
}

function Rating({
  className,
  value,
  max = 5,
  label,
  onValueChange,
  size = "medium",
  onKeyDown,
  ...props
}: RatingProps) {
  const id = useId()
  const [hover, setHover] = useState<number | null>(null)
  const interactive = Boolean(onValueChange)
  const shown = hover ?? value

  const stars = Array.from({ length: max }, (_, i) => {
    const fill = Math.max(0, Math.min(1, shown - i))
    return (
      <span
        key={i}
        data-slot="rating-star"
        data-fill={fill}
        className="relative inline-flex text-label-4"
      >
        <Icon icon={StarIcon} className="fill-current stroke-none" />
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden text-system-orange"
          style={{ width: `${fill * 100}%` }}
        >
          <Icon icon={StarIcon} className="fill-current stroke-none" />
        </span>
      </span>
    )
  })

  if (!interactive) {
    return (
      <div
        role="img"
        aria-label={`${label}: ${value} out of ${max}`}
        data-slot="rating"
        className={cn(
          "inline-flex items-center gap-0.5",
          sizes[size],
          className
        )}
        {...props}
      >
        {stars}
      </div>
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = (delta: number) => {
      event.preventDefault()
      onValueChange?.(Math.max(1, Math.min(max, Math.round(value) + delta)))
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") step(1)
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") step(-1)
    else if (event.key === "Home") {
      event.preventDefault()
      onValueChange?.(1)
    } else if (event.key === "End") {
      event.preventDefault()
      onValueChange?.(max)
    }
    onKeyDown?.(event)
  }

  return (
    // oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- the stars are the focusable radios; keys bubble up
    <div
      role="radiogroup"
      aria-label={label}
      data-slot="rating"
      className={cn("inline-flex items-center gap-0.5", sizes[size], className)}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {stars.map((star, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={Math.round(value) === i + 1}
          aria-label={`${i + 1} of ${max}`}
          id={`${id}-${i}`}
          tabIndex={
            Math.round(value) === i + 1 || (value < 1 && i === 0) ? 0 : -1
          }
          data-slot="rating-radio"
          className="inline-flex rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
          onMouseEnter={() => setHover(i + 1)}
          onClick={() => onValueChange?.(i + 1)}
        >
          {star}
        </button>
      ))}
    </div>
  )
}

export { Rating }
export type { RatingProps }

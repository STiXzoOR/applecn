"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps, KeyboardEvent } from "react"

/**
 * Page controls (HIG › Page controls): a row of 7 pt dots 9 pt apart, the current page filled.
 * Pressing a dot or using the arrow keys moves between pages. `prominent` shows the
 * thin-material capsule behind the dots when the control is primary navigation.
 */
const pageControlVariants = cva(
  "inline-flex items-center gap-(--page-control-gap)",
  {
    variants: {
      background: {
        automatic: "rounded-full px-2 py-1",
        prominent: "rounded-full material-thin px-2 py-1",
        minimal: "",
      },
    },
    defaultVariants: {
      background: "automatic",
    },
  }
)

type PageControlProps = Omit<ComponentProps<"div">, "onChange"> &
  VariantProps<typeof pageControlVariants> & {
    count: number
    index: number
    onIndexChange?: (index: number) => void
  }

function PageControl({
  className,
  background = "automatic",
  count,
  index,
  onIndexChange,
  onKeyDown,
  ...props
}: PageControlProps) {
  const move = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next))
    if (clamped !== index) onIndexChange?.(clamped)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      move(index + 1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      move(index - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      move(0)
    } else if (event.key === "End") {
      event.preventDefault()
      move(count - 1)
    }
    onKeyDown?.(event)
  }

  return (
    <div
      role="tablist"
      data-slot="page-control"
      data-background={background}
      className={cn(pageControlVariants({ background }), className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Page ${i + 1}`}
          tabIndex={i === index ? 0 : -1}
          data-slot="page-control-dot"
          className="size-(--page-control-dot) rounded-full bg-label-4 transition-colors duration-(--duration-press) outline-none focus-visible:ring-4 focus-visible:ring-ring/60 aria-selected:bg-label"
          onClick={() => move(i)}
        />
      ))}
    </div>
  )
}

export { PageControl, pageControlVariants }
export type { PageControlProps }

import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/**
 * Split views (HIG › Split views): two or three adjacent panes — sidebar, content list, detail —
 * with 1 pt dividers, stacking into a single column below the `lg` breakpoint.
 *
 * It is a grid rather than a `resizable` group, and that is a decision rather than an omission
 * (spec §5.6, corrected 2026-09-08). `react-resizable-panels` writes a panel's size as an inline
 * flex ratio and takes no `var()`, so the measured per-idiom pane widths could only reach it as a
 * literal; and the group fixes `display`, `flex-direction`, `flex-wrap` and `overflow` inline, so
 * the one-column collapse below `lg` could not survive it. A split view that wants a draggable
 * seam composes `resizable` around these panes, which is what a shadcn user reaches for anyway.
 */
type SplitViewProps = ComponentProps<"div"> & {
  columns?: 2 | 3
}

function SplitView({ className, columns = 2, ...props }: SplitViewProps) {
  return (
    <div
      data-slot="split-view"
      data-columns={columns}
      className={cn(
        "grid min-h-0 grid-cols-1",
        columns === 3
          ? "lg:grid-cols-[var(--split-view-sidebar-width)_var(--split-view-content-width)_1fr]"
          : "lg:grid-cols-[var(--split-view-sidebar-width)_1fr]",
        className
      )}
      {...props}
    />
  )
}

function SplitViewSidebar({
  className,
  "aria-label": label = "Sidebar",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="split-view-sidebar"
      aria-label={label}
      className={cn(
        "min-w-0 bg-sidebar lg:border-e-[0.5px] lg:border-separator",
        className
      )}
      {...props}
    />
  )
}

function SplitViewContent({
  className,
  "aria-label": label = "Content",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="split-view-content"
      aria-label={label}
      className={cn(
        "min-w-0 lg:border-e-[0.5px] lg:border-separator",
        className
      )}
      {...props}
    />
  )
}

function SplitViewDetail({
  className,
  "aria-label": label = "Detail",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      data-slot="split-view-detail"
      aria-label={label}
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export { SplitView, SplitViewContent, SplitViewDetail, SplitViewSidebar }
export type { SplitViewProps }

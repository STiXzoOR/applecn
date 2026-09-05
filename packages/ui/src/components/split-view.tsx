import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * Split views (HIG › Split views): two or three adjacent panes — sidebar, content list, detail —
 * with 1 pt dividers, stacking into a single column below the `lg` breakpoint.
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

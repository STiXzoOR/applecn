"use client"

import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "../lib/utils"

/**
 * Panes a pointer can redraw (shadcn's Resizable). Apple's is the macOS split divider: a
 * half-point hairline between two panes, a few points of grab either side of it, and — where
 * the divider is meant to be found rather than merely used — the grabber pill iPadOS puts on
 * its Split View seam. `split-view` is rebuilt on this in Phase 4 and gains the drag it never
 * had.
 *
 * Three things `react-resizable-panels` does that a caller has to know, all of them shadcn's
 * behaviour too since both wrap the same library:
 *
 * - The group writes `display`, `flex-direction`, `width: 100%` and `height: 100%` inline, so a
 *   height class on the group does nothing. Size the box around it.
 * - A panel's `className` lands on the scroll box the library wraps the children in, not on the
 *   `data-slot="resizable-panel"` element.
 * - Only the separator carries `aria-orientation`, and it carries the group's inverted axis —
 *   which is what the handle's rules key off. The group emits none, so a rule keyed on the
 *   group's orientation can never match.
 */
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full", className)}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

type ResizableHandleProps = ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}

/**
 * The divider. The line is the catalogue's hairline — `w-[0.5px] bg-separator`, the same one
 * `separator` and `list` draw — and the `after:` strip widens the target to 4 px, which is
 * shadcn's number and roughly AppKit's grab margin.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-[0.5px] items-center justify-center bg-separator",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:outline-hidden",
        "aria-[orientation=horizontal]:h-[0.5px] aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        // The grip is a child, so the axis it has to follow is read from the separator, as
        // shadcn does: one pill, turned on its side when the seam is.
        "[&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          aria-hidden="true"
          className="z-10 h-(--control-height-small) w-1 shrink-0 rounded-full bg-fill-2"
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
export type { ResizableHandleProps }

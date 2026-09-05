"use client"

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "cn"

/**
 * A scroll view (HIG › Scroll views) with Apple's overlay scrollbars: the content scrolls
 * natively, and a rounded thumb on the tertiary label fades in while scrolling or hovering
 * and out again when idle, never taking layout space.
 */
type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  orientation?: "vertical" | "horizontal" | "both"
}

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative min-h-0 min-w-0", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" ? (
        <ScrollAreaScrollbar orientation="vertical" />
      ) : null}
      {orientation !== "vertical" ? (
        <ScrollAreaScrollbar orientation="horizontal" />
      ) : null}
      {orientation === "both" ? (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      ) : null}
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollAreaScrollbar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      keepMounted
      className={cn(
        "flex touch-none opacity-0 transition-opacity duration-(--duration-hover) ease-(--ease-standard) select-none data-hovering:opacity-100 data-hovering:duration-(--duration-press) data-scrolling:opacity-100 data-scrolling:duration-(--duration-press)",
        orientation === "vertical" &&
          "absolute inset-y-0.5 end-0.5 w-2 justify-center",
        orientation === "horizontal" &&
          "absolute inset-x-0.5 bottom-0.5 h-2 flex-col justify-center",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "rounded-full bg-label-3",
          orientation === "vertical" ? "w-1.5" : "h-1.5"
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollAreaScrollbar }
export type { ScrollAreaProps }

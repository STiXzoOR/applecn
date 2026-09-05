"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * Popovers (HIG › Popovers): a transient card on the regular material with an arrow pointing at
 * the control that opened it. For compact widths present a sheet instead.
 */
function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverArrow({ className, ...props }: PopoverPrimitive.Arrow.Props) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(
        "z-50 text-[var(--material-regular-bg)] data-[side=bottom]:-top-[6px] data-[side=left]:-right-[10px] data-[side=left]:rotate-90 data-[side=right]:-left-[10px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-[6px] data-[side=top]:rotate-180",
        className
      )}
      {...props}
    >
      <svg
        width="13"
        height="7"
        viewBox="0 0 13 7"
        aria-hidden="true"
        className="block"
      >
        <path d="M0 7 L5.2 1.2 Q6.5 0 7.8 1.2 L13 7 Z" fill="currentColor" />
      </svg>
    </PopoverPrimitive.Arrow>
  )
}

function PopoverContent({
  className,
  children,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-elevated=""
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-3 rounded-4xl material-regular p-4 text-label shadow-popover outline-hidden duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <PopoverArrow />
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("type-headline text-label", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("type-subheadline text-label-2", className)}
      {...props}
    />
  )
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

export {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}

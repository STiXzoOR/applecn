"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/**
 * Popovers (HIG › Popovers): a transient Liquid Glass card with an arrow pointing at the
 * control that opened it, on the platform's popover corner (26 pt on iOS 26, 12 on macOS and
 * the web). For compact widths present a sheet instead.
 *
 * Spec §3.2, fourth instance: Base UI's popup is `role="dialog"`, and ARIA requires a dialog to
 * have an accessible name. shadcn's file supplies none, so every popover without a
 * `PopoverTitle` fails axe's `aria-dialog-name` — a `PopoverTitle` is optional in shadcn's own
 * composition and its own examples ship without one. `PopoverContent` therefore defaults
 * `aria-label`. A `PopoverTitle` still wins: accname reads `aria-labelledby` before `aria-label`,
 * so the title names the dialog whenever there is one and the fallback speaks only when there is
 * not. Exports, slots and props are shadcn's exactly; only the default value of a prop differs.
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
        "z-50 text-[var(--material-glass-bg)] data-[side=bottom]:-top-[6px] data-[side=left]:-right-[10px] data-[side=left]:rotate-90 data-[side=right]:-left-[10px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-[6px] data-[side=top]:rotate-180",
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

/**
 * The card. `aria-label` DEFAULTS to "Popover" rather than being left unset: Base UI's popup is a
 * `role="dialog"`, and a popover composed without a `PopoverTitle` fails axe's `aria-dialog-name`
 * with no name at all (spec §3.2). The accessible-name computation reads `aria-labelledby` first,
 * so a title still names the card whenever there is one.
 *
 * That default is a literal English string, and it is the prop a localised app overrides: pass
 * `aria-label` on every untitled popover, or give the card a `PopoverTitle` and the default never
 * speaks. It is a default rather than a hardcoded value for exactly this reason.
 */
function PopoverContent({
  className,
  children,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  "aria-label": label = "Popover",
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
          aria-label={label}
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-3 rounded-popover glass p-4 text-label outline-hidden duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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

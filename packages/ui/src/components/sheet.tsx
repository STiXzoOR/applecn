"use client"

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { Icon } from "./icon"

/**
 * An edge panel (shadcn's Sheet): a modal surface attached to one edge of the window. Apple's is
 * the inspector — iPadOS's trailing panel, the macOS document inspector — so it is flush to its
 * edge with a hairline on the side that faces the content, and no corner radius: a panel Apple
 * attaches to the window rather than a card floating in it.
 *
 * Not to be confused with `drawer`, which is the bottom sheet with a grabber and detents.
 * spec §5.2 freed this name for exactly this component.
 */
function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/**
 * The portal the panel renders through. shadcn defines it and keeps it internal; applecn exports
 * it, as it exports `DialogPortal`, so a consumer can place the panel in a container of their own.
 * `SheetContent` already wraps itself in one, so it is rarely written by hand.
 */
function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** The dimmed layer behind the panel, on the measured sheet scrim. Exported for the same reason. */
function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] transition-opacity duration-(--duration-sheet) ease-(--ease-sheet) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * `side` is shadcn's, and the geometry is Apple's panel: the measured sidebar width — 320 pt on
 * iPadOS, AppKit's 240, 260 on the web — for the two inline edges, and content height for the
 * block ones. That token is the only measured panel width Apple's tables publish; an inspector
 * has no separate one, so it is read rather than a new token invented for it.
 *
 * The panel slides its whole width in and out on the sheet curve, which is how Apple presents an
 * inspector, rather than shadcn's 2.5 rem nudge.
 */
const sheetContentVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-popover p-6 text-label shadow-dialog transition-transform duration-(--duration-sheet) ease-(--ease-sheet) will-change-transform outline-none motion-reduce:transition-none",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-(--sidebar-width) max-w-[calc(100%-2rem)] border-l border-separator data-ending-style:translate-x-full data-starting-style:translate-x-full",
        left: "inset-y-0 left-0 h-full w-(--sidebar-width) max-w-[calc(100%-2rem)] border-r border-separator data-ending-style:-translate-x-full data-starting-style:-translate-x-full",
        top: "inset-x-0 top-0 max-h-[80%] w-full border-b border-separator data-ending-style:-translate-y-full data-starting-style:-translate-y-full",
        bottom:
          "inset-x-0 bottom-0 max-h-[80%] w-full border-t border-separator data-ending-style:translate-y-full data-starting-style:translate-y-full",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

/**
 * `showCloseButton` is shadcn's, and defaults to shadcn's `true`. The button is Apple's round
 * in-panel dismiss, named "Close" for assistive technology.
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props &
  VariantProps<typeof sheetContentVariants> & {
    showCloseButton?: boolean
  }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-elevated=""
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className="absolute end-4 top-4"
            render={<Button variant="gray" size="small" shape="circle" />}
          >
            <Icon icon={Cancel01Icon} weight="bold" className="size-3" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

/** The panel's title block. `mt-auto` on the footer is shadcn's: the actions sit at the bottom. */
function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-row-reverse flex-wrap items-center gap-2",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("type-headline text-label", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("type-subheadline text-label-2", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}

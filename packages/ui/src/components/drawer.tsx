"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "../lib/utils"
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react"

import { useIsDesktop } from "../hooks/use-media-query"
import { dialogBackdropClassName, dialogPopupClassName } from "./dialog"

/**
 * Sheets (HIG › Sheets). Below the `sm` breakpoint a sheet rises from the bottom on the sheet
 * radius with a grabber, resting at the `large` detent or, with `detent="medium"`, at half
 * height as an inset card with all corners rounded (iOS 26). From `sm` up the same children
 * render as a centred card. `DrawerToolbar` places Cancel leading, the title centred and Done
 * trailing, the way iOS sheets do.
 */
type Presentation = "sheet" | "dialog"

const PresentationContext = createContext<Presentation>("sheet")

type DrawerProps = Pick<
  DialogPrimitive.Root.Props,
  "open" | "defaultOpen" | "onOpenChange" | "modal" | "children"
>

function Drawer(props: DrawerProps) {
  const desktop = useIsDesktop()
  const presentation: Presentation = desktop ? "dialog" : "sheet"
  return (
    <PresentationContext.Provider value={presentation}>
      {desktop ? (
        <DialogPrimitive.Root data-slot="drawer" {...props} />
      ) : (
        <DrawerPrimitive.Root
          data-slot="drawer"
          swipeDirection="down"
          {...(props as DrawerPrimitive.Root.Props)}
        />
      )}
    </PresentationContext.Provider>
  )
}

function useDrawerPresentation() {
  return useContext(PresentationContext)
}

function DrawerTrigger(props: DialogPrimitive.Trigger.Props) {
  const presentation = useDrawerPresentation()
  return presentation === "dialog" ? (
    <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />
  ) : (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...(props as DrawerPrimitive.Trigger.Props)}
    />
  )
}

function DrawerClose({ className, ...props }: DialogPrimitive.Close.Props) {
  const presentation = useDrawerPresentation()
  const closeClassName = cn(
    "type-body text-primary outline-none focus-visible:ring-4 focus-visible:ring-ring/60 active:opacity-60",
    className
  )
  return presentation === "dialog" ? (
    <DialogPrimitive.Close
      data-slot="drawer-close"
      className={closeClassName}
      {...props}
    />
  ) : (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={closeClassName}
      {...props}
    />
  )
}

type DrawerContentProps = DialogPrimitive.Popup.Props & {
  /** Where the sheet rests on a phone: the full `large` height, or `medium` at half height. */
  detent?: "medium" | "large"
}

function DrawerContent({
  className,
  children,
  detent = "large",
  ...props
}: DrawerContentProps) {
  const presentation = useDrawerPresentation()

  if (presentation === "dialog") {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="drawer-overlay"
          className={dialogBackdropClassName}
        />
        <DialogPrimitive.Popup
          data-slot="drawer-popup"
          data-presentation="dialog"
          data-elevated=""
          className={cn(dialogPopupClassName, "gap-0 p-0", className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    )
  }

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="drawer-overlay"
        className="fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-(--duration-sheet) ease-(--ease-sheet) data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0"
      />
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className="fixed inset-0 z-50"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-presentation="sheet"
          data-detent={detent}
          data-elevated=""
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex [translate:0_var(--drawer-swipe-movement-y)] flex-col bg-popover text-label shadow-dialog transition-transform duration-(--duration-sheet) ease-(--ease-sheet) will-change-transform outline-none data-ending-style:translate-y-full data-starting-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-none",
            detent === "medium"
              ? "mx-2 mb-[max(0.5rem,env(safe-area-inset-bottom))] h-[50dvh] rounded-sheet"
              : "max-h-[calc(100dvh-var(--nav-bar-height))] rounded-t-sheet pb-[env(safe-area-inset-bottom)]",
            className
          )}
          {...(props as DrawerPrimitive.Popup.Props)}
        >
          <div
            data-slot="drawer-swipe-handle"
            aria-hidden="true"
            className="mx-auto mt-[5px] h-(--sheet-grabber-height) w-(--sheet-grabber-width) shrink-0 rounded-full bg-fill-2"
          />
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  const presentation = useDrawerPresentation()
  const titleClassName = cn(
    "truncate text-center text-[length:var(--nav-bar-title-font)] font-semibold text-label",
    className
  )
  return presentation === "dialog" ? (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={titleClassName}
      {...props}
    />
  ) : (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={titleClassName}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  const presentation = useDrawerPresentation()
  const descriptionClassName = cn("type-subheadline text-label-2", className)
  return presentation === "dialog" ? (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={descriptionClassName}
      {...props}
    />
  ) : (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={descriptionClassName}
      {...props}
    />
  )
}

type DrawerToolbarProps = ComponentProps<"div"> & {
  /** Leading item: Cancel, Close or Back. */
  cancel?: ReactNode
  /** Trailing item: Done, Add, Save. */
  done?: ReactNode
}

function DrawerToolbar({
  className,
  cancel,
  done,
  children,
  ...props
}: DrawerToolbarProps) {
  return (
    <div
      data-slot="drawer-toolbar"
      className={cn(
        "grid h-(--sheet-toolbar-height) shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4",
        className
      )}
      {...props}
    >
      <div
        data-slot="drawer-toolbar-leading"
        className="flex justify-self-start"
      >
        {cancel}
      </div>
      <div data-slot="drawer-toolbar-title" className="min-w-0">
        {children}
      </div>
      <div
        data-slot="drawer-toolbar-trailing"
        className="flex justify-self-end font-semibold"
      >
        {done}
      </div>
    </div>
  )
}

/**
 * The title and description at the top of the sheet, on its 16 pt inset. shadcn's Drawer header;
 * `DrawerToolbar` is the iOS alternative, with Cancel and Done flanking a centred title.
 */
function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex shrink-0 flex-col gap-1 px-4 py-4", className)}
      {...props}
    />
  )
}

/** The actions under the sheet's body, pinned to its bottom. shadcn's Drawer footer. */
function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 px-4 pb-4",
        className
      )}
      {...props}
    />
  )
}

function DrawerSection({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-section"
      className={cn("flex flex-col gap-4 px-4 py-4", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSection,
  DrawerTitle,
  DrawerToolbar,
  DrawerTrigger,
  useDrawerPresentation,
}
export type { DrawerContentProps, DrawerProps, DrawerToolbarProps }

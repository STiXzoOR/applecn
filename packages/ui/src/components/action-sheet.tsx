"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react"

import { useIsDesktop } from "../hooks/use-media-query"

/**
 * Action sheets (HIG › Action sheets): choices related to an action the person started. On a
 * phone the iOS 26 card rises from the bottom, inset from the edges: Liquid Glass with 34 pt
 * corners, a centred title and message, and 48 pt capsule actions on the fill 8 pt apart —
 * destructive choices in red, Cancel a bolder capsule at the bottom. From `sm` up (iPad,
 * desktop) it becomes a popover anchored to the control, with the platform's menu rows, and
 * Cancel disappears: pressing outside dismisses.
 */
type Presentation = "sheet" | "popover"

const PresentationContext = createContext<Presentation>("sheet")

function ActionSheet(props: DrawerPrimitive.Root.Props) {
  const desktop = useIsDesktop()
  const presentation: Presentation = desktop ? "popover" : "sheet"
  return (
    <PresentationContext.Provider value={presentation}>
      {desktop ? (
        <PopoverPrimitive.Root
          data-slot="action-sheet"
          {...(props as PopoverPrimitive.Root.Props)}
        />
      ) : (
        <DrawerPrimitive.Root
          data-slot="action-sheet"
          swipeDirection="down"
          {...props}
        />
      )}
    </PresentationContext.Provider>
  )
}

function useActionSheetPresentation() {
  return useContext(PresentationContext)
}

function ActionSheetTrigger(props: DrawerPrimitive.Trigger.Props) {
  const presentation = useActionSheetPresentation()
  return presentation === "popover" ? (
    <PopoverPrimitive.Trigger
      data-slot="action-sheet-trigger"
      {...(props as PopoverPrimitive.Trigger.Props)}
    />
  ) : (
    <DrawerPrimitive.Trigger data-slot="action-sheet-trigger" {...props} />
  )
}

type ActionSheetContentProps = ComponentProps<"div"> & {
  title?: ReactNode
  message?: ReactNode
}

function ActionSheetContent({
  className,
  title,
  message,
  children,
  ...props
}: ActionSheetContentProps) {
  const presentation = useActionSheetPresentation()
  const actions: ReactNode[] = []
  const cancels: ReactNode[] = []
  for (const child of Array.isArray(children) ? children : [children]) {
    if (
      child &&
      typeof child === "object" &&
      "type" in child &&
      child.type === ActionSheetCancel
    )
      cancels.push(child)
    else if (child) actions.push(child)
  }

  const header =
    title || message ? (
      <div
        data-slot="action-sheet-header"
        className={cn(
          "flex flex-col gap-0.5 text-center",
          presentation === "popover" ? "px-4 py-3" : "px-6 pt-5 pb-2"
        )}
      >
        {title ? (
          presentation === "popover" ? (
            <PopoverPrimitive.Title
              data-slot="action-sheet-title"
              className="type-footnote font-semibold text-label-2"
            >
              {title}
            </PopoverPrimitive.Title>
          ) : (
            <DrawerPrimitive.Title
              data-slot="action-sheet-title"
              className="text-[length:var(--alert-message-font)] font-semibold text-label-2"
            >
              {title}
            </DrawerPrimitive.Title>
          )
        ) : null}
        {message ? (
          presentation === "popover" ? (
            <PopoverPrimitive.Description
              data-slot="action-sheet-message"
              className="type-footnote text-label-2"
            >
              {message}
            </PopoverPrimitive.Description>
          ) : (
            <DrawerPrimitive.Description
              data-slot="action-sheet-message"
              className="text-[length:var(--alert-message-font)] text-label-2"
            >
              {message}
            </DrawerPrimitive.Description>
          )
        ) : null}
      </div>
    ) : null

  if (presentation === "popover") {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="action-sheet-content"
            data-presentation="popover"
            data-elevated=""
            className={cn(
              "z-50 flex min-w-(--menu-width) origin-(--transform-origin) flex-col rounded-menu glass p-(--menu-padding) text-label shadow-glass duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              className
            )}
            {...props}
          >
            {header}
            <div data-slot="action-sheet-group" className="flex flex-col">
              {actions}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    )
  }

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="action-sheet-backdrop"
        className="fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-(--duration-sheet) ease-(--ease-sheet) data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0"
      />
      <DrawerPrimitive.Viewport
        data-slot="action-sheet-viewport"
        className="fixed inset-0 z-50"
      >
        <DrawerPrimitive.Popup
          data-slot="action-sheet-content"
          data-presentation="sheet"
          data-elevated=""
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex [translate:0_var(--drawer-swipe-movement-y)] flex-col items-center px-(--list-inset) pb-[max(var(--list-inset),env(safe-area-inset-bottom))] text-label transition-transform duration-(--duration-sheet) ease-(--ease-sheet) will-change-transform outline-none data-ending-style:translate-y-full data-starting-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-none",
            className
          )}
          {...props}
        >
          <DrawerPrimitive.Content
            data-slot="action-sheet-card"
            className="flex w-full max-w-(--action-sheet-width) flex-col overflow-hidden rounded-[var(--action-sheet-radius)] glass shadow-dialog"
          >
            {header}
            <div
              data-slot="action-sheet-group"
              className="flex flex-col gap-(--action-sheet-gap) p-(--action-sheet-inset)"
            >
              {actions}
              {cancels.length > 0 ? (
                <div
                  data-slot="action-sheet-cancel-group"
                  className="flex flex-col gap-(--action-sheet-gap)"
                >
                  {cancels}
                </div>
              ) : null}
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

type ActionSheetActionProps = DrawerPrimitive.Close.Props & {
  destructive?: boolean
}

const capsuleClassName =
  "flex h-(--action-sheet-row-height) w-full items-center justify-center truncate rounded-full bg-fill-3 px-4 text-[length:var(--alert-title-font)] leading-none font-medium transition-[background-color,transform] duration-(--duration-press) outline-none select-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.97] disabled:opacity-40 motion-reduce:active:scale-100"

function ActionSheetAction({
  className,
  destructive = false,
  ...props
}: ActionSheetActionProps) {
  const presentation = useActionSheetPresentation()
  const actionClassName = cn(
    presentation === "popover"
      ? "flex h-(--menu-item-height) w-full items-center justify-center truncate rounded-menu-item px-4 text-[length:var(--menu-font)] outline-none select-none hover:bg-fill-3 focus-visible:bg-fill-3 active:bg-fill-2 disabled:opacity-40 macos:hover:bg-selection macos:hover:text-white"
      : capsuleClassName,
    destructive ? "text-destructive" : "text-primary",
    className
  )
  return presentation === "popover" ? (
    <PopoverPrimitive.Close
      data-slot="action-sheet-action"
      data-destructive={destructive || undefined}
      className={actionClassName}
      {...(props as PopoverPrimitive.Close.Props)}
    />
  ) : (
    <DrawerPrimitive.Close
      data-slot="action-sheet-action"
      data-destructive={destructive || undefined}
      className={actionClassName}
      {...props}
    />
  )
}

function ActionSheetCancel({
  className,
  ...props
}: DrawerPrimitive.Close.Props) {
  const presentation = useActionSheetPresentation()
  if (presentation === "popover") return null
  return (
    <DrawerPrimitive.Close
      data-slot="action-sheet-cancel"
      className={cn(capsuleClassName, "font-semibold text-primary", className)}
      {...props}
    />
  )
}

export {
  ActionSheet,
  ActionSheetAction,
  ActionSheetCancel,
  ActionSheetContent,
  ActionSheetTrigger,
  useActionSheetPresentation,
}
export type { ActionSheetActionProps, ActionSheetContentProps }

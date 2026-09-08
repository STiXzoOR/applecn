"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import { Children, type ComponentProps } from "react"

/**
 * Alerts (HIG › Alerts). iOS 26: a 320 pt Liquid Glass card with 34 pt corners, a left-aligned
 * 17 pt title and 13 pt message, an optional text field, and 48 pt capsule actions on the fill
 * inside a 16 pt inset, 8 pt apart — two side by side, Cancel leading; three or more stacked
 * with the preferred action on top. macOS 26: AppKit's 260 pt alert with centred text and 28 pt
 * push buttons, the preferred one filled with the accent. Every action dismisses the alert.
 */
function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/** The dimmed layer behind the alert. shadcn's name for what Base UI calls the backdrop. */
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] duration-(--duration-overlay) motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-elevated=""
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-(--alert-width) max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-alert glass [text-align:var(--alert-text-align)] text-label shadow-dialog duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  )
}

/**
 * The title and description together. Layout-neutral on purpose: each of them already carries the
 * alert's measured padding, so a gap here would space them twice.
 */
function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "px-(--alert-title-px) pt-(--alert-title-pt) pb-1 text-[length:var(--alert-title-font)] leading-snug font-semibold text-label",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "px-(--alert-description-px) pb-3 text-[length:var(--alert-message-font)] leading-snug text-(--alert-description-text)",
        className
      )}
      {...props}
    />
  )
}

/**
 * An icon or illustration above the title — shadcn's slot for it. Layout only: it carries the
 * alert's own horizontal inset and top padding so a media row does not space the card twice, and
 * takes no opinion on the artwork's size, because the research document measures no such element
 * on either idiom. A consumer sizes their own glyph.
 */
function AlertDialogMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "flex items-center justify-center px-(--alert-title-px) pt-(--alert-title-pt) pb-1",
        className
      )}
      {...props}
    />
  )
}

/** A text field row inside the alert (password prompts). */
function AlertDialogField({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-field"
      className={cn("px-(--alert-field-px) pb-2", className)}
      {...props}
    />
  )
}

type AlertDialogActionsProps = ComponentProps<"div"> & {
  /** Force a layout; by default two actions sit side by side and three or more stack. */
  layout?: "horizontal" | "stacked"
}

function AlertDialogActions({
  className,
  layout,
  children,
  ...props
}: AlertDialogActionsProps) {
  const count = Children.toArray(children).filter(Boolean).length
  const resolved = layout ?? (count <= 2 ? "horizontal" : "stacked")
  return (
    <div
      data-slot="alert-dialog-actions"
      data-layout={resolved}
      className={cn(
        "grid gap-(--alert-button-gap) p-(--alert-button-inset)",
        resolved === "horizontal" ? "grid-cols-2" : "grid-cols-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * shadcn's name for the action row. The same layout `AlertDialogActions` gives it — spec §3 asks
 * for shadcn's exports carrying shadcn's semantics, styled as Apple, not a second appearance.
 * The slot really is `alert-dialog-footer` and not `alert-dialog-actions`: `AlertDialogActions`
 * writes its own `data-slot` BEFORE spreading `{...props}`, so this one wins. A shadcn-shaped
 * alert therefore has a footer node and no actions node, which is what a shadcn user's CSS and
 * queries expect.
 */
function AlertDialogFooter(props: AlertDialogActionsProps) {
  return <AlertDialogActions data-slot="alert-dialog-footer" {...props} />
}

const alertDialogActionVariants = cva(
  "flex h-(--alert-button-height) min-w-0 items-center justify-center truncate rounded-(--alert-button-radius) px-3 text-[length:var(--alert-title-font)] leading-none transition-[background-color,transform] duration-(--duration-press) outline-none select-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-(--alert-button-active-scale) disabled:opacity-40 motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
      },
      preferred: {
        true: "bg-(--alert-button-bg-preferred) font-(--alert-button-font-weight-preferred) shadow-(--alert-button-shadow-preferred)",
        false:
          "bg-(--alert-button-bg) font-(--alert-button-font-weight) shadow-(--alert-button-shadow)",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        preferred: false,
        class: "text-(--alert-button-text-default)",
      },
      {
        variant: "default",
        preferred: true,
        class: "text-(--alert-button-text-default-preferred)",
      },
      {
        variant: "destructive",
        preferred: false,
        class: "text-(--alert-button-text-destructive)",
      },
      {
        variant: "destructive",
        preferred: true,
        class: "text-(--alert-button-text-destructive-preferred)",
      },
    ],
    defaultVariants: {
      variant: "default",
      preferred: false,
    },
  }
)

type AlertDialogActionProps = AlertDialogPrimitive.Close.Props &
  VariantProps<typeof alertDialogActionVariants>

function AlertDialogAction({
  className,
  variant = "default",
  preferred = false,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      data-variant={variant}
      className={cn(
        alertDialogActionVariants({ variant, preferred }),
        className
      )}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  preferred = false,
  ...props
}: Omit<AlertDialogActionProps, "variant">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(
        alertDialogActionVariants({ variant: "default", preferred }),
        className
      )}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogField,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogActionVariants,
}
export type { AlertDialogActionProps, AlertDialogActionsProps }

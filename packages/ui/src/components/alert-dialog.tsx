"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
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

function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        data-slot="alert-dialog-backdrop"
        className="fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] duration-(--duration-overlay) motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-elevated=""
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-(--alert-width) max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-alert glass text-start text-label shadow-dialog duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 macos:text-center",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
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
        "px-6 pt-5 pb-1 text-[length:var(--alert-title-font)] leading-snug font-semibold text-label macos:px-4 macos:pt-6",
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
        "px-6 pb-3 text-[length:var(--alert-message-font)] leading-snug text-label-2 macos:px-4 macos:text-label",
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
      className={cn("px-6 pb-2 macos:px-4", className)}
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

const alertDialogActionVariants = cva(
  "flex h-(--alert-button-height) min-w-0 items-center justify-center truncate rounded-full bg-fill-3 px-3 text-[length:var(--alert-title-font)] leading-none font-medium transition-[background-color,transform] duration-(--duration-press) outline-none select-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.97] disabled:opacity-40 motion-reduce:active:scale-100 macos:rounded-control macos:bg-background-3 macos:text-label macos:shadow-control macos:active:scale-100 web:font-normal",
  {
    variants: {
      variant: {
        default: "text-primary macos:text-label",
        destructive: "text-destructive macos:text-destructive",
      },
      preferred: {
        true: "font-semibold macos:bg-primary macos:text-white macos:shadow-none",
        false: "",
      },
    },
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
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogActionVariants,
}
export type { AlertDialogActionProps, AlertDialogActionsProps }

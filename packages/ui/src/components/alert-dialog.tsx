"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Children, type ComponentProps } from "react"

/**
 * Alerts (HIG › Alerts): a 270 pt card on thick material with a title, an optional message,
 * an optional text field and up to three buttons. Two short actions sit side by side, Cancel
 * leading; three or more stack with the preferred action on top. Every action dismisses the
 * alert. Text is left-aligned, as on iOS 26.
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
          "fixed top-1/2 left-1/2 z-50 flex w-(--alert-width) max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-4xl material-thick text-start text-label shadow-dialog duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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
      className={cn("px-4 pt-5 pb-4 type-headline text-label", className)}
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
      className={cn("-mt-3 px-4 pb-4 type-footnote text-label-2", className)}
      {...props}
    />
  )
}

/** A text field row inside the alert (password prompts). */
function AlertDialogField({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-field"
      className={cn("-mt-1 px-4 pb-4", className)}
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
        "border-t-[0.5px] border-separator",
        resolved === "horizontal"
          ? "grid grid-cols-2 [&>*+*]:border-s-[0.5px] [&>*+*]:border-separator"
          : "flex flex-col [&>*+*]:border-t-[0.5px] [&>*+*]:border-separator",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const alertDialogActionVariants = cva(
  "flex h-(--alert-button-height) min-w-0 items-center justify-center truncate px-3 type-body outline-none select-none focus-visible:bg-fill-4 active:bg-fill-3 disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive: "text-destructive",
      },
      preferred: {
        true: "font-semibold",
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

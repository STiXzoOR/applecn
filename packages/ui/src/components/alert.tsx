import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/**
 * An inline notification (shadcn's Alert). Apple's is the notification banner — a card with a
 * leading glyph, a semibold title and a message underneath — so this is that banner rendered in
 * flow rather than dropped in from the top: the same card corner, the same subheadline pair and
 * the same 12 pt inset `toast` uses, on the grouped card surface instead of glass, because it
 * sits on the content layer rather than floating above it.
 *
 * `AlertAction` is shadcn's trailing control, the banner's "Undo" or "Retry", parked opposite the
 * text in a column of its own.
 */
const alertVariants = cva(
  "group/alert relative grid w-full grid-cols-[0_1fr_auto] items-start gap-y-0.5 rounded-card bg-card p-3 text-label has-[>svg]:grid-cols-[auto_1fr_auto] has-[>svg]:gap-x-3 [&>svg]:size-[1.2em] [&>svg]:translate-y-px",
  {
    variants: {
      variant: {
        default: "[&>svg]:text-primary",
        destructive:
          "bg-destructive/10 text-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/** The banner's headline: one line, semibold, in the message's own text style. */
function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 truncate type-subheadline font-semibold [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

/** The message under it, in the secondary label colour. */
function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 type-subheadline text-label-2 [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-3 row-span-full ms-3 self-center justify-self-end",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants }

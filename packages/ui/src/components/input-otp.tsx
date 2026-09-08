"use client"

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { MinusSignIcon } from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import { useId, type ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * A passcode field: the row of one-character boxes for a verification code or passcode, as
 * in Apple ID's two-factor prompt. Each box is the platform's bordered text field; typing
 * advances, Backspace retreats, and pasting fills the row.
 *
 * `aria-label` names the field through a hidden `<label>`, which is what Base UI reads: it
 * names the group and the first box, and the boxes after it say which digit they are.
 *
 * Two markups reach the same tree. applecn's is the shorthand — `length` and nothing else, and
 * the field lays out its own boxes. shadcn's is explicit, `InputOTPGroup`/`InputOTPSlot`/
 * `InputOTPSeparator` written out, and giving `InputOTP` any children hands the layout over to
 * them. Both render the same `InputOTPSlot`, so `[data-slot="input-otp-slot"]` selects the boxes
 * either way.
 */
type InputOTPProps = Omit<OTPFieldPrimitive.Root.Props, "length"> & {
  "aria-label": string
  className?: string
  length?: number
  /** shadcn's name for `length`, so its markup transplants unchanged. */
  maxLength?: number
}

function InputOTP({
  className,
  "aria-label": label,
  id: idProp,
  length,
  maxLength,
  children,
  ...props
}: InputOTPProps) {
  const generatedId = useId()
  // Base UI names the field, and its first box, from an associated `<label>` — it ignores
  // `aria-label` on that box, which otherwise leaves it unnamed. The label carries the name
  // for both, so the root takes neither `role` nor `aria-label` of its own.
  const id = idProp ?? generatedId
  const count = length ?? maxLength ?? 6
  return (
    <OTPFieldPrimitive.Root
      id={id}
      data-slot="input-otp"
      length={count}
      inputMode="numeric"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children ??
        Array.from({ length: count }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
    </OTPFieldPrimitive.Root>
  )
}

/** A run of boxes read as one chunk, as in `123 456`. */
function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/**
 * One box. Base UI takes each input's position from the order it renders in, so `index` is not
 * what makes the box work — it is shadcn's prop, kept so its markup transplants unchanged, and
 * used here only to say which digit the box is. The first box is left unlabelled on purpose:
 * `InputOTP`'s `<label>` names it, and an `aria-label` would override the field's own name.
 */
function InputOTPSlot({
  className,
  index,
  ...props
}: OTPFieldPrimitive.Input.Props & { index?: number }) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-slot"
      aria-label={index ? `Digit ${index + 1}` : undefined}
      className={cn(
        "h-(--passcode-field-height) w-(--passcode-field-width) rounded-field border-(length:--passcode-field-border-width) border-(--passcode-field-border-color) bg-background-3 text-center text-[length:var(--control-font-large)] font-medium text-label shadow-(--passcode-field-shadow) transition-[box-shadow] duration-(--duration-hover) outline-none focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    />
  )
}

/** The dash between two groups. */
function InputOTPSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center text-label-3", className)}
      {...props}
    >
      <Icon icon={MinusSignIcon} scale="small" weight="semibold" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
export type { InputOTPProps }

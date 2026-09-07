"use client"

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { cn } from "../lib/utils"
import { useId } from "react"

/**
 * A passcode field: the row of one-character boxes for a verification code or passcode, as
 * in Apple ID's two-factor prompt. Each box is the platform's bordered text field; typing
 * advances, Backspace retreats, and pasting fills the row.
 *
 * `aria-label` names the field through a hidden `<label>`, which is what Base UI reads: it
 * names the group and the first box, and the boxes after it say which digit they are.
 */
type PasscodeFieldProps = Omit<OTPFieldPrimitive.Root.Props, "length"> & {
  "aria-label": string
  className?: string
  length?: number
}

function PasscodeField({
  className,
  "aria-label": label,
  id: idProp,
  length = 6,
  ...props
}: PasscodeFieldProps) {
  const generatedId = useId()
  // Base UI names the field, and its first box, from an associated `<label>` — it ignores
  // `aria-label` on that box, which otherwise leaves it unnamed. The label carries the name
  // for both, so the root takes neither `role` nor `aria-label` of its own.
  const id = idProp ?? generatedId
  return (
    <OTPFieldPrimitive.Root
      id={id}
      data-slot="passcode-field"
      length={length}
      inputMode="numeric"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {Array.from({ length }, (_, i) => (
        <OTPFieldPrimitive.Input
          key={i}
          data-slot="passcode-field-input"
          aria-label={`Digit ${i + 1}`}
          className="h-(--passcode-field-height) w-(--passcode-field-width) rounded-field border-(length:--passcode-field-border-width) border-(--passcode-field-border-color) bg-background-3 text-center text-[length:var(--control-font-large)] font-medium text-label shadow-(--passcode-field-shadow) transition-[box-shadow] duration-(--duration-hover) outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
        />
      ))}
    </OTPFieldPrimitive.Root>
  )
}

export { PasscodeField }
export type { PasscodeFieldProps }

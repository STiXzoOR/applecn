"use client"

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { cn } from "cn"

/**
 * A passcode field: the row of one-character boxes for a verification code or passcode, as
 * in Apple ID's two-factor prompt. Each box is the platform's bordered text field; typing
 * advances, Backspace retreats, and pasting fills the row.
 */
type PasscodeFieldProps = Omit<OTPFieldPrimitive.Root.Props, "length"> & {
  "aria-label": string
  className?: string
  length?: number
}

function PasscodeField({
  className,
  "aria-label": label,
  length = 6,
  ...props
}: PasscodeFieldProps) {
  return (
    <OTPFieldPrimitive.Root
      role="group"
      aria-label={label}
      data-slot="passcode-field"
      length={length}
      inputMode="numeric"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, i) => (
        <OTPFieldPrimitive.Input
          key={i}
          data-slot="passcode-field-input"
          aria-label={`Digit ${i + 1}`}
          className="h-(--alert-button-height) w-10 rounded-field border-[0.5px] border-separator bg-background-3 text-center text-[length:var(--control-font-large)] font-medium text-label transition-[box-shadow] duration-(--duration-hover) outline-none focus-visible:ring-4 focus-visible:ring-ring/60 macos:h-(--control-height-large) macos:w-8 macos:shadow-control web:border web:border-label-4"
        />
      ))}
    </OTPFieldPrimitive.Root>
  )
}

export { PasscodeField }
export type { PasscodeFieldProps }

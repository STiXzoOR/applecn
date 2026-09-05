"use client"

import { PasscodeField } from "@applecn/ui/components/passcode-field"
import { Text } from "@applecn/ui/components/text"

export default function PasscodeFieldBasic() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Text variant="headline">Two-Factor Authentication</Text>
      <Text variant="footnote" color="label-2">
        Enter the code sent to your other devices.
      </Text>
      <PasscodeField aria-label="Verification code" length={6} />
    </div>
  )
}

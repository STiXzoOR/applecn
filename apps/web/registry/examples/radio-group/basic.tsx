"use client"

import { Label } from "@applecn/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@applecn/ui/components/radio-group"

export default function RadioGroupBasic() {
  return (
    <RadioGroup aria-label="Paper size" defaultValue="a4">
      <Label>
        <RadioGroupItem value="letter" /> US Letter
      </Label>
      <Label>
        <RadioGroupItem value="a4" /> A4
      </Label>
      <Label>
        <RadioGroupItem value="legal" /> Legal
      </Label>
    </RadioGroup>
  )
}

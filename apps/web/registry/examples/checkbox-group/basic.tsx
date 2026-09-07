"use client"

import { Checkbox } from "@applecn/ui/components/checkbox"
import { CheckboxGroup } from "@applecn/ui/components/checkbox-group"
import { Label } from "@applecn/ui/components/label"

export default function CheckboxGroupBasic() {
  return (
    <CheckboxGroup
      aria-label="Text style"
      allValues={["bold", "italic", "underline"]}
      defaultValue={["bold"]}
      parent={<Checkbox aria-label="All styles" />}
    >
      <Label>
        <Checkbox value="bold" /> Bold
      </Label>
      <Label>
        <Checkbox value="italic" /> Italic
      </Label>
      <Label>
        <Checkbox value="underline" /> Underline
      </Label>
    </CheckboxGroup>
  )
}

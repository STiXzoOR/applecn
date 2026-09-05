"use client"

import { Checkbox } from "@applecn/ui/components/checkbox"
import { Label } from "@applecn/ui/components/label"

export default function CheckboxBasic() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox defaultChecked /> Bold
      </Label>
      <Label>
        <Checkbox /> Italic
      </Label>
      <Label>
        <Checkbox indeterminate /> All styles
      </Label>
      <Label>
        <Checkbox disabled /> Unavailable
      </Label>
    </div>
  )
}

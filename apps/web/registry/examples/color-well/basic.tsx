"use client"

import { ColorWell } from "@applecn/ui/components/color-well"
import { Label } from "@applecn/ui/components/label"

export default function ColorWellBasic() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Label>
        <ColorWell aria-label="Highlight colour" defaultValue="#ffcc00" />
        Highlight
      </Label>
      <Label>
        <ColorWell aria-label="Accent colour" defaultValue="#0088ff" />
        Accent
      </Label>
    </div>
  )
}

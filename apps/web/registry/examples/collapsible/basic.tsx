"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@applecn/ui/components/collapsible"
import { Label } from "@applecn/ui/components/label"
import { Switch } from "@applecn/ui/components/switch"

export default function CollapsibleBasic() {
  return (
    <Collapsible className="max-w-sm rounded-4xl bg-card px-4">
      <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 pb-3">
          <Label className="justify-between">
            Include audio <Switch aria-label="Include audio" defaultChecked />
          </Label>
          <Label className="justify-between">
            Export as PDF <Switch aria-label="Export as PDF" />
          </Label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

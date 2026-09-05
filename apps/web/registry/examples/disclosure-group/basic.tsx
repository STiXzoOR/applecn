"use client"

import {
  DisclosureGroup,
  DisclosureGroupPanel,
  DisclosureGroupTrigger,
} from "@apple-ds/ui/components/disclosure-group"
import { Label } from "@apple-ds/ui/components/label"
import { Switch } from "@apple-ds/ui/components/switch"

export default function DisclosureGroupBasic() {
  return (
    <DisclosureGroup className="max-w-sm rounded-4xl bg-card px-4">
      <DisclosureGroupTrigger>Advanced Options</DisclosureGroupTrigger>
      <DisclosureGroupPanel>
        <div className="flex flex-col gap-3 pb-3">
          <Label className="justify-between">
            Include audio <Switch aria-label="Include audio" defaultChecked />
          </Label>
          <Label className="justify-between">
            Export as PDF <Switch aria-label="Export as PDF" />
          </Label>
        </div>
      </DisclosureGroupPanel>
    </DisclosureGroup>
  )
}

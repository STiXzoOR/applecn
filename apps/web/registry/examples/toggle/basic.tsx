"use client"

import {
  FilterIcon,
  TextBoldIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons"

import { Icon } from "@apple-ds/ui/components/icon"
import { Toggle } from "@apple-ds/ui/components/toggle"

export default function ToggleBasic() {
  return (
    <div className="flex items-center gap-3">
      <Toggle defaultPressed aria-label="Filter">
        <Icon icon={FilterIcon} /> Filter
      </Toggle>
      <Toggle shape="circle" aria-label="Bold">
        <Icon icon={TextBoldIcon} weight="bold" />
      </Toggle>
      <Toggle shape="circle" aria-label="Italic">
        <Icon icon={TextItalicIcon} weight="bold" />
      </Toggle>
    </div>
  )
}

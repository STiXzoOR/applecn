"use client"

import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@applecn/ui/components/toggle-group"

export default function ToggleGroupBasic() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <Icon icon={TextAlignLeftIcon} weight="semibold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align centre">
          <Icon icon={TextAlignCenterIcon} weight="semibold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <Icon icon={TextAlignRightIcon} weight="semibold" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Font style" multiple defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Icon icon={TextBoldIcon} weight="bold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Icon icon={TextItalicIcon} weight="bold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Icon icon={TextUnderlineIcon} weight="bold" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

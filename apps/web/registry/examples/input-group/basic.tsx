"use client"

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@applecn/ui/components/input-group"

export default function InputGroupBasic() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Icon icon={Search01Icon} className="text-label-2" />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search" placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" variant="gray" aria-label="Clear">
            <Icon icon={Cancel01Icon} weight="bold" className="size-2.5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <InputGroupText className="text-label-2">https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Website" placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupTextarea aria-label="Note" placeholder="Add a note…" />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-label-3">0/280</InputGroupText>
          <InputGroupButton className="ms-auto" variant="tinted">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

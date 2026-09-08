"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@applecn/ui/components/hover-card"
import { Text } from "@applecn/ui/components/text"

export default function HoverCardBasic() {
  return (
    <Text>
      Read the guidelines at{" "}
      <HoverCard>
        <HoverCardTrigger href="https://developer.apple.com/design/">
          developer.apple.com/design
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="aspect-video w-full rounded-lg bg-[linear-gradient(135deg,var(--system-blue),var(--system-purple))]" />
          <div className="flex flex-col gap-0.5">
            <Text variant="headline">Apple Design</Text>
            <Text variant="footnote" color="label-2">
              Human Interface Guidelines, SF Symbols, design resources and the
              Apple Design Awards.
            </Text>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      before you start.
    </Text>
  )
}

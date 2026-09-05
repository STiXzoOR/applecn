"use client"

import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@applecn/ui/components/preview-card"
import { Text } from "@applecn/ui/components/text"

export default function PreviewCardBasic() {
  return (
    <Text>
      Read the guidelines at{" "}
      <PreviewCard>
        <PreviewCardTrigger href="https://developer.apple.com/design/">
          developer.apple.com/design
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="aspect-video w-full rounded-lg bg-[linear-gradient(135deg,var(--system-blue),var(--system-purple))]" />
          <div className="flex flex-col gap-0.5">
            <Text variant="headline">Apple Design</Text>
            <Text variant="footnote" color="label-2">
              Human Interface Guidelines, SF Symbols, design resources and the
              Apple Design Awards.
            </Text>
          </div>
        </PreviewCardContent>
      </PreviewCard>{" "}
      before you start.
    </Text>
  )
}

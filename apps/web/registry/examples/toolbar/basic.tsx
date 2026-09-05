"use client"

import {
  ArrowLeft01Icon,
  Bookmark01Icon,
  Share01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSpacer,
} from "@applecn/ui/components/toolbar"

export default function ToolbarBasic() {
  return (
    <div className="rounded-4xl bg-[linear-gradient(135deg,var(--system-orange),var(--system-pink))] py-4">
      <Toolbar aria-label="Document">
        <ToolbarButton icon={ArrowLeft01Icon} aria-label="Back" />
        <ToolbarSpacer />
        <ToolbarGroup>
          <ToolbarButton icon={Share01Icon} aria-label="Share" />
          <ToolbarButton icon={Bookmark01Icon} aria-label="Bookmark" />
        </ToolbarGroup>
        <ToolbarButton prominent icon={Tick02Icon} aria-label="Done" />
      </Toolbar>
    </div>
  )
}

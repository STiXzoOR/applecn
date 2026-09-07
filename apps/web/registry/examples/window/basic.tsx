"use client"

import {
  Note01Icon,
  Search01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import { List, ListRow, ListSection } from "@applecn/ui/components/list"
import { Toolbar, ToolbarButton } from "@applecn/ui/components/toolbar"
import {
  Window,
  WindowContent,
  WindowTitleBar,
} from "@applecn/ui/components/window"

export default function WindowBasic() {
  return (
    <Window aria-label="Notes" className="max-w-lg">
      <WindowTitleBar
        title="Notes"
        toolbar
        trailing={
          <Toolbar aria-label="Actions" className="min-h-0 px-0">
            <ToolbarButton icon={Search01Icon} aria-label="Search" />
            <ToolbarButton icon={Share01Icon} aria-label="Share" />
          </Toolbar>
        }
      />
      <WindowContent className="bg-grouped-background-1">
        <List aria-label="Notes">
          <ListSection header="Today">
            <ListRow
              leading={
                <Icon icon={Note01Icon} className="text-system-yellow" />
              }
              title="Grocery list"
              subtitle="Milk, eggs, sourdough"
              accessory="disclosure"
            />
            <ListRow title="Ideas for the trip" subtitle="Kyoto in November" />
          </ListSection>
        </List>
      </WindowContent>
    </Window>
  )
}

"use client"

import {
  Copy01Icon,
  Delete02Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@apple-ds/ui/components/context-menu"
import { Text } from "@apple-ds/ui/components/text"

export default function ContextMenuBasic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-sm items-center justify-center rounded-3xl bg-[linear-gradient(135deg,var(--system-teal),var(--system-blue))] text-white select-none">
        <Text variant="subheadline" emphasized color="inherit">
          Secondary-click or long-press
        </Text>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={Copy01Icon}>Copy</ContextMenuItem>
        <ContextMenuItem icon={Share01Icon}>Share…</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" icon={Delete02Icon}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

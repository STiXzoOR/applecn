"use client"

import {
  Copy01Icon,
  Delete02Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@applecn/ui/components/button"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@applecn/ui/components/menu"

export default function MenuBasic() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="gray" />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem icon={Copy01Icon}>
          Copy
          <MenuShortcut>⌘C</MenuShortcut>
        </MenuItem>
        <MenuItem icon={Share01Icon}>Share…</MenuItem>
        <MenuSub>
          <MenuSubTrigger>Sort By</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Name</MenuItem>
            <MenuItem>Date</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked>Show Ruler</MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem variant="destructive" icon={Delete02Icon}>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

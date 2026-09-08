"use client"

import { Button } from "@applecn/ui/components/button"
import { Input } from "@applecn/ui/components/input"
import { List, ListRow, ListSection } from "@applecn/ui/components/list"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerSection,
  DrawerTitle,
  DrawerToolbar,
  DrawerTrigger,
} from "@applecn/ui/components/drawer"
import { Switch } from "@applecn/ui/components/switch"

export default function DrawerBasic() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button />}>New Event</DrawerTrigger>
      <DrawerContent>
        <DrawerToolbar
          cancel={<DrawerClose>Cancel</DrawerClose>}
          done={<DrawerClose>Add</DrawerClose>}
        >
          <DrawerTitle>New Event</DrawerTitle>
        </DrawerToolbar>
        <DrawerSection>
          <Input aria-label="Title" placeholder="Title" />
          <Input aria-label="Location" placeholder="Location or Video Call" />
        </DrawerSection>
        <List aria-label="Options" className="py-0">
          <ListSection>
            <ListRow
              title="All-day"
              trailing={<Switch aria-label="All-day" />}
            />
            <ListRow title="Starts" value="Today, 9:00" />
            <ListRow title="Ends" value="Today, 10:00" />
          </ListSection>
        </List>
      </DrawerContent>
    </Drawer>
  )
}

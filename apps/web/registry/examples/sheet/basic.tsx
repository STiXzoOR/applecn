"use client"

import { Button } from "@applecn/ui/components/button"
import { Input } from "@applecn/ui/components/input"
import { List, ListRow, ListSection } from "@applecn/ui/components/list"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetSection,
  SheetTitle,
  SheetToolbar,
  SheetTrigger,
} from "@applecn/ui/components/sheet"
import { Switch } from "@applecn/ui/components/switch"

export default function SheetBasic() {
  return (
    <Sheet>
      <SheetTrigger render={<Button />}>New Event</SheetTrigger>
      <SheetContent>
        <SheetToolbar
          cancel={<SheetClose>Cancel</SheetClose>}
          done={<SheetClose>Add</SheetClose>}
        >
          <SheetTitle>New Event</SheetTitle>
        </SheetToolbar>
        <SheetSection>
          <Input aria-label="Title" placeholder="Title" />
          <Input aria-label="Location" placeholder="Location or Video Call" />
        </SheetSection>
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
      </SheetContent>
    </Sheet>
  )
}

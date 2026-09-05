"use client"

import { Button } from "@applecn/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@applecn/ui/components/popover"
import { Switch } from "@applecn/ui/components/switch"
import { Text } from "@applecn/ui/components/text"

export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="tinted" />}>
        Options
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Calendar</PopoverTitle>
          <PopoverDescription>Choose what this event shows.</PopoverDescription>
        </PopoverHeader>
        <div className="flex items-center justify-between">
          <Text>All-day</Text>
          <Switch aria-label="All-day" />
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { Button } from "@apple-ds/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@apple-ds/ui/components/popover"
import { Switch } from "@apple-ds/ui/components/switch"
import { Text } from "@apple-ds/ui/components/text"

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

"use client"

import { DatePicker } from "@applecn/ui/components/date-picker"
import { Text } from "@applecn/ui/components/text"
import { useState } from "react"

export default function DatePickerBasic() {
  const [starts, setStarts] = useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col gap-8">
      {/* UIDatePicker's compact presentation: the grey field, the calendar on a tap. */}
      <div className="flex items-center justify-between gap-4">
        <Text>Starts</Text>
        <DatePicker value={starts} onValueChange={setStarts} />
      </div>
      {/* And its inline one: the month in place, no popover. */}
      <DatePicker presentation="inline" defaultValue={starts} />
    </div>
  )
}

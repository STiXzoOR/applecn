"use client"

import { Calendar } from "@applecn/ui/components/calendar"
import { Card, CardContent } from "@applecn/ui/components/card"
import { useState } from "react"

export default function CalendarBasic() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="w-fit">
      {/* The calendar goes transparent inside a card or a popover, so the surface under it is
          the one that paints — shadcn's rule, kept. */}
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
        />
      </CardContent>
    </Card>
  )
}

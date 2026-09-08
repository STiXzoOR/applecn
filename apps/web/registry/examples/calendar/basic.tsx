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
        {/* The default `label` caption, not `dropdown`: it is the month title Apple's calendar
            shows, and the dropdown's locale-formatted month names mismatch across a server
            render. */}
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </CardContent>
    </Card>
  )
}

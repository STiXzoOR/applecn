"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@applecn/ui/components/tabs"
import { Text } from "@applecn/ui/components/text"

export default function TabsBasic() {
  return (
    <Tabs defaultValue="event" className="w-full max-w-sm">
      <TabsList aria-label="Kind">
        <TabsTab value="event">Event</TabsTab>
        <TabsTab value="reminder">Reminder</TabsTab>
      </TabsList>
      <TabsPanel value="event">
        <Text color="label-2">An event has a start and an end.</Text>
      </TabsPanel>
      <TabsPanel value="reminder">
        <Text color="label-2">A reminder has a due date.</Text>
      </TabsPanel>
    </Tabs>
  )
}

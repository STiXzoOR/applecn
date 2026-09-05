"use client"

import {
  Home01Icon,
  Mail01Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { useState } from "react"

import { Switch } from "@applecn/ui/components/switch"
import {
  TabBar,
  TabBarItem,
  TabBarSearch,
} from "@applecn/ui/components/tab-bar"
import { Text } from "@applecn/ui/components/text"

export default function TabBarBasic() {
  const [value, setValue] = useState("home")
  const [minimized, setMinimized] = useState(false)
  return (
    <div className="relative h-72 overflow-hidden rounded-4xl bg-[linear-gradient(160deg,var(--system-mint),var(--system-indigo))] p-4">
      <div className="flex items-center gap-2 text-white">
        <Switch
          aria-label="Minimized"
          checked={minimized}
          onCheckedChange={setMinimized}
          color="tint"
        />
        <Text color="inherit">Minimize on scroll</Text>
      </div>
      <TabBar
        aria-label="Main"
        value={value}
        onValueChange={setValue}
        minimized={minimized}
        className="absolute"
      >
        <TabBarItem value="home" icon={Home01Icon} label="Home" />
        <TabBarItem value="inbox" icon={Mail01Icon} label="Inbox" badge={3} />
        <TabBarItem value="you" icon={UserIcon} label="You" />
        <TabBarSearch icon={Search01Icon} />
      </TabBar>
    </div>
  )
}

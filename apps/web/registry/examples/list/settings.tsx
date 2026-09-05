"use client"

import {
  Airplane01Icon,
  Bluetooth,
  Notification01Icon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons"

import { Icon } from "@applecn/ui/components/icon"
import { List, ListRow, ListSection } from "@applecn/ui/components/list"
import { Switch } from "@applecn/ui/components/switch"

const tile = (color: string) => `${color} text-white`

export default function ListSettings() {
  return (
    <div className="rounded-4xl bg-grouped-background-1">
      <List aria-label="Settings">
        <ListSection
          header="Connections"
          footer="Wi-Fi and Bluetooth stay on for Find My."
        >
          <ListRow
            leading={
              <Icon
                icon={Airplane01Icon}
                className={tile("bg-system-orange")}
              />
            }
            title="Airplane Mode"
            trailing={<Switch aria-label="Airplane Mode" />}
          />
          <ListRow
            leading={
              <Icon icon={Wifi01Icon} className={tile("bg-system-blue")} />
            }
            title="Wi-Fi"
            value="Home"
            accessory="disclosure"
            onClick={() => {}}
          />
          <ListRow
            leading={
              <Icon icon={Bluetooth} className={tile("bg-system-blue")} />
            }
            title="Bluetooth"
            value="On"
            accessory="disclosure"
            onClick={() => {}}
          />
        </ListSection>
        <ListSection header="Notifications">
          <ListRow
            leading={
              <Icon
                icon={Notification01Icon}
                className={tile("bg-system-red")}
              />
            }
            title="Notifications"
            subtitle="Deliver quietly"
            accessory="disclosure"
            onClick={() => {}}
          />
        </ListSection>
      </List>
    </div>
  )
}

'use client'

import { List, ListRow, ListSection } from '@apple-ds/ui/components/list'
import { Switch } from '@apple-ds/ui/components/switch'

export default function SwitchBasic() {
  return (
    <List aria-label="Connectivity">
      <ListSection>
        <ListRow title="Airplane Mode" trailing={<Switch aria-label="Airplane Mode" />} />
        <ListRow title="Wi-Fi" trailing={<Switch aria-label="Wi-Fi" defaultChecked />} />
        <ListRow title="Low Power Mode" trailing={<Switch aria-label="Low Power Mode" color="tint" defaultChecked />} />
        <ListRow title="Unavailable" trailing={<Switch aria-label="Unavailable" disabled />} />
      </ListSection>
    </List>
  )
}

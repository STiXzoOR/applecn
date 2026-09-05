'use client'

import { MoreHorizontalCircle01Icon } from '@hugeicons/core-free-icons'

import { Button } from '@apple-ds/ui/components/button'
import { Icon } from '@apple-ds/ui/components/icon'
import { List, ListRow, ListSection } from '@apple-ds/ui/components/list'
import { NavigationBar, NavigationBarBackButton } from '@apple-ds/ui/components/navigation-bar'

export default function NavigationBarBasic() {
  return (
    <div className="h-80 overflow-y-auto rounded-4xl bg-grouped-background-1">
      <NavigationBar
        title="Settings"
        largeTitle
        leading={<NavigationBarBackButton onClick={() => {}} />}
        trailing={
          <Button variant="glass" shape="circle" aria-label="More">
            <Icon icon={MoreHorizontalCircle01Icon} />
          </Button>
        }
      >
        <List aria-label="Settings">
          <ListSection header="General">
            {['About', 'Software Update', 'AirDrop', 'AirPlay & Continuity', 'Picture in Picture', 'CarPlay', 'Accessibility', 'Keyboard'].map((t) => (
              <ListRow key={t} title={t} accessory="disclosure" onClick={() => {}} />
            ))}
          </ListSection>
        </List>
      </NavigationBar>
    </div>
  )
}

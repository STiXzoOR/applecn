import { Mail01Icon } from '@hugeicons/core-free-icons'

import { Empty, EmptyDescription, EmptyIcon, EmptyTitle } from '@apple-ds/ui/components/empty'
import { List, ListRow, ListSection } from '@apple-ds/ui/components/list'
import { Sidebar, SidebarGroup, SidebarItem } from '@apple-ds/ui/components/sidebar'
import { SplitView, SplitViewContent, SplitViewDetail, SplitViewSidebar } from '@apple-ds/ui/components/split-view'

export default function SplitViewBasic() {
  return (
    <SplitView columns={3} className="h-80 overflow-hidden rounded-4xl bg-background">
      <SplitViewSidebar>
        <Sidebar aria-label="Mailboxes" className="w-full">
          <SidebarGroup label="Mailboxes">
            <SidebarItem href="#" current>
              Inbox
            </SidebarItem>
            <SidebarItem href="#">Sent</SidebarItem>
          </SidebarGroup>
        </Sidebar>
      </SplitViewSidebar>
      <SplitViewContent>
        <List aria-label="Messages" style="plain">
          <ListSection>
            <ListRow title="Ada Lovelace" subtitle="Engine notes" href="#" />
            <ListRow title="Grace Hopper" subtitle="Compiler draft" href="#" />
          </ListSection>
        </List>
      </SplitViewContent>
      <SplitViewDetail className="hidden lg:block">
        <Empty className="h-full">
          <EmptyIcon icon={Mail01Icon} />
          <EmptyTitle>No Message Selected</EmptyTitle>
          <EmptyDescription>Select a message to read it here.</EmptyDescription>
        </Empty>
      </SplitViewDetail>
    </SplitView>
  )
}

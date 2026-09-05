"use client"

import {
  Delete02Icon,
  Folder01Icon,
  Note01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "@applecn/ui/components/sidebar"

export default function SidebarBasic() {
  return (
    <div className="h-80 overflow-hidden rounded-4xl bg-[linear-gradient(135deg,var(--system-yellow),var(--system-green))]">
      <Sidebar aria-label="Library">
        <SidebarHeader>Notes</SidebarHeader>
        <SidebarGroup label="Favorites">
          <SidebarItem icon={StarIcon} onClick={() => {}} current>
            Starred
          </SidebarItem>
          <SidebarItem icon={Note01Icon} onClick={() => {}}>
            All Notes
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup label="Folders" collapsible>
          <SidebarItem icon={Folder01Icon} onClick={() => {}}>
            Work
          </SidebarItem>
          <SidebarItem icon={Folder01Icon} onClick={() => {}}>
            Personal
          </SidebarItem>
          <SidebarItem icon={Delete02Icon} onClick={() => {}}>
            Recently Deleted
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}

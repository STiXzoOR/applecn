"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from "@applecn/ui/components/sidebar"
import { Text } from "@applecn/ui/components/text"

import {
  AppearanceMenu,
  PlatformSwitch,
} from "@/components/appearance-controls"
import { docsNav } from "@/lib/nav"

function Nav({ pathname }: { pathname: string }) {
  return (
    <>
      <SidebarHeader>
        <Link href="/" className="outline-none focus-visible:underline">
          applecn
        </Link>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarItem href="/docs" current={pathname === "/docs"}>
          Overview
        </SidebarItem>
      </SidebarGroup>
      {docsNav.map((group) => (
        <SidebarGroup key={group.title} label={group.title}>
          {group.items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              current={pathname === item.href}
            >
              {item.title}
            </SidebarItem>
          ))}
        </SidebarGroup>
      ))}
      <SidebarFooter>
        <Text variant="caption-1" color="label-3" className="px-2 py-2">
          Built on shadcn, Base UI and Hugeicons.
        </Text>
      </SidebarFooter>
    </>
  )
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <div className="grid min-h-dvh w-full grid-cols-1 bg-grouped-background-1 lg:grid-cols-[var(--split-view-sidebar-width)_1fr]">
        <Sidebar
          collapsible
          aria-label="Documentation"
          title="Browse"
          className="sticky top-0 h-dvh w-auto border-e-[0.5px] border-separator"
        >
          <Nav pathname={pathname} />
        </Sidebar>
        <div className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-30 flex h-(--nav-bar-height) items-center gap-2 material-thin px-4 shadow-hairline-b lg:px-8">
            <SidebarTrigger />
            <div className="flex-1" />
            <PlatformSwitch className="shrink-0" />
            <AppearanceMenu />
          </div>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

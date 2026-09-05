"use client"

import { Menu01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetToolbar,
  SheetTrigger,
} from "@applecn/ui/components/sheet"
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
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
    <div className="grid min-h-dvh grid-cols-1 bg-grouped-background-1 lg:grid-cols-[var(--split-view-sidebar-width)_1fr]">
      <Sidebar
        aria-label="Documentation"
        className="sticky top-0 hidden h-dvh w-auto border-e-[0.5px] border-separator lg:flex"
      >
        <Nav pathname={pathname} />
      </Sidebar>
      <div className="flex min-w-0 flex-col">
        <div className="sticky top-0 z-30 flex h-(--nav-bar-height) items-center gap-2 material-thin px-4 hairline-b lg:px-8">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="gray"
                  shape="circle"
                  size="small"
                  aria-label="Menu"
                  className="lg:hidden"
                />
              }
            >
              <Icon icon={Menu01Icon} />
            </SheetTrigger>
            <SheetContent>
              <SheetToolbar cancel={<SheetClose>Close</SheetClose>}>
                <SheetTitle>Browse</SheetTitle>
              </SheetToolbar>
              <Sidebar
                aria-label="Documentation"
                className="h-auto w-full [background-color:transparent] bg-transparent [backdrop-filter:none]"
              >
                <Nav pathname={pathname} />
              </Sidebar>
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
          <PlatformSwitch className="w-40" />
          <AppearanceMenu />
        </div>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

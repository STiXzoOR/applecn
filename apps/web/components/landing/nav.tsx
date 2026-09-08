"use client"

import { Menu01Icon } from "@hugeicons/core-free-icons"
import NextLink from "next/link"

import { Button } from "@applecn/ui/components/button"
import { Icon } from "@applecn/ui/components/icon"
import { List, ListRow } from "@applecn/ui/components/list"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerToolbar,
  DrawerTrigger,
} from "@applecn/ui/components/drawer"

import { AppearanceMenu } from "@/components/appearance-controls"
import { GITHUB_URL } from "@/lib/site"

const links = [
  { title: "Docs", href: "/docs" },
  { title: "Foundations", href: "/foundations/color" },
  { title: "Components", href: "/components/button" },
  { title: "GitHub", href: GITHUB_URL },
]

/**
 * apple.com's global nav, 44 pt on the regular material, with the wordmark at the leading edge.
 * apple.com hands its links to a sheet on a phone and so does this — four labels plus the
 * appearance button do not fit across 320–430 pt. The sheet holds an inset grouped list, the
 * way iOS presents a short menu; this is a navigation bar, not a sidebar.
 */
export function LandingNav() {
  return (
    <nav
      aria-label="Site"
      data-slot="landing-nav"
      className="sticky top-0 z-40 flex h-(--nav-bar-height) w-full items-center material-regular shadow-hairline-b"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-6">
        <NextLink
          href="/"
          className="type-callout font-semibold tracking-tight text-label outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          applecn
        </NextLink>
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
            {links.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 type-caption-1 text-label/80 transition-[color,background-color] duration-(--duration-nav) outline-none hover:bg-fill-4 hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60"
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {link.title}
              </NextLink>
            ))}
          </div>
          <AppearanceMenu />
          <Drawer>
            <DrawerTrigger
              render={
                <Button
                  variant="gray"
                  shape="circle"
                  size="small"
                  aria-label="Menu"
                  className="sm:hidden"
                />
              }
            >
              <Icon icon={Menu01Icon} />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerToolbar cancel={<DrawerClose>Close</DrawerClose>}>
                <DrawerTitle>Browse</DrawerTitle>
              </DrawerToolbar>
              <List aria-label="Site">
                {links.map((link) => (
                  <ListRow
                    key={link.href}
                    href={link.href}
                    title={link.title}
                    accessory="disclosure"
                  />
                ))}
              </List>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  )
}

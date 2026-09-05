"use client"

import {
  Home01Icon,
  Mail01Icon,
  Search01Icon,
  Share01Icon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import NextLink from "next/link"
import { cn } from "@applecn/ui/lib/utils"
import type { ReactNode } from "react"

import { Avatar, AvatarFallback } from "@applecn/ui/components/avatar"
import { Badge } from "@applecn/ui/components/badge"
import { Button } from "@applecn/ui/components/button"
import { Checkbox } from "@applecn/ui/components/checkbox"
import { Icon } from "@applecn/ui/components/icon"
import { Kbd } from "@applecn/ui/components/kbd"
import { Gauge, Meter } from "@applecn/ui/components/meter"
import { PageControl } from "@applecn/ui/components/page-control"
import { PasscodeField } from "@applecn/ui/components/passcode-field"
import { Progress } from "@applecn/ui/components/progress"
import { Rating } from "@applecn/ui/components/rating"
import { SearchField } from "@applecn/ui/components/search-field"
import { Slider } from "@applecn/ui/components/slider"
import { Switch } from "@applecn/ui/components/switch"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@applecn/ui/components/segmented-control"
import { Spinner } from "@applecn/ui/components/spinner"
import { Stepper } from "@applecn/ui/components/stepper"
import {
  TabBar,
  TabBarItem,
  TabBarSearch,
} from "@applecn/ui/components/tab-bar"
import { Text } from "@applecn/ui/components/text"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@applecn/ui/components/toggle-group"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSpacer,
} from "@applecn/ui/components/toolbar"

interface Tile {
  href: string
  title: string
  span?: "wide" | "tall"
  tint?: string
  children: ReactNode
}

const tiles: Tile[] = [
  {
    href: "/components/tab-bar",
    title: "Tab bar",
    span: "wide",
    tint: "linear-gradient(135deg, var(--system-mint), var(--system-indigo))",
    children: (
      <div className="relative h-32 w-full">
        <TabBar
          aria-label="Tabs"
          value="home"
          className="absolute inset-x-4 bottom-4"
        >
          <TabBarItem value="home" icon={Home01Icon} label="Home" />
          <TabBarItem value="inbox" icon={Mail01Icon} label="Inbox" badge={3} />
          <TabBarItem value="you" icon={UserIcon} label="You" />
          <TabBarSearch icon={Search01Icon} />
        </TabBar>
      </div>
    ),
  },
  {
    href: "/components/segmented-control",
    title: "Segmented control",
    children: (
      <SegmentedControl
        aria-label="Range"
        defaultValue="week"
        className="w-full"
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>
    ),
  },
  {
    href: "/components/meter",
    title: "Gauges",
    children: (
      <div className="flex items-center gap-4">
        <Gauge value={40} label="Move" color="red" size="small" />
        <Gauge value={72} label="Exercise" color="green" />
        <Gauge value={100} label="Stand" size="large" />
      </div>
    ),
  },
  {
    href: "/components/toolbar",
    title: "Toolbar",
    span: "wide",
    tint: "linear-gradient(135deg, var(--system-orange), var(--system-pink))",
    children: (
      <Toolbar aria-label="Document" className="w-full">
        <ToolbarButton icon={Share01Icon} aria-label="Share" />
        <ToolbarSpacer />
        <ToolbarGroup>
          <ToolbarButton icon={TextAlignLeftIcon} aria-label="Align left" />
          <ToolbarButton icon={TextAlignCenterIcon} aria-label="Align centre" />
          <ToolbarButton icon={TextAlignRightIcon} aria-label="Align right" />
        </ToolbarGroup>
        <ToolbarButton prominent icon={Tick02Icon} aria-label="Done" />
      </Toolbar>
    ),
  },
  {
    href: "/components/toggle-group",
    title: "Toggle group",
    children: (
      <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <Icon icon={TextAlignLeftIcon} weight="semibold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align centre">
          <Icon icon={TextAlignCenterIcon} weight="semibold" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <Icon icon={TextAlignRightIcon} weight="semibold" />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  {
    href: "/components/rating",
    title: "Rating",
    children: (
      <div className="flex items-center gap-3">
        <Rating value={4.5} label="Rating" size="large" />
        <Text variant="footnote" color="label-2">
          4.5 · 12K
        </Text>
      </div>
    ),
  },
  {
    href: "/components/search-field",
    title: "Search field",
    span: "wide",
    children: <SearchField aria-label="Search" showsCancelButton={false} />,
  },
  {
    href: "/components/stepper",
    title: "Stepper",
    children: <Stepper aria-label="Copies" defaultValue={1} />,
  },
  {
    href: "/components/progress",
    title: "Progress",
    children: (
      <div className="flex w-full flex-col gap-4">
        <Progress value={60} aria-label="Download" />
        <Meter value={82} label="Storage" color="orange" />
      </div>
    ),
  },
  {
    href: "/components/passcode-field",
    title: "Passcode field",
    span: "wide",
    children: <PasscodeField aria-label="Code" length={4} defaultValue="26" />,
  },
  {
    href: "/components/badge",
    title: "Badges",
    children: (
      <div className="flex items-center gap-2">
        <Badge>3</Badge>
        <Badge variant="tag">New</Badge>
        <Badge variant="filled">Pro</Badge>
      </div>
    ),
  },
  {
    href: "/components/avatar",
    title: "Avatars",
    children: (
      <div className="flex -space-x-2">
        {["AL", "BK", "CM"].map((initials, i) => (
          <Avatar
            key={initials}
            className={cn(
              "ring-2 ring-background",
              i === 1 && "bg-system-indigo",
              i === 2 && "bg-system-pink"
            )}
          >
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    ),
  },
  {
    href: "/components/page-control",
    title: "Page control",
    children: <PageControl count={5} index={1} />,
  },
  {
    href: "/components/spinner",
    title: "Spinner",
    children: (
      <div className="flex items-center gap-4">
        <Spinner />
        <Spinner size="large" />
      </div>
    ),
  },
  {
    href: "/components/switch",
    title: "Switch",
    children: (
      <div className="flex items-center gap-3">
        <Switch aria-label="Off" />
        <Switch aria-label="On" defaultChecked />
        <Switch aria-label="Tinted" color="tint" defaultChecked />
      </div>
    ),
  },
  {
    href: "/components/checkbox",
    title: "Checkbox",
    children: (
      <div className="flex items-center gap-4">
        <Checkbox aria-label="Unchecked" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox aria-label="Mixed" indeterminate />
      </div>
    ),
  },
  {
    href: "/components/slider",
    title: "Slider",
    children: <Slider aria-label="Volume" defaultValue={60} />,
  },
  {
    href: "/components/kbd",
    title: "Kbd",
    children: (
      <div className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>S</Kbd>
      </div>
    ),
  },
  {
    href: "/components/button",
    title: "Buttons",
    span: "wide",
    children: (
      <div className="flex flex-wrap items-center gap-2">
        <Button>Filled</Button>
        <Button variant="tinted">Tinted</Button>
        <Button variant="gray">Gray</Button>
        <Button variant="bordered">Bordered</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    ),
  },
]

/** A mosaic of live components, each tile a link to its page. Tiles vary in size on purpose. */
export function Mosaic() {
  return (
    <section
      data-slot="mosaic"
      aria-labelledby="mosaic-title"
      className="px-6 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <Text
            as="h2"
            id="mosaic-title"
            variant="title-1"
            emphasized
            className="text-balance"
          >
            Every component Apple ships, on Base UI.
          </Text>
          <Text variant="callout" color="label-2" className="text-pretty">
            Sixty-four primitives with shadcn conventions: data-slot on every
            element, cva variants, tests with axe, and a registry you can add
            from.
          </Text>
        </div>
        <ul className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {tiles.map((tile) => (
            <li
              key={tile.href}
              className={cn(
                "min-w-0",
                tile.span === "wide" && "col-span-2",
                tile.span === "tall" && "row-span-2"
              )}
            >
              <NextLink
                href={tile.href}
                className="group flex h-full flex-col overflow-hidden rounded-card bg-card text-label transition-[transform,box-shadow] duration-(--duration-hover) ease-(--ease-standard) outline-none hover:shadow-card-medium focus-visible:ring-4 focus-visible:ring-ring/60 motion-safe:hover:-translate-y-0.5"
                style={tile.tint ? { backgroundImage: tile.tint } : undefined}
              >
                <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                  {tile.children}
                </div>
                <span
                  className={cn(
                    "flex items-center justify-between px-4 pb-3 type-caption-1 font-semibold",
                    tile.tint ? "text-white" : "text-label-2"
                  )}
                >
                  {tile.title}
                  <span
                    aria-hidden="true"
                    className="opacity-0 transition-opacity duration-(--duration-press) group-hover:opacity-100"
                  >
                    ›
                  </span>
                </span>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

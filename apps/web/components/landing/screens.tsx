"use client"

import {
  Airplane01Icon,
  Bluetooth,
  ComputerIcon,
  Home01Icon,
  Mail01Icon,
  Moon02Icon,
  MoreHorizontalCircle01Icon,
  PaintBrush01Icon,
  Search01Icon,
  Share01Icon,
  Sun03Icon,
  TextFontIcon,
  UserIcon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons"
import { useState } from "react"

import { Button } from "@applecn/ui/components/button"
import { Checkbox } from "@applecn/ui/components/checkbox"
import { Icon } from "@applecn/ui/components/icon"
import { Label } from "@applecn/ui/components/label"
import { Link } from "@applecn/ui/components/link"
import { List, ListRow, ListSection } from "@applecn/ui/components/list"
import { Lockup } from "@applecn/ui/components/lockup"
import {
  NavigationBar,
  NavigationBarBackButton,
} from "@applecn/ui/components/navigation-bar"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@applecn/ui/components/navigation-menu"
import { Rating } from "@applecn/ui/components/rating"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@applecn/ui/components/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@applecn/ui/components/select"
import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "@applecn/ui/components/sidebar"
import { Slider } from "@applecn/ui/components/slider"
import { Stepper } from "@applecn/ui/components/stepper"
import { Switch } from "@applecn/ui/components/switch"
import {
  TabBar,
  TabBarItem,
  TabBarSearch,
} from "@applecn/ui/components/tab-bar"
import { Text } from "@applecn/ui/components/text"
import { Toolbar, ToolbarButton } from "@applecn/ui/components/toolbar"
import {
  Window,
  WindowContent,
  WindowTitleBar,
} from "@applecn/ui/components/window"

const tile = (from: string, to: string) =>
  `linear-gradient(135deg, var(--system-${from}), var(--system-${to}))`

/** iOS 26: a Settings-like screen with the large title, an inset grouped list and the floating tab bar. */
export function IosScreen() {
  const [tab, setTab] = useState("home")
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto pb-28">
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
            <ListSection header="Connectivity">
              <ListRow
                leading={
                  <span
                    className="flex size-full items-center justify-center rounded-md text-white"
                    style={{ backgroundImage: tile("orange", "orange") }}
                  >
                    <Icon icon={Airplane01Icon} />
                  </span>
                }
                title="Airplane Mode"
                trailing={<Switch aria-label="Airplane Mode" />}
              />
              <ListRow
                leading={
                  <span
                    className="flex size-full items-center justify-center rounded-md text-white"
                    style={{ backgroundImage: tile("blue", "blue") }}
                  >
                    <Icon icon={Wifi01Icon} />
                  </span>
                }
                title="Wi-Fi"
                value="Home"
                accessory="disclosure"
                onClick={() => {}}
              />
              <ListRow
                leading={
                  <span
                    className="flex size-full items-center justify-center rounded-md text-white"
                    style={{ backgroundImage: tile("blue", "indigo") }}
                  >
                    <Icon icon={Bluetooth} />
                  </span>
                }
                title="Bluetooth"
                value="On"
                accessory="disclosure"
                onClick={() => {}}
              />
            </ListSection>
            <ListSection header="Display & Brightness">
              <ListRow
                title="Appearance"
                trailing={
                  <SegmentedControl
                    aria-label="Appearance"
                    defaultValue="light"
                    className="w-40"
                  >
                    <SegmentedControlItem value="light">
                      <Icon icon={Sun03Icon} scale="small" /> Light
                    </SegmentedControlItem>
                    <SegmentedControlItem value="dark">
                      <Icon icon={Moon02Icon} scale="small" /> Dark
                    </SegmentedControlItem>
                  </SegmentedControl>
                }
              />
              <ListRow
                title="Text Size"
                subtitle={
                  <Slider
                    aria-label="Text size"
                    defaultValue={45}
                    minimumValueLabel={
                      <Icon icon={TextFontIcon} scale="small" />
                    }
                    maximumValueLabel={
                      <Icon icon={TextFontIcon} scale="large" />
                    }
                    className="mt-2 pe-2"
                  />
                }
              />
              <ListRow
                title="Bold Text"
                trailing={<Switch aria-label="Bold Text" defaultChecked />}
              />
            </ListSection>
          </List>
        </NavigationBar>
      </div>
      <TabBar
        aria-label="Sections"
        value={tab}
        onValueChange={setTab}
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

/** macOS 26: a window with the unified toolbar, a source-list sidebar and a grouped form. */
export function MacScreen() {
  return (
    <Window aria-label="System Settings" className="h-[520px]">
      <WindowTitleBar
        title="Appearance"
        toolbar
        trailing={
          <Toolbar aria-label="Window actions" className="min-h-0 px-0">
            <ToolbarButton icon={Search01Icon} aria-label="Search" />
            <ToolbarButton icon={Share01Icon} aria-label="Share" />
          </Toolbar>
        }
      />
      <WindowContent className="grid min-h-0 grid-cols-[var(--sidebar-width)_1fr]">
        <Sidebar aria-label="Settings" className="hairline-r">
          <SidebarHeader>Settings</SidebarHeader>
          <SidebarGroup>
            <SidebarItem icon={Wifi01Icon} onClick={() => {}}>
              Wi-Fi
            </SidebarItem>
            <SidebarItem icon={Bluetooth} onClick={() => {}}>
              Bluetooth
            </SidebarItem>
            <SidebarItem icon={PaintBrush01Icon} onClick={() => {}} current>
              Appearance
            </SidebarItem>
            <SidebarItem icon={ComputerIcon} onClick={() => {}}>
              Displays
            </SidebarItem>
          </SidebarGroup>
        </Sidebar>
        <div className="flex min-w-0 flex-col gap-5 overflow-y-auto bg-grouped-background-1 p-6">
          <List aria-label="Appearance" className="py-0">
            <ListSection>
              <ListRow
                title="Appearance"
                trailing={
                  <SegmentedControl
                    aria-label="Appearance"
                    defaultValue="auto"
                    className="w-56"
                  >
                    <SegmentedControlItem value="light">
                      Light
                    </SegmentedControlItem>
                    <SegmentedControlItem value="dark">
                      Dark
                    </SegmentedControlItem>
                    <SegmentedControlItem value="auto">
                      Auto
                    </SegmentedControlItem>
                  </SegmentedControl>
                }
              />
              <ListRow
                title="Accent colour"
                trailing={
                  <Select
                    defaultValue="blue"
                    items={{
                      blue: "Blue",
                      purple: "Purple",
                      graphite: "Graphite",
                    }}
                  >
                    <SelectTrigger variant="popup" aria-label="Accent colour">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="graphite">Graphite</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
              <ListRow
                title="Sidebar icon size"
                trailing={
                  <Stepper
                    aria-label="Sidebar icon size"
                    defaultValue={2}
                    min={1}
                    max={3}
                  />
                }
              />
              <ListRow
                title="Allow wallpaper tinting in windows"
                trailing={
                  <Switch aria-label="Wallpaper tinting" defaultChecked />
                }
              />
              <ListRow
                title="Show scroll bars"
                trailing={
                  <Label>
                    <Checkbox defaultChecked /> When scrolling
                  </Label>
                }
              />
            </ListSection>
          </List>
          <div className="flex justify-end gap-2">
            <Button variant="gray">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </WindowContent>
    </Window>
  )
}

/** The web: apple.com's global nav, a product headline with its links, and an App Store lockup. */
export function WebScreen() {
  return (
    <div className="flex flex-col bg-background text-label">
      <NavigationMenu aria-label="Global" className="h-11">
        <NavigationMenuList>
          {[
            "Store",
            "Mac",
            "iPad",
            "iPhone",
            "Watch",
            "Vision",
            "AirPods",
            "TV & Home",
            "Support",
          ].map((item) => (
            <NavigationMenuItem key={item}>
              <NavigationMenuLink href="#">{item}</NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-col items-center gap-3 bg-background-2 px-6 pt-12 pb-10 text-center">
        <Text as="h2" variant="large-title" emphasized>
          iPhone 17 Pro
        </Text>
        <Text variant="callout" color="label-2">
          All out Pro.
        </Text>
        <div className="mt-1 flex items-center gap-6">
          <Link href="#" chevron>
            Learn more
          </Link>
          <Link href="#" chevron>
            Buy
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="mt-4 h-40 w-full max-w-md rounded-card"
          style={{ backgroundImage: tile("indigo", "pink") }}
        />
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-8">
        <Lockup
          icon={
            <span
              className="flex size-full items-center justify-center text-white"
              style={{ backgroundImage: tile("teal", "blue") }}
            >
              <Icon icon={PaintBrush01Icon} scale="large" />
            </span>
          }
          title="Procreate Dreams"
          subtitle="Animation for everyone"
          description={
            <span className="flex items-center gap-2">
              <Rating value={4.5} label="Rating" size="small" />
              4.5 · 30K Ratings
            </span>
          }
          action={
            <Button variant="gray" size="small">
              Get
            </Button>
          }
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Buy</Button>
          <Button variant="bordered">Learn more</Button>
          <Button variant="gray" size="small">
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
}

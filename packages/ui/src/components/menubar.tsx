"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import type { ComponentProps } from "react"

import { Icon } from "./icon"
import { menuContentClassName, menuItemClassName } from "./menu"

/**
 * The menu bar (HIG › The menu bar): the row of an app's top-level menus — 24 pt on macOS 26,
 * with 13 pt titles that highlight with the accent while their menu is open — and, new in
 * iPadOS 26, on iPad. Each menu is the platform's `Menu`, so items, check marks, shortcuts and
 * submenus look the same in both places.
 */
function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-(--menu-bar-height) items-center gap-0.5 px-2 text-[length:var(--menu-font)] text-label",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />
}

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex h-[calc(var(--menu-bar-height)-4px)] items-center rounded-sm px-2.5 leading-none outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 data-popup-open:bg-selection data-popup-open:text-white data-disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          data-elevated=""
          className={cn(menuContentClassName, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenubarGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menubar-label"
      className={cn(
        "px-4 py-2 type-footnote text-label-2 macos:px-2.5 macos:py-1 macos:type-caption-1 macos:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-variant={variant}
      className={cn(menuItemClassName, className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-primary">
        <MenuPrimitive.CheckboxItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(
        "-mx-(--menu-padding) my-1 h-2 shrink-0 bg-fill-4 macos:mx-2 macos:my-1 macos:h-[0.5px] macos:bg-separator",
        className
      )}
      {...props}
    />
  )
}

function MenubarShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ms-auto ps-6 text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menubar-sub-trigger"
      className={cn(menuItemClassName, "data-popup-open:bg-fill-3", className)}
      {...props}
    >
      {children}
      <Icon
        icon={ArrowRight01Icon}
        weight="semibold"
        className="ms-auto text-label-3"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenubarSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 0,
  ...props
}: ComponentProps<typeof MenubarContent> &
  Pick<MenuPrimitive.Positioner.Props, "alignOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menubar-sub-content"
          data-elevated=""
          className={cn(menuContentClassName, props.className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}

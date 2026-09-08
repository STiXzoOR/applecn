"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * Menus (HIG › Menus, Pull-down buttons). iOS 26: a 250 pt glass panel of 44 pt rows with
 * glyphs at the leading edge, thick bands between groups, red destructive items, check marks
 * on selected items and chevrons on submenus. macOS 26: AppKit's 24 pt rows with 5 pt padding,
 * hairline separators and the accent highlight. On the web, a TV's 44 px rows in a 200 px
 * panel. All from the platform tokens; shared class strings feed `ContextMenu`.
 */
const menuContentClassName =
  "glass z-50 flex max-h-(--available-height) min-w-(--menu-width) origin-(--transform-origin) flex-col overflow-x-hidden overflow-y-auto rounded-menu p-(--menu-padding) text-label outline-none duration-(--duration-overlay) ease-(--ease-standard) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none"

const menuItemClassName =
  "group/menu-item relative flex h-(--menu-item-height) w-full shrink-0 cursor-default items-center gap-(--menu-item-gap) rounded-menu-item px-(--menu-item-px) text-[length:var(--menu-font)] text-label outline-hidden select-none focus:bg-(--menu-item-highlight-bg) focus:text-(--menu-item-highlight-text) data-highlighted:bg-(--menu-item-highlight-bg) data-highlighted:text-(--menu-item-highlight-text) data-highlighted:[&_[data-slot$=-shortcut]]:text-(--menu-shortcut-highlight-text) data-disabled:pointer-events-none data-disabled:opacity-40 data-[variant=destructive]:text-destructive focus:data-[variant=destructive]:text-(--menu-item-highlight-text-destructive) data-highlighted:data-[variant=destructive]:text-(--menu-item-highlight-text-destructive) [&_svg]:pointer-events-none [&_svg]:shrink-0"

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/** The portal the content already used, exposed under shadcn's name. */
function DropdownMenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          data-elevated=""
          className={cn(menuContentClassName, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  )
}

function DropdownMenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn(
        "px-(--menu-item-px) py-(--menu-label-py) text-[length:var(--menu-label-font-size)] leading-(--menu-label-leading) font-(--menu-label-weight) tracking-(--menu-label-tracking) text-label-2",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuItemProps = MenuPrimitive.Item.Props & {
  variant?: "default" | "destructive"
  /** A glyph at the leading edge. */
  icon?: IconSvgElement
}

function DropdownMenuItem({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(menuItemClassName, className)}
      {...props}
    >
      {icon ? <Icon icon={icon} data-slot="dropdown-menu-item-icon" /> : null}
      {children}
    </MenuPrimitive.Item>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span
        data-slot="dropdown-menu-checkbox-item-indicator"
        className="flex w-5 shrink-0 items-center justify-center text-primary"
      >
        <MenuPrimitive.CheckboxItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span
        data-slot="dropdown-menu-radio-item-indicator"
        className="flex w-5 shrink-0 items-center justify-center text-primary"
      >
        <MenuPrimitive.RadioItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "mx-(--menu-separator-mx) my-1 h-(--menu-separator-height) shrink-0 bg-(--menu-separator-bg)",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
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

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 0,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  menuContentClassName,
  menuItemClassName,
}
export type { DropdownMenuItemProps }

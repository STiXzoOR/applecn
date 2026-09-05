"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "cn"
import type { ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * Menus (HIG › Menus, Pull-down buttons). iOS 26: a 250 pt glass panel of 44 pt rows with
 * glyphs at the leading edge, thick bands between groups, red destructive items, check marks
 * on selected items and chevrons on submenus. macOS 26: AppKit's 24 pt rows with 5 pt padding,
 * hairline separators and the accent highlight. The web: TV's 44 px rows in a 200 px panel.
 * All from the platform tokens; shared class strings feed `ContextMenu`.
 */
const menuContentClassName =
  "glass z-50 flex max-h-(--available-height) min-w-(--menu-width) origin-(--transform-origin) flex-col overflow-x-hidden overflow-y-auto rounded-menu p-(--menu-padding) text-label shadow-glass outline-none duration-(--duration-overlay) ease-(--ease-standard) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none"

const menuItemClassName =
  "group/menu-item relative flex h-(--menu-item-height) w-full shrink-0 cursor-default items-center gap-3 rounded-menu-item px-4 text-[length:var(--menu-font)] text-label outline-hidden select-none focus:bg-fill-3 data-highlighted:bg-fill-3 data-disabled:pointer-events-none data-disabled:opacity-40 data-[variant=destructive]:text-destructive macos:gap-2 macos:px-2.5 macos:focus:bg-selection macos:focus:text-white macos:data-highlighted:bg-selection macos:data-highlighted:text-white macos:data-highlighted:[&_[data-slot=menu-shortcut]]:text-white/70 [&_svg]:pointer-events-none [&_svg]:shrink-0"

function Menu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />
}

function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />
}

function MenuContent({
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
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          data-elevated=""
          className={cn(menuContentClassName, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />
}

function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      className={cn(
        "px-4 py-2 type-footnote text-label-2 macos:px-2.5 macos:py-1 macos:type-caption-1 macos:font-semibold",
        className
      )}
      {...props}
    />
  )
}

type MenuItemProps = MenuPrimitive.Item.Props & {
  variant?: "default" | "destructive"
  /** A glyph at the leading edge. */
  icon?: IconSvgElement
}

function MenuItem({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-variant={variant}
      className={cn(menuItemClassName, className)}
      {...props}
    >
      {icon ? <Icon icon={icon} data-slot="menu-item-icon" /> : null}
      {children}
    </MenuPrimitive.Item>
  )
}

function MenuCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span
        data-slot="menu-checkbox-item-indicator"
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

function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />
}

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span
        data-slot="menu-radio-item-indicator"
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

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn(
        "-mx-(--menu-padding) my-1 h-2 shrink-0 bg-fill-4 macos:mx-2 macos:my-1 macos:h-[0.5px] macos:bg-separator",
        className
      )}
      {...props}
    />
  )
}

function MenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ms-auto text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}

function MenuSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
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

function MenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 0,
  ...props
}: ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  menuContentClassName,
  menuItemClassName,
}
export type { MenuItemProps }

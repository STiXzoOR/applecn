"use client"

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Icon } from "./icon"
import { menuContentClassName, menuItemClassName } from "./dropdown-menu"

/** Context menus (HIG › Menus): the same glass menu, opened by a secondary click or a long press. */
function ContextMenu(props: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger(props: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/** The portal the content already used, exposed under shadcn's name. */
function ContextMenuPortal(props: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuContent({
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Positioner className="isolate z-50 outline-none">
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          data-elevated=""
          className={cn(menuContentClassName, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPortal>
  )
}

function ContextMenuGroup(props: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuLabel({
  className,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      className={cn(
        "px-(--menu-item-px) py-(--menu-label-py) text-[length:var(--menu-label-font-size)] leading-(--menu-label-leading) font-(--menu-label-weight) tracking-(--menu-label-tracking) text-label-2",
        className
      )}
      {...props}
    />
  )
}

type ContextMenuItemProps = ContextMenuPrimitive.Item.Props & {
  variant?: "default" | "destructive"
  icon?: IconSvgElement
}

function ContextMenuItem({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-variant={variant}
      className={cn(menuItemClassName, className)}
      {...props}
    >
      {icon ? <Icon icon={icon} data-slot="context-menu-item-icon" /> : null}
      {children}
    </ContextMenuPrimitive.Item>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-primary">
        <ContextMenuPrimitive.CheckboxItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(
        "mx-(--menu-separator-mx) my-1 h-(--menu-separator-height) shrink-0 bg-(--menu-separator-bg)",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuRadioGroup(props: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.RadioItem.Props) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(menuItemClassName, "ps-2", className)}
      {...props}
    >
      <span
        data-slot="context-menu-radio-item-indicator"
        className="flex w-5 shrink-0 items-center justify-center text-primary"
      >
        <ContextMenuPrimitive.RadioItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto ps-6 text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSub(props: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  )
}

function ContextMenuSubTrigger({
  className,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(menuItemClassName, "data-popup-open:bg-fill-3", className)}
      {...props}
    >
      {children}
      <Icon
        icon={ArrowRight01Icon}
        weight="semibold"
        className="ms-auto text-label-3"
      />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align="start"
        alignOffset={-4}
        side="right"
        sideOffset={0}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-sub-content"
          data-elevated=""
          className={cn(menuContentClassName, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPortal>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
export type { ContextMenuItemProps }

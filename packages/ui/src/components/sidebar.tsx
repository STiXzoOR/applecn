"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

import { Icon } from "./icon"

/**
 * Sidebars (HIG › Sidebars): a navigation list on the regular material along the leading edge,
 * with labelled, optionally collapsible groups, tinted symbols and the current item filled.
 * Width, row height, corner and text size follow the platform (320/44/10 on iPad, AppKit's
 * 240/28/6 on macOS 26, Music's 260/34/8 on the web).
 */
function Sidebar({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar"
      className={cn(
        "flex h-full w-(--sidebar-width) shrink-0 flex-col gap-4 overflow-y-auto material-regular p-3 text-label",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("px-2 py-1 type-title-2 font-bold text-label", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-1", className)}
      {...props}
    />
  )
}

type SidebarGroupProps = ComponentProps<"div"> & {
  label?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

const groupLabelClassName =
  "flex w-full items-center justify-between px-2 pb-1 type-caption-1 font-semibold text-label-3 macos:text-label-2"

function SidebarGroup({
  className,
  label,
  collapsible = false,
  defaultOpen = true,
  children,
  ...props
}: SidebarGroupProps) {
  if (collapsible) {
    return (
      <CollapsiblePrimitive.Root
        defaultOpen={defaultOpen}
        data-slot="sidebar-group"
        className={cn("group/sidebar-group flex flex-col", className)}
      >
        <CollapsiblePrimitive.Trigger
          data-slot="sidebar-group-label"
          className={cn(
            groupLabelClassName,
            "rounded-md outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
          )}
        >
          {label}
          <Icon
            icon={ArrowDown01Icon}
            weight="semibold"
            className="transition-transform duration-(--duration-press) group-data-open/sidebar-group:rotate-180 motion-reduce:transition-none"
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Panel
          data-slot="sidebar-group-items"
          className="flex flex-col gap-0.5"
        >
          {children}
        </CollapsiblePrimitive.Panel>
      </CollapsiblePrimitive.Root>
    )
  }
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label ? (
        <div data-slot="sidebar-group-label" className={groupLabelClassName}>
          {label}
        </div>
      ) : null}
      <div data-slot="sidebar-group-items" className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  )
}

type SidebarItemProps = ComponentProps<"button"> & {
  icon?: IconSvgElement
  href?: string
  current?: boolean
}

function SidebarItem({
  className,
  icon,
  href,
  current = false,
  children,
  ...props
}: SidebarItemProps) {
  const itemClassName = cn(
    "flex h-(--sidebar-row-height) w-full items-center gap-2.5 rounded-sidebar px-2 text-start text-[length:var(--sidebar-font)] leading-none text-label outline-none select-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 aria-[current=page]:bg-fill-3 aria-[current=page]:font-medium aria-[current=true]:bg-fill-3 aria-[current=true]:font-medium macos:gap-2",
    className
  )
  const content = (
    <>
      {icon ? (
        <Icon
          icon={icon}
          data-slot="sidebar-item-icon"
          className="text-primary"
        />
      ) : null}
      <span className="truncate">{children}</span>
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        data-slot="sidebar-item"
        aria-current={current ? "page" : undefined}
        className={itemClassName}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      data-slot="sidebar-item"
      aria-current={current ? "true" : undefined}
      className={itemClassName}
      {...props}
    >
      {content}
    </button>
  )
}

export { Sidebar, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem }
export type { SidebarGroupProps, SidebarItemProps }

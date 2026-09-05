"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "cn"
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react"

import { Badge } from "./badge"
import { Icon } from "./icon"

/**
 * The iOS 26 tab bar (HIG › Tab bars): a Liquid Glass capsule floating 21 pt from the edges,
 * with a symbol and an 11 pt label per tab, the current tab tinted, a separate circular search
 * button at the trailing end, and a `minimized` state that keeps only the current tab.
 */
interface TabBarContextValue {
  value?: string
  onValueChange?: (value: string) => void
  minimized: boolean
}

const TabBarContext = createContext<TabBarContextValue>({ minimized: false })

type TabBarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  value?: string
  onValueChange?: (value: string) => void
  minimized?: boolean
}

function TabBar({
  className,
  value,
  onValueChange,
  minimized = false,
  children,
  ...props
}: TabBarProps) {
  const items: ReactNode[] = []
  const extras: ReactNode[] = []
  for (const child of Array.isArray(children) ? children : [children]) {
    if (
      child &&
      typeof child === "object" &&
      "type" in child &&
      child.type === TabBarSearch
    )
      extras.push(child)
    else if (child) items.push(child)
  }
  return (
    <TabBarContext.Provider value={{ value, onValueChange, minimized }}>
      <nav
        data-slot="tab-bar"
        data-minimized={minimized || undefined}
        className={cn(
          "fixed inset-x-(--tab-bar-inset) bottom-[max(var(--tab-bar-inset),env(safe-area-inset-bottom))] z-40 flex items-center justify-center gap-2",
          minimized && "justify-end",
          className
        )}
        {...props}
      >
        <div
          data-slot="tab-bar-capsule"
          className={cn(
            "flex h-(--tab-bar-height) items-stretch rounded-full glass px-2 transition-[width,padding] duration-(--duration-nav) ease-(--ease-nav)",
            minimized ? "flex-none px-4" : "flex-1 justify-around"
          )}
        >
          {items}
        </div>
        {extras}
      </nav>
    </TabBarContext.Provider>
  )
}

type TabBarItemProps = Omit<ComponentProps<"button">, "value"> & {
  value: string
  icon: IconSvgElement
  label: string
  href?: string
  badge?: ReactNode
}

function TabBarItem({
  className,
  value,
  icon,
  label,
  href,
  badge,
  onClick,
  ...props
}: TabBarItemProps) {
  const context = useContext(TabBarContext)
  const current = context.value === value
  const hidden = context.minimized && !current
  const itemClassName = cn(
    "relative flex min-w-11 flex-col items-center justify-center gap-0.5 rounded-full px-3 type-caption-2 font-medium text-label-2 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:text-primary aria-[current=true]:text-primary [&_svg]:size-6",
    className
  )
  const content = (
    <>
      <span
        data-slot="tab-bar-item-icon"
        className="relative flex items-center justify-center"
      >
        <Icon icon={icon} weight={current ? "semibold" : "regular"} />
        {badge !== undefined && badge !== null ? (
          <Badge className="absolute -end-2.5 -top-1.5">{badge}</Badge>
        ) : null}
      </span>
      <span data-slot="tab-bar-item-label">{label}</span>
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        data-slot="tab-bar-item"
        aria-current={current ? "page" : undefined}
        hidden={hidden}
        className={itemClassName}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      data-slot="tab-bar-item"
      aria-current={current ? "true" : undefined}
      hidden={hidden}
      className={itemClassName}
      onClick={(event) => {
        context.onValueChange?.(value)
        onClick?.(event)
      }}
      {...props}
    >
      {content}
    </button>
  )
}

type TabBarSearchProps = Omit<ComponentProps<"button">, "children"> & {
  icon: IconSvgElement
  href?: string
  label?: string
}

function TabBarSearch({
  className,
  icon,
  href,
  label = "Search",
  ...props
}: TabBarSearchProps) {
  const searchClassName = cn(
    "flex size-(--tab-bar-height) shrink-0 pressable items-center justify-center rounded-full glass text-label outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6",
    className
  )
  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        data-slot="tab-bar-search"
        className={searchClassName}
      >
        <Icon icon={icon} weight="semibold" />
      </a>
    )
  }
  return (
    <button
      type="button"
      aria-label={label}
      data-slot="tab-bar-search"
      className={searchClassName}
      {...props}
    >
      <Icon icon={icon} weight="semibold" />
    </button>
  )
}

export { TabBar, TabBarItem, TabBarSearch }
export type { TabBarItemProps, TabBarProps, TabBarSearchProps }

"use client"

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

import { useScrollCollapse } from "../hooks/use-scroll-collapse"
import { Icon } from "./icon"

/**
 * The navigation bar (HIG › Toolbars). iOS 26: a 54 pt row with 44 pt glass platters at either
 * end and, with `largeTitle`, the 34 pt title in a 52 pt band below it that collapses into the
 * row as content scrolls under (a scroll-edge effect appears on the row only then); on macOS
 * and the web the 52 and 44 pt bars. The back button is the circular glass platter with the
 * chevron alone.
 */
type NavigationBarProps = Omit<ComponentProps<"header">, "title"> & {
  title: ReactNode
  largeTitle?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

function NavigationBar({
  className,
  title,
  largeTitle = false,
  leading,
  trailing,
  children,
  ...props
}: NavigationBarProps) {
  const { ref, collapsed } = useScrollCollapse()
  const showLargeTitle = largeTitle && !collapsed
  return (
    <>
      <header
        data-slot="navigation-bar"
        data-collapsed={collapsed}
        className={cn("group/nav relative", className)}
        {...props}
      >
        <div
          data-slot="navigation-bar-row"
          className="sticky top-0 z-40 grid h-(--nav-bar-height) grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 transition-[background-color,box-shadow] duration-(--duration-nav) ease-(--ease-nav) group-data-[collapsed=true]/nav:material-thin group-data-[collapsed=true]/nav:hairline-b"
        >
          <div
            data-slot="navigation-bar-leading"
            className="flex items-center gap-2 justify-self-start"
          >
            {leading}
          </div>
          <div
            data-slot="navigation-bar-title"
            aria-hidden={showLargeTitle || undefined}
            className={cn(
              "min-w-0 truncate text-center text-[length:var(--nav-bar-title-font)] font-semibold text-label transition-opacity duration-(--duration-nav)",
              showLargeTitle ? "opacity-0" : "opacity-100"
            )}
          >
            {title}
          </div>
          <div
            data-slot="navigation-bar-trailing"
            className="flex items-center gap-2 justify-self-end"
          >
            {trailing}
          </div>
        </div>
        {largeTitle ? (
          <>
            <h1
              data-slot="navigation-bar-large-title"
              className="flex min-h-(--nav-bar-large-title) items-end truncate px-4 pb-2 type-large-title font-bold text-label"
            >
              {title}
            </h1>
            <div
              ref={ref}
              data-slot="navigation-bar-sentinel"
              aria-hidden="true"
              className="h-px"
            />
          </>
        ) : null}
      </header>
      {children}
    </>
  )
}

type NavigationBarBackButtonProps = Omit<
  ComponentProps<"button">,
  "children"
> & {
  href?: string
  label?: string
}

function NavigationBarBackButton({
  className,
  href,
  label = "Back",
  onClick,
  ...props
}: NavigationBarBackButtonProps) {
  const buttonClassName = cn(
    "flex size-(--nav-bar-item) pressable items-center justify-center rounded-full glass text-primary outline-none focus-visible:ring-4 focus-visible:ring-ring/60 macos:rounded-control web:rounded-control",
    className
  )
  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        data-slot="navigation-bar-back"
        className={buttonClassName}
      >
        <Icon icon={ArrowLeft01Icon} weight="semibold" scale="large" />
      </a>
    )
  }
  return (
    <button
      type="button"
      aria-label={label}
      data-slot="navigation-bar-back"
      className={buttonClassName}
      onClick={onClick}
      {...props}
    >
      <Icon icon={ArrowLeft01Icon} weight="semibold" scale="large" />
    </button>
  )
}

export { NavigationBar, NavigationBarBackButton }
export type { NavigationBarBackButtonProps, NavigationBarProps }

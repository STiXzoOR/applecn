"use client"

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"

import { Icon } from "./icon"

/**
 * apple.com's global navigation (research document §12): a 44 pt bar on the regular material
 * with 12 px links at 80 % opacity that brighten on hover, and flyout panels that drop from the
 * bar as a full-width curtain of large links under small eyebrows. Built on Base UI's
 * Navigation Menu: items with a `NavigationMenuContent` open a panel; plain items are links.
 */
type NavigationMenuProps = NavigationMenuPrimitive.Root.Props & {
  "aria-label"?: string
}

function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "relative z-40 flex h-(--nav-bar-height) w-full items-center material-regular px-4 text-label hairline-b",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          side="bottom"
          sideOffset={0}
          align="start"
          collisionPadding={0}
          className="isolate z-40 w-(--anchor-width) transition-[top,left,right,height] duration-(--duration-nav) ease-(--ease-nav)"
        >
          <NavigationMenuPrimitive.Popup
            data-slot="navigation-menu-popup"
            data-elevated=""
            className="relative w-screen overflow-hidden rounded-b-popover material-regular text-label shadow-dialog transition-[opacity,transform] duration-(--duration-nav) ease-(--ease-nav) outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
          >
            <NavigationMenuPrimitive.Viewport
              data-slot="navigation-menu-viewport"
              className="relative h-full w-full overflow-hidden"
            />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "mx-auto flex w-full max-w-5xl list-none items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: NavigationMenuPrimitive.Item.Props) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuLinkClassName =
  "inline-flex h-(--nav-bar-height) items-center gap-1 px-2 type-caption-1 text-label/80 transition-[color,opacity] duration-(--duration-nav) ease-(--ease-nav) outline-none hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:rounded-sm data-popup-open:text-label data-active:text-label"

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuLinkClassName, className)}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Icon
        render={
          <Icon
            icon={ArrowDown01Icon}
            scale="small"
            className="transition-transform duration-(--duration-nav) data-popup-open:rotate-180"
          />
        }
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 transition-[opacity,transform] duration-(--duration-nav) ease-(--ease-nav) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none sm:grid-cols-[2fr_1fr_1fr]",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(navigationMenuLinkClassName, className)}
      {...props}
    />
  )
}

/** A small eyebrow above a column of flyout links. */
function NavigationMenuEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="navigation-menu-eyebrow"
      className={cn("mb-3 type-caption-1 text-label-2", className)}
      {...props}
    />
  )
}

/** A large flyout link, as in apple.com's "Explore all Mac". */
function NavigationMenuFlyoutLink({
  className,
  prominent = false,
  ...props
}: NavigationMenuPrimitive.Link.Props & { prominent?: boolean }) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-flyout-link"
      className={cn(
        "block w-fit outline-none hover:opacity-70 focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-ring/60",
        prominent
          ? "py-1 type-title-3 font-semibold text-label"
          : "py-0.5 type-footnote font-semibold text-label",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuEyebrow,
  NavigationMenuFlyoutLink,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
}
export type { NavigationMenuProps }

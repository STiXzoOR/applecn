import {
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import { Children, isValidElement, type ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * A breadcrumb (HIG › Path controls; apple.com's breadcrumbs): the path to the current
 * location as links separated by chevrons, the current page last in the label colour. On
 * macOS it reads as the Finder's path bar.
 *
 * Two markups reach the same tree. shadcn's is explicit —
 * `<Breadcrumb><BreadcrumbList><BreadcrumbItem/><BreadcrumbSeparator/>…` — and applecn's is the
 * shorthand this component shipped with, items straight under the root with the separators
 * inferred. `Breadcrumb` tells them apart by looking for a `BreadcrumbList` among its children:
 * finding one, it renders exactly what it was given, so a shadcn user gets one `<ol>` and the
 * separators they wrote and no others. Finding none, it supplies the list and interleaves the
 * separators itself.
 */
function Breadcrumb({
  className,
  "aria-label": label = "Breadcrumb",
  children,
  ...props
}: ComponentProps<"nav">) {
  const items = Children.toArray(children)
  const composed = items.some(
    (child) => isValidElement(child) && child.type === BreadcrumbList
  )
  return (
    <nav
      data-slot="breadcrumb"
      aria-label={label}
      className={cn("min-w-0", className)}
      {...props}
    >
      {composed ? (
        children
      ) : (
        <BreadcrumbList>
          {items.map((item, index) =>
            index === 0 ? (
              item
            ) : (
              <BreadcrumbSeparatorGroup key={index}>
                {item}
              </BreadcrumbSeparatorGroup>
            )
          )}
        </BreadcrumbList>
      )}
    </nav>
  )
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1 type-footnote",
        className
      )}
      {...props}
    />
  )
}

/** A separator followed by the item, so separators only ever appear between items. */
function BreadcrumbSeparatorGroup({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSeparator />
      {children}
    </>
  )
}

function BreadcrumbSeparator({
  className,
  children,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("flex items-center text-label-3", className)}
      {...props}
    >
      {children ?? (
        <Icon icon={ArrowRight01Icon} scale="small" weight="semibold" />
      )}
    </li>
  )
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  children,
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-sm text-label-2 underline-offset-4 transition-[color] duration-(--duration-press) outline-none hover:text-label hover:underline focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-medium text-label", className)}
      {...props}
    />
  )
}

/** The elided middle of a long path — the Finder's own truncation, and shadcn's. */
function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex items-center justify-center text-label-3", className)}
      {...props}
    >
      <Icon icon={MoreHorizontalIcon} scale="small" weight="semibold" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { Children, type ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * A breadcrumb (HIG › Path controls; apple.com's breadcrumbs): the path to the current
 * location as links separated by chevrons, the current page last in the label colour. On
 * macOS it reads as the Finder's path bar.
 */
function Breadcrumb({
  className,
  "aria-label": label = "Breadcrumb",
  children,
  ...props
}: ComponentProps<"nav">) {
  const items = Children.toArray(children)
  return (
    <nav
      data-slot="breadcrumb"
      aria-label={label}
      className={cn("min-w-0", className)}
      {...props}
    >
      <ol
        data-slot="breadcrumb-list"
        className="flex flex-wrap items-center gap-1 type-footnote"
      >
        {items.map((item, index) =>
          index === 0 ? (
            item
          ) : (
            <BreadcrumbSeparatorGroup key={index}>
              {item}
            </BreadcrumbSeparatorGroup>
          )
        )}
      </ol>
    </nav>
  )
}

/** A separator followed by the item, so separators only ever appear between items. */
function BreadcrumbSeparatorGroup({ children }: { children: React.ReactNode }) {
  return (
    <>
      <li
        role="presentation"
        aria-hidden="true"
        data-slot="breadcrumb-separator"
        className="flex items-center text-label-3"
      >
        <Icon icon={ArrowRight01Icon} scale="small" weight="semibold" />
      </li>
      {children}
    </>
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

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage }

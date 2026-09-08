import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import type { VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { buttonVariants } from "./button"
import { Icon } from "./icon"

/**
 * Paged navigation (shadcn's Pagination). apple.com draws it as a row of small round buttons
 * with the current page filled, and Previous and Next at either end wearing a chevron — so each
 * page is `Button`'s small circular control, tinted when it is the one you are on and plain
 * when it is not, and the row is a landmark a screen reader can jump to.
 *
 * Every page is an anchor. shadcn routes its link through Base UI's `Button` with
 * `nativeButton={false}`, which stamps `role="button"` on the `<a>` and takes the pages out of
 * a screen reader's list of links inside a navigation landmark. applecn reads the same
 * `buttonVariants` onto the anchor instead: identical paint, identical props, link semantics
 * kept, and `aria-current="page"` marking the current one as it is meant to be used.
 */
function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = ComponentProps<"a"> &
  Pick<VariantProps<typeof buttonVariants>, "size" | "shape"> & {
    isActive?: boolean
  }

/**
 * One page. The default is the circle Apple gives a numeral; `shape="automatic"` widens it for
 * a worded end, which is what `PaginationPrevious` and `PaginationNext` do.
 */
function PaginationLink({
  className,
  isActive,
  size = "small",
  shape = "circle",
  ...props
}: PaginationLinkProps) {
  const variant = isActive ? "tinted" : "plain"
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(
        buttonVariants({ variant, size, shape }),
        "tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      shape="automatic"
      className={cn("gap-0.5", className)}
      {...props}
    >
      <Icon
        icon={ArrowLeft01Icon}
        weight="semibold"
        scale="small"
        className="rtl:rotate-180"
      />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      shape="automatic"
      className={cn("gap-0.5", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <Icon
        icon={ArrowRight01Icon}
        weight="semibold"
        scale="small"
        className="rtl:rotate-180"
      />
    </PaginationLink>
  )
}

/** The pages that were skipped, on the same footprint as a page so the row stays even. */
function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-(--control-height-small) items-center justify-center text-label-3",
        className
      )}
      {...props}
    >
      <Icon icon={MoreHorizontalIcon} weight="semibold" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
export type { PaginationLinkProps }

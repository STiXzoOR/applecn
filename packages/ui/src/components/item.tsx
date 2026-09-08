"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Separator } from "./separator"

/**
 * A row of content (shadcn's Item): media at the leading edge, a title and description,
 * actions trailing. Apple's list-row metrics — 52 pt rows with 15 × 16 pt padding on iOS 26,
 * AppKit's 28 pt with 4 × 10 on macOS, 44 pt on the web — come from the list tokens, so a row
 * matches the idiom without a per-platform class.
 *
 * `variant` and `size` are shadcn's, with shadcn's defaults. shadcn resolves them to classes its
 * own theme CSS defines; applecn resolves them to measured Apple values, and every one is a slot
 * that already existed — the grouped card's `--list-radius` and hairline for `outline`, the
 * quietest step of the fill ramp for `muted`, and for the smaller rows the type Apple already
 * measured one and two steps below a row's own (`--list-subtitle-font`, `--list-footer-font`) over
 * a proportion of its measured padding. **No token was added and no value changed.**
 *
 * The smaller sizes drop the height floor rather than inventing a shorter one: `default` is the
 * measured row and the only size with a metric behind it, so `sm` and `xs` let the padding decide
 * the height instead of asserting a number Apple has not published. A caller asking for `xs` is
 * asking for a row below the touch target on purpose.
 *
 * The default row's leading is the measured `--type-body-leading`, and it is written beside the
 * font size rather than in the cva's base because `cn` reads a Tailwind font-size utility as
 * setting line-height too: a `leading-*` in the base is dropped by every size variant's
 * `text-[length:…]`. That is what happened to the `leading-snug` written here on day one — it has
 * never applied, on any size, since the module was written.
 *
 * Restoring it as it stood would have been wrong anyway, and deleting it would have left the row's
 * line box borrowed. Measured in a browser on all three idioms, 2026-09-08:
 *
 * - The value is the row's own arithmetic. iOS 15 + 22 + 15 is exactly the 52 pt
 *   `--list-row-min-height`, so the row's content stands the row up rather than the floor
 *   clamping it. `leading-snug` is 1.375 × 17 = 23.375 px and a 53.375 pt row — close, and not
 *   measured. macOS (4 + 16 + 4 = 24 against a 28 pt floor) and the web (8 + 25 + 8 = 41 against
 *   44) are floor-driven either way; iOS is the case that proves it.
 * - Nothing moves where the row already sat. `globals.css` puts `type-body` on `body`, and
 *   `type-body`'s line-height IS `--type-body-leading`, so a row under it was inheriting the right
 *   number by luck: 52 / 28 / 44 at one line and 96 / 56 / 91 at two are identical before and
 *   after, at the default root size and at a 24 px one.
 * - What the class buys is the row no longer borrowing that number. Under an ancestor with a
 *   different text style — a `type-footnote` block, the probe used here — a two-line row measured
 *   84 / 47 / 76 px instead of 96 / 56 / 91, and 111 / 66.5 / 106 instead of 129 / 80 / 128.5 at a
 *   24 px root. A consumer who does not put `type-body` on their `body` gets the same drift for
 *   every row on the page.
 *
 * `sm` and `xs` are left with no leading of their own, exactly as they render today: Apple has
 * published no row at those heights, so there is no measured pairing for their type, and asserting
 * the body leading over a smaller font would be inventing one.
 */
const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center gap-2.5 px-(--list-row-padding-x) text-start text-label outline-none focus-visible:bg-fill-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "rounded-list border border-separator",
        muted: "rounded-list bg-fill-4",
      },
      size: {
        default:
          "min-h-(--list-row-min-height) py-(--list-row-padding-y) text-[length:var(--list-font)] leading-(--type-body-leading)",
        sm: "py-[calc(var(--list-row-padding-y)/2)] text-[length:var(--list-subtitle-font)]",
        xs: "py-[calc(var(--list-row-padding-y)/3)] text-[length:var(--list-footer-font)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * `render` is Base UI's polymorphism, which shadcn's `Item` takes too: a row becomes the link
 * or the button it needs to be without a wrapper around the row's own padding. `data-slot`,
 * `data-variant` and `data-size` are stamped by `useRender`'s state rather than written, exactly
 * as shadcn stamps them.
 */
function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn(itemVariants({ variant, size, className })) },
      props
    ),
    render,
    state: { slot: "item", variant, size },
  })
}

/**
 * The rows of one group, stacked. shadcn's group carries `role="list"` (`item.tsx:12` upstream);
 * applecn's does not, and this was re-verified against shadcn's source and axe on 2026-09-08
 * rather than inherited. `role="list"` requires `listitem` children, and neither project's `Item`
 * is one, so the role announces an empty list; worse, `ItemSeparator` is the sibling `ItemGroup`
 * exists to be used with, and both projects build it on the same Base UI `Separator`, which
 * renders `role="separator"` — a child `role="list"` forbids. With the role restored, axe fails
 * this module's own registry example on `aria-required-children`. The divergence is upstream's,
 * not a preference: a caller composing real list rows passes the role themselves, and Apple's own
 * `list` keeps its `ul`/`li`.
 */
function ItemGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-group"
      className={cn("group/item-group flex w-full flex-col", className)}
      {...props}
    />
  )
}

/**
 * The hairline between two rows — the `separator` primitive, inset past the row's padding as
 * Apple insets a list separator.
 */
function ItemSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      inset="leading"
      className={className}
      {...props}
    />
  )
}

/**
 * The leading well: the 30 pt icon tile of an iOS row by default, artwork with `image`.
 * shadcn's third variant, `icon`, is the same tile — Apple draws one leading well, sized by
 * `--list-icon-tile`, whatever it holds.
 */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "icon" | "image" }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex size-(--list-icon-tile) shrink-0 items-center justify-center rounded-md [&_svg]:pointer-events-none [&_svg]:size-[70%]",
        variant === "image" &&
          "overflow-hidden [&_img]:size-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

/** The title and description column, which takes the width the media and actions leave. */
function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("line-clamp-1 flex w-fit items-center", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-[length:var(--list-subtitle-font)] font-normal text-label-2 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/** The trailing controls — a switch, a value, a disclosure chevron. */
function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

/** A line above the row's content, spanning it. */
function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between text-[length:var(--list-subtitle-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

/** A line below it. */
function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between text-[length:var(--list-subtitle-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemVariants,
}

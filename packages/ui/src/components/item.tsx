"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Separator } from "./separator"

/**
 * A row of content (shadcn's Item): media at the leading edge, a title and description,
 * actions trailing. Apple's list-row metrics — 52 pt rows with 15 × 16 pt padding on iOS 26,
 * AppKit's 28 pt with 4 × 10 on macOS, 44 pt on the web — come from the list tokens, so a row
 * matches the idiom without a per-platform class.
 *
 * `render` is Base UI's polymorphism, which shadcn's `Item` takes too: a row becomes the link
 * or the button it needs to be without a wrapper around the row's own padding.
 */
function Item({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex min-h-(--list-row-min-height) w-full flex-wrap items-center gap-2.5 px-(--list-row-padding-x) py-(--list-row-padding-y) text-start text-[length:var(--list-font)] leading-snug text-label outline-none focus-visible:bg-fill-4",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "item" },
  })
}

/**
 * The rows of one group, stacked. shadcn's group carries `role="list"`; applecn's does not,
 * because neither project's `Item` is a `listitem` — a list role over rows that are not list
 * items announces an empty list, and Base UI's separator between them is a child the role does
 * not allow (axe's `aria-required-children`). A caller composing real list rows passes the role
 * itself; Apple's own `list` keeps its `ul`/`li`.
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
}

"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"

/**
 * A text field with affordances inside it (shadcn's InputGroup): a leading or trailing addon
 * holding a glyph, a label or a button, around an `Input` or a `Textarea`. Apple's combined
 * field is the same shape — the search capsule with its magnifier, the stepper capsule with
 * its − and + — so the group draws the field surface (`--text-field-height`, `rounded-field`,
 * the input hairline, fill and shadow) and the control inside it draws nothing.
 *
 * The whole capsule takes the focus ring, not the control: Apple lights the field, and the
 * addons are inside it.
 */
function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-(--text-field-height) w-full min-w-0 flex-wrap items-center gap-1.5 rounded-field border-(length:--input-border-width) border-(--input-border-color) bg-background-3 px-2 text-[length:var(--text-field-font)] text-label shadow-(--input-shadow) transition-[box-shadow,background-color] duration-(--duration-hover) outline-none focus-within:ring-4 focus-within:ring-ring/60 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/30 has-[>textarea]:h-auto has-[>textarea]:py-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * `align` is shadcn's: the two inline ends of the field, and the two block ends a textarea group
 * uses for a row of its own above or below the text. `block-*` is `w-full` and the group wraps,
 * which is what puts it on its own line.
 */
const inputGroupAddonVariants = cva(
  "flex cursor-text items-center justify-center gap-1.5 text-label-2 select-none [&_svg]:pointer-events-none",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
        "block-start": "order-first w-full justify-start",
        "block-end": "order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

/**
 * Clicking the addon puts the caret in the field, as clicking the magnifier in Apple's search
 * capsule does — unless the click landed on a button, which keeps its own press.
 */
function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event)
        if ((event.target as HTMLElement).closest("button")) return
        event.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

/**
 * shadcn's four in-field button sizes on Apple's control sizes. `xs`/`sm` are the mini and small
 * controls; the `icon-*` pair is the same height as a circle, which is the shape Apple gives a
 * button inside a field — the clear button in a search capsule is round. shadcn's own size name
 * still reaches the DOM as `data-size`, so a shadcn user's `[data-size=xs]` CSS selects.
 */
type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm"

const inputGroupButtonSizes = {
  xs: "mini",
  sm: "small",
  "icon-xs": "mini",
  "icon-sm": "small",
} as const satisfies Record<
  InputGroupButtonSize,
  ComponentProps<typeof Button>["size"]
>

/**
 * `variant` defaults to `plain` where shadcn's defaults to `ghost`: same intention — a button that
 * adds no surface of its own inside the field — under the name applecn's `Button` ships.
 */
function InputGroupButton({
  className,
  type = "button",
  variant = "plain",
  size = "xs",
  ...props
}: Omit<ComponentProps<typeof Button>, "size" | "type"> & {
  size?: InputGroupButtonSize
  type?: "button" | "submit" | "reset"
}) {
  return (
    <Button
      type={type}
      variant={variant}
      size={inputGroupButtonSizes[size]}
      shape={size.startsWith("icon-") ? "circle" : "automatic"}
      data-size={size}
      className={cn("shrink-0 shadow-none", className)}
      {...props}
    />
  )
}

/** A word inside the field — a prefix, a unit, a counter. shadcn stamps no slot on it. */
function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("flex items-center [&_svg]:pointer-events-none", className)}
      {...props}
    />
  )
}

/** The field's own control: `Input` in its `plain` variant, since the group is the surface. */
function InputGroupInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      variant="plain"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

/**
 * The same, multi-line. The group grows with it rather than holding the field height. The
 * textarea's own fill, hairline, shadow and padding are dropped by `cn`; its `rounded-field`
 * survives the merge — `cn` does not know applecn's named radii as border-radius utilities — and
 * is left rather than fought, because a radius on a transparent, borderless box paints nothing.
 */
function InputGroupTextarea({
  className,
  ...props
}: ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}

"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Buttons (HIG › Buttons). `variant` is the style — filled/prominent, tinted, gray, bordered,
 * plain, glass, glass-prominent, destructive, link — `size` one of the five control sizes, and
 * `shape` the outline. Every size reads its height, corner, padding and label size from the
 * platform tokens, so the same button is a 34 pt capsule on iOS 26, a 24 pt rounded rectangle
 * on macOS 26 (a capsule from the large size, as AppKit does) and apple.com's 36 px pill on the
 * web. `shape="automatic"` (the default) is that platform shape; `capsule`, `rounded` and
 * `circle` (icon-only) force one. Every button has a press state and dims to 40 % when
 * disabled.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 border border-transparent bg-clip-padding leading-none font-semibold whitespace-nowrap transition-[background-color,transform,opacity,box-shadow,color] duration-(--duration-press) ease-(--ease-standard) outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.97] active:opacity-80 disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 motion-reduce:active:scale-100 macos:font-normal macos:active:scale-100 web:font-normal web:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),black_8%)] macos:shadow-control web:hover:bg-[color-mix(in_srgb,var(--primary),white_6%)]",
        tinted: "bg-primary/15 text-primary hover:bg-primary/20",
        gray: "bg-fill-3 text-primary hover:bg-fill-2 macos:bg-background-3 macos:text-label macos:shadow-control macos:hover:bg-background-3 web:text-label web:hover:bg-fill-2",
        bordered:
          "border-border bg-transparent text-primary hover:bg-fill-4 macos:border-transparent macos:bg-background-3 macos:text-label macos:shadow-control web:border-label web:text-label web:hover:bg-label web:hover:text-background",
        plain: "bg-transparent text-primary hover:bg-fill-4",
        glass: "glass text-foreground",
        "glass-prominent": "glass-prominent",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/20",
        link: "bg-transparent text-link underline-offset-4 hover:underline",
      },
      size: {
        mini: "h-(--control-height-mini) gap-1 rounded-(--control-radius-mini) px-(--control-padding-x-mini) text-[length:var(--control-font-mini)]",
        small:
          "h-(--control-height-small) rounded-(--control-radius-small) px-(--control-padding-x-small) text-[length:var(--control-font-small)]",
        regular:
          "h-(--control-height-regular) rounded-(--control-radius-regular) px-(--control-padding-x-regular) text-[length:var(--control-font-regular)]",
        large:
          "h-(--control-height-large) rounded-(--control-radius-large) px-(--control-padding-x-large) text-[length:var(--control-font-large)]",
        xl: "h-(--control-height-xl) rounded-(--control-radius-xl) px-(--control-padding-x-xl) text-[length:var(--control-font-xl)]",
      },
      shape: {
        automatic: "",
        capsule: "rounded-full",
        rounded: "rounded-lg",
        circle: "aspect-square rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "regular",
      shape: "automatic",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({
  className,
  variant = "filled",
  size = "regular",
  shape = "automatic",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }

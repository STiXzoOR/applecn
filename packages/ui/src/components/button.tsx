"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Buttons (HIG › Buttons). `variant` is the style — filled/prominent, tinted, gray, bordered,
 * plain, glass, glass-prominent, destructive — `size` one of the five control sizes whose
 * heights come from the platform tokens, and `shape` capsule (text), rounded, or circle
 * (icon-only). Every button has a press state and dims to 40 % when disabled.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-[background-color,transform,opacity,box-shadow] duration-(--duration-press) ease-(--ease-standard) outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.97] active:opacity-80 disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),black_8%)]",
        tinted: "bg-primary/15 text-primary hover:bg-primary/20",
        gray: "bg-fill-3 text-primary hover:bg-fill-2",
        bordered: "border-border bg-transparent text-primary hover:bg-fill-4",
        plain: "bg-transparent text-primary hover:bg-fill-4",
        glass: "glass text-foreground",
        "glass-prominent": "glass-prominent",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/20",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        mini: "h-(--control-height-mini) gap-1 px-2.5 type-caption-1",
        small: "h-(--control-height-small) px-3 type-subheadline",
        regular: "h-(--control-height-regular) px-5 type-body",
        large: "h-(--control-height-large) px-6 type-body",
        xl: "h-(--control-height-xl) px-7 type-title-3",
      },
      shape: {
        capsule: "rounded-full",
        rounded: "rounded-lg",
        circle: "aspect-square rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "regular",
      shape: "capsule",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({
  className,
  variant = "filled",
  size = "regular",
  shape = "capsule",
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

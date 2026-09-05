import { HugeiconsIcon } from "@hugeicons/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * The one way an icon enters the system. Hugeicons stands in for SF Symbols with the same
 * sizing model: `scale` is relative to the surrounding text (SF Symbols are sized to the cap
 * height, so `medium` renders the glyph at 1.2 em to match a 1 em cap), and `weight` follows
 * the text weight through the stroke width. Decorative by default; pass `aria-label` to make
 * it an image with a name.
 */
const iconVariants = cva("pointer-events-none shrink-0", {
  variants: {
    scale: {
      small: "size-[0.85em]",
      medium: "size-[1.2em]",
      large: "size-[1.5em]",
    },
  },
  defaultVariants: {
    scale: "medium",
  },
})

const strokeWidths = {
  regular: 1.5,
  semibold: 2,
  bold: 2.5,
} as const

type IconWeight = keyof typeof strokeWidths

type IconProps = Omit<
  ComponentProps<typeof HugeiconsIcon>,
  "strokeWidth" | "size"
> &
  VariantProps<typeof iconVariants> & {
    weight?: IconWeight
  }

function Icon({
  className,
  scale = "medium",
  weight = "regular",
  "aria-label": label,
  ...props
}: IconProps) {
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true }
  return (
    <HugeiconsIcon
      data-slot="icon"
      data-scale={scale}
      strokeWidth={strokeWidths[weight]}
      className={cn(iconVariants({ scale }), className)}
      {...a11y}
      {...props}
    />
  )
}

export { Icon, iconVariants, strokeWidths }
export type { IconProps, IconWeight }

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * A link. `default` is the link colour that underlines on hover — apple.com's `#06c`, iOS's
 * tint — and `chevron` appends apple.com's trailing › for "Learn more ›". `button` renders the
 * link as a pill in the platform's regular button size; `quiet` keeps the label colour and
 * only underlines on hover, for links inside running text.
 */
const linkVariants = cva(
  "inline-flex items-center gap-0.5 outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-ring/60",
  {
    variants: {
      variant: {
        default: "text-link underline-offset-4 hover:underline",
        quiet: "text-label underline-offset-4 hover:underline",
        button:
          "h-(--control-height-regular) shrink-0 justify-center rounded-full bg-primary px-(--control-padding-x-regular) text-[length:var(--control-font-regular)] leading-none font-semibold text-primary-foreground transition-[background-color] duration-(--duration-press) hover:bg-[color-mix(in_srgb,var(--primary),black_8%)] hover:no-underline macos:font-normal web:font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type LinkProps = ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Append the trailing › (apple.com's "Learn more ›"). */
    chevron?: boolean
  }

function Link({
  className,
  variant = "default",
  chevron = false,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      data-slot="link"
      data-variant={variant}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    >
      {children}
      {chevron ? (
        <span data-slot="link-chevron" aria-hidden="true" className="ms-0.5">
          ›
        </span>
      ) : null}
    </a>
  )
}

export { Link, linkVariants }
export type { LinkProps }

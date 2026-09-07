import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

/**
 * A lockup (HIG › Lockups; the App Store's product row): an app icon on the icon mask, a
 * title, a subtitle and, at the trailing edge, the action — Get, Open, a price. `small` for
 * list rows, `medium` for cards, `large` for a product hero.
 */
const lockupVariants = cva("flex items-center gap-3", {
  variants: {
    size: {
      small: "",
      medium: "gap-4",
      large: "gap-5",
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

const iconSizes = {
  small: "size-12",
  medium: "size-16",
  large: "size-30",
}

type LockupProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof lockupVariants> & {
    icon: ReactNode
    title: ReactNode
    subtitle?: ReactNode
    /** Body text under the subtitle, for the large size. */
    description?: ReactNode
    action?: ReactNode
  }

function Lockup({
  className,
  size = "medium",
  icon,
  title,
  subtitle,
  description,
  action,
  ...props
}: LockupProps) {
  return (
    <div
      data-slot="lockup"
      data-size={size}
      className={cn(lockupVariants({ size }), className)}
      {...props}
    >
      <div
        data-slot="lockup-icon"
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-icon bg-fill-3 shadow-artwork [&>img]:size-full [&>img]:object-cover [&>svg]:size-1/2",
          iconSizes[size ?? "medium"]
        )}
      >
        {icon}
      </div>
      <div data-slot="lockup-text" className="flex min-w-0 flex-1 flex-col">
        <div
          data-slot="lockup-title"
          className={cn(
            "truncate text-label",
            size === "large" ? "type-title-2 font-bold" : "type-headline"
          )}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            data-slot="lockup-subtitle"
            className={cn(
              "truncate text-label-2",
              size === "large" ? "type-body" : "type-footnote"
            )}
          >
            {subtitle}
          </div>
        ) : null}
        {description ? (
          <div
            data-slot="lockup-description"
            className="mt-1 type-footnote text-label-2"
          >
            {description}
          </div>
        ) : null}
      </div>
      {action ? (
        <div data-slot="lockup-action" className="flex shrink-0 items-center">
          {action}
        </div>
      ) : null}
    </div>
  )
}

export { Lockup, lockupVariants }
export type { LockupProps }

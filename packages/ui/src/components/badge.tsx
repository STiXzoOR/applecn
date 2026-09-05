import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * Badges. `count` is the red capsule a tab bar or app icon wears for unread counts; `tag` and
 * `filled` are the tinted and solid capsules used for labels and status.
 */
const badgeVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap tabular-nums',
  {
    variants: {
      variant: {
        count: 'type-footnote h-(--badge-height) min-w-(--badge-min-width) bg-system-red px-1.5 font-medium text-white',
        tag: 'type-caption-1 h-(--badge-height) min-w-(--badge-min-width) bg-primary/15 px-2 font-semibold text-primary',
        filled:
          'type-caption-1 h-(--badge-height) min-w-(--badge-min-width) bg-primary px-2 font-semibold text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'count',
    },
  },
)

type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** Announce value changes to assistive technology. */
    live?: boolean
  }

function Badge({ className, variant = 'count', live = false, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }

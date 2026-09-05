import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** A redacted placeholder for content that is still loading; still under reduced motion. */
function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-fill-3 motion-reduce:animate-none', className)}
      {...props}
    />
  )
}

export { Skeleton }

import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** A keyboard key, as shown beside menu items and in help text. */
function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'type-caption-1 inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-fill-3 px-1.5 font-medium text-label-2',
        className,
      )}
      {...props}
    />
  )
}

export { Kbd }

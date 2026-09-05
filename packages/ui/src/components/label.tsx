'use client'

import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** A control's label (HIG › Labels): body text, never dimmed unless the control is disabled. */
function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'type-body flex items-center gap-2 text-label select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
        className,
      )}
      {...props}
    />
  )
}

export { Label }

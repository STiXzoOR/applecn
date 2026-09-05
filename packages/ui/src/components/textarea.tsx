import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** The text view (HIG › Text views): a multi-line field on the same surface as `Input`. */
function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'type-body flex field-sizing-content min-h-20 w-full resize-none rounded-lg bg-fill-3 px-3 py-2.5 text-label transition-[box-shadow,background-color] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

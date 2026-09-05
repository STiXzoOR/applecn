import { cn } from "cn"
import type { ComponentProps } from "react"

/** The text view (HIG › Text views): a multi-line field on the same bordered surface as `Input`. */
function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full resize-none rounded-field border-[0.5px] border-separator bg-background-3 px-2 py-2 text-[length:var(--text-field-font)] leading-normal text-label transition-[box-shadow,background-color] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-4 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 macos:shadow-control web:border web:border-label-4",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

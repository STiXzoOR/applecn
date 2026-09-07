import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/** The text view (HIG › Text views): a multi-line field on the same bordered surface as `Input`. */
function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full resize-none rounded-field border-(length:--textarea-border-width) border-(--textarea-border-color) bg-background-3 px-2 py-2 text-[length:var(--text-field-font)] leading-normal text-label shadow-(--textarea-shadow) transition-[box-shadow,background-color] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-4 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

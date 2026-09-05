import { cn } from "cn"
import type { ComponentProps } from "react"

import { Icon, type IconProps } from "./icon"

/**
 * The unavailable-content view (SwiftUI `ContentUnavailableView`): a large symbol, a bold
 * title, a secondary description and, optionally, an action, centred in the empty space.
 */
function Empty({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-balance",
        className
      )}
      {...props}
    />
  )
}

function EmptyIcon({ className, ...props }: IconProps) {
  return (
    <span
      data-slot="empty-icon"
      className="mb-2 flex items-center justify-center text-label-3"
    >
      <Icon scale="large" className={cn("size-12", className)} {...props} />
    </span>
  )
}

function EmptyTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="empty-title"
      className={cn("type-title-2 font-bold text-label", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("max-w-sm type-body text-label-2", className)}
      {...props}
    />
  )
}

function EmptyActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-actions"
      className={cn("mt-2 flex items-center gap-2", className)}
      {...props}
    />
  )
}

export { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle }

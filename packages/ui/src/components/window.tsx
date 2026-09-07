import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

import { PlatformProvider } from "../lib/platform"

/**
 * A macOS 26 window (HIG › Windows): 16 pt corners, the dialog shadow, a 32 pt title bar with
 * the 14 pt close, minimise and zoom lights at the leading edge — or, with `toolbar`, the
 * 52 pt unified title and toolbar with items on either side of the title. For framing
 * examples and marketing pages; the content area is yours. A window is a macOS thing, so it
 * sets the macOS idiom for everything inside it whatever the page's platform.
 */
function Window({
  className,
  "aria-label": label = "Window",
  ...props
}: ComponentProps<"section">) {
  return (
    <PlatformProvider platform="macos">
      <section
        data-slot="window"
        aria-label={label}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-window bg-background text-label shadow-dialog",
          className
        )}
        {...props}
      />
    </PlatformProvider>
  )
}

const lights = [
  ["close", "bg-system-red"],
  ["minimise", "bg-system-yellow"],
  ["zoom", "bg-system-green"],
] as const

type WindowTitleBarProps = Omit<ComponentProps<"header">, "title"> & {
  title?: ReactNode
  /** The unified title-and-toolbar bar (52 pt) rather than the plain 32 pt title bar. */
  toolbar?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

function WindowTitleBar({
  className,
  title,
  toolbar = false,
  leading,
  trailing,
  ...props
}: WindowTitleBarProps) {
  return (
    <header
      data-slot="window-title-bar"
      data-toolbar={toolbar || undefined}
      className={cn(
        "grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 bg-background-2 px-3 hairline-b",
        toolbar ? "h-(--toolbar-height)" : "h-(--window-title-bar)",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 justify-self-start">
        <div
          data-slot="window-traffic-lights"
          className="flex items-center gap-2"
          aria-hidden="true"
        >
          {lights.map(([name, color]) => (
            <span
              key={name}
              data-slot="window-traffic-light"
              data-light={name}
              className={cn(
                "block size-(--window-traffic-light) rounded-full",
                color
              )}
            />
          ))}
        </div>
        {leading}
      </div>
      <div
        data-slot="window-title"
        className="min-w-0 truncate text-center text-[length:var(--nav-bar-title-font)] font-semibold text-label"
      >
        {title}
      </div>
      <div className="flex items-center gap-2 justify-self-end">{trailing}</div>
    </header>
  )
}

function WindowContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="window-content"
      className={cn("min-h-0 flex-1", className)}
      {...props}
    />
  )
}

export { Window, WindowContent, WindowTitleBar }
export type { WindowTitleBarProps }

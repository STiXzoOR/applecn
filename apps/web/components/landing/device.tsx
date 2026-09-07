import { cn } from "@applecn/ui/lib/utils"
import type { ComponentProps, ReactNode } from "react"

/**
 * Frames for the showcase: an iPhone bezel, a macOS window shell and a browser tab. Each is a
 * labelled figure; `fixed` children (the tab bar) position against the screen because it
 * establishes a containing block.
 */
export function IPhoneFrame({
  className,
  children,
  ...props
}: ComponentProps<"figure">) {
  return (
    <figure
      aria-label="iPhone"
      data-slot="iphone-frame"
      className={cn(
        "relative mx-auto w-[360px] max-w-full shrink-0 rounded-[3.4rem] bg-black p-[10px] shadow-dialog",
        className
      )}
      {...props}
    >
      <div
        data-slot="iphone-screen"
        className="relative flex h-[720px] [transform:translateZ(0)] flex-col overflow-hidden rounded-[2.8rem] bg-grouped-background-1 text-label"
      >
        <div
          aria-hidden="true"
          className="absolute top-3 left-1/2 z-50 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black"
        />
        <div
          aria-hidden="true"
          className="flex h-14 shrink-0 items-end justify-between px-8 pb-1 type-subheadline font-semibold"
        >
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-4 rounded-[2px] bg-label" />
          </span>
        </div>
        {children}
      </div>
    </figure>
  )
}

export function MacFrame({
  className,
  children,
  ...props
}: ComponentProps<"figure">) {
  return (
    <figure
      aria-label="Mac"
      data-slot="mac-frame"
      className={cn("mx-auto w-full max-w-4xl shrink-0", className)}
      {...props}
    >
      {children}
    </figure>
  )
}

export function BrowserFrame({
  className,
  url = "apple.com",
  children,
  ...props
}: ComponentProps<"figure"> & { url?: string }) {
  return (
    <figure
      aria-label="Browser"
      data-slot="browser-frame"
      className={cn(
        "mx-auto flex w-full max-w-4xl shrink-0 flex-col overflow-hidden rounded-window bg-background shadow-dialog",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="flex h-11 shrink-0 items-center gap-3 bg-background-2 px-4 hairline-b"
      >
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-system-red" />
          <span className="size-3 rounded-full bg-system-yellow" />
          <span className="size-3 rounded-full bg-system-green" />
        </span>
        <span className="mx-auto flex h-7 w-72 max-w-full items-center justify-center rounded-md bg-fill-3 type-caption-1 text-label-2">
          {url}
        </span>
      </div>
      <div data-slot="browser-page" className="relative">
        {children}
      </div>
    </figure>
  )
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="relative h-full">{children}</div>
}

import type { ReactNode } from "react"

/** The frame every live example renders in: the grouped ground, so cards and lists read as they do in an app. */
export function Preview({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="preview"
      className="flex min-h-40 items-center justify-center overflow-hidden rounded-4xl bg-background p-6 hairline"
    >
      <div className="w-full">{children}</div>
    </div>
  )
}

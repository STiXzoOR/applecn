import { cn } from "../lib/utils"
import type { ComponentProps, CSSProperties } from "react"

/**
 * A box that holds a ratio open while its content loads (shadcn's AspectRatio). Apple's artwork
 * is published at fixed ratios — the App Store's 16:9 hero, Music's square album art, the 4:3
 * screenshot — and this is the frame that reserves the space for one so nothing reflows when the
 * image arrives.
 *
 * It is a layout utility and draws nothing: no surface, no corner, no clipping. Wrap it or style
 * it through `className` for those, exactly as in shadcn.
 */
function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ "--ratio": ratio, ...style } as CSSProperties}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }

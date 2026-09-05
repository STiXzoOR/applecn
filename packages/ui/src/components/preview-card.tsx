"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "cn"

/**
 * A preview card: the Safari link preview. Hovering a link for a moment shows a Liquid Glass
 * card on the platform's popover corner with a look at the destination; it closes as the
 * pointer leaves. Links stay links for the keyboard and assistive technology.
 */
function PreviewCard(props: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />
}

function PreviewCardTrigger({
  className,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="preview-card-trigger"
      className={cn(
        "text-link underline-offset-4 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    />
  )
}

function PreviewCardContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="preview-card-content"
          data-elevated=""
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-3 overflow-hidden rounded-popover glass p-4 text-label shadow-glass outline-hidden duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { PreviewCard, PreviewCardContent, PreviewCardTrigger }

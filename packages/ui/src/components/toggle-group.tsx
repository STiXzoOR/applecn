"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"

import { cn } from "../lib/utils"

/**
 * The segmented surface itself — the track, the pill and a segment — exported because `tabs`
 * draws the same one and §4.4 named these class strings the catalogue's only true duplication.
 * The fold in §5.3 removed the FILE; keeping a second copy of the strings here and in `tabs.tsx`
 * would only have moved the duplication, and within the same phase the two copies had already
 * drifted. So this is the single source, read the way `drawer` reads `dialogPopupClassName`.
 *
 * What each surface adds on top is what genuinely differs, and only that: `Tabs` spans its
 * container (`w-full`) and keys its item off `data-active`, a `ToggleGroup` hugs its content and
 * keys off `data-pressed`; the two indicators carry different position variables because each
 * measures its own segment. The paint is `--toggle-group-pressed-*` for both — the same three
 * slots the deleted `--segmented-control-*` family held, at the same values.
 */
const segmentedTrackClassName =
  "relative inline-flex h-(--segmented-height) items-stretch rounded-segmented bg-fill-3 p-(--segmented-inset)"

const segmentedIndicatorClassName =
  "absolute top-(--segmented-inset) bottom-(--segmented-inset) left-0 rounded-[calc(var(--radius-segmented)-var(--segmented-inset))] bg-(--toggle-group-pressed-bg) shadow-(--toggle-group-pressed-shadow) transition-[translate,width] duration-(--duration-overlay) ease-(--ease-standard) motion-reduce:transition-none"

/**
 * A segment is never narrower than it is tall, which is what a segmented control looks like on
 * both surfaces — an icon-only segment stays square rather than collapsing to its glyph. That is
 * the one place the two copies had diverged (`tabs` wrote `min-w-0`), resolved here rather than
 * left to whichever file a reader opens first.
 */
const segmentedItemClassName =
  "relative z-10 inline-flex min-w-(--segmented-height) flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-[calc(var(--radius-segmented)-var(--segmented-inset))] px-3 text-[length:var(--segmented-font)] leading-none font-medium whitespace-nowrap text-label transition-[background-color,box-shadow,color] duration-(--duration-press) ease-(--ease-standard) outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0"

/**
 * A toggle group (HIG › Segmented controls): a joined set of toggle buttons on the fill —
 * Photos' Day/Week/Month, Keynote's bold/italic/underline — single-select by default, or
 * `multiple`. It carries the platform's height and corner, and a white pill with the segment
 * shadow on iOS and the web, the accent fill on macOS.
 *
 * A single selection is drawn the way iOS draws it: one pill that SLIDES to the pressed segment
 * rather than a background that blinks on and off each item. This is what `segmented-control`
 * used to own before spec §5.3 folded it in here; it drew the slide with Base UI's
 * `Tabs.Indicator`, which is a Tabs child and cannot live under a `role="group"`, so the pill is
 * measured here instead. A `multiple` group has no single pressed segment for one pill to stand
 * on, so it paints each pressed segment instead — the two are mutually exclusive by construction.
 */

type ToggleGroupProps = ToggleGroupPrimitive.Props & {
  "aria-label"?: string
}

function ToggleGroup({ className, children, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn("group/toggle-group", segmentedTrackClassName, className)}
      {...props}
    >
      <ToggleGroupIndicator />
      {children}
    </ToggleGroupPrimitive>
  )
}

/**
 * Reading layout before the browser paints keeps the pill from starting at the left edge and
 * jumping; on the server there is no layout to read and `useLayoutEffect` only warns.
 */
const useMeasure = typeof document === "undefined" ? useEffect : useLayoutEffect

interface Segment {
  readonly left: number
  readonly width: number
}

/**
 * The pill. It finds its own track — its parent — rather than taking a ref from the group, so the
 * group passes a consumer's ref straight through to Base UI. What it follows is the DOM: a
 * `MutationObserver` for the pressed segment changing, a `ResizeObserver` for the track being
 * resized under it. Neither the group's value nor a re-render reaches here — Base UI holds the
 * value inside its own root, and this element is a stable child of it.
 */
function ToggleGroupIndicator() {
  const ref = useRef<HTMLSpanElement>(null)
  const [segment, setSegment] = useState<Segment | null>(null)

  useMeasure(() => {
    const track = ref.current?.parentElement
    if (!track) return undefined

    const measure = () => {
      // `data-multiple` is Base UI's; a group that allows several pressed segments is painting
      // them itself, and one pill placed on any of them would read as the only selection.
      const pressed = track.hasAttribute("data-multiple")
        ? []
        : track.querySelectorAll<HTMLElement>(
            '[data-slot="toggle-group-item"][data-pressed]'
          )
      const item = pressed.length === 1 ? pressed[0]! : null
      const next =
        item && item.offsetWidth > 0
          ? { left: item.offsetLeft, width: item.offsetWidth }
          : null
      setSegment((current) =>
        current?.left === next?.left && current?.width === next?.width
          ? current
          : next
      )
    }

    measure()
    const selection = new MutationObserver(measure)
    selection.observe(track, {
      attributeFilter: ["data-pressed", "data-multiple"],
      attributes: true,
      childList: true,
      subtree: true,
    })
    const resized =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure)
    resized?.observe(track)
    return () => {
      selection.disconnect()
      resized?.disconnect()
    }
  }, [])

  return (
    <span
      ref={ref}
      role="presentation"
      data-slot="toggle-group-indicator"
      hidden={!segment}
      style={
        segment
          ? ({
              "--active-toggle-left": `${segment.left}px`,
              "--active-toggle-width": `${segment.width}px`,
            } as CSSProperties)
          : undefined
      }
      className={cn(
        segmentedIndicatorClassName,
        "w-(--active-toggle-width) translate-x-(--active-toggle-left)"
      )}
    />
  )
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        segmentedItemClassName,
        "data-pressed:font-semibold data-pressed:text-(--toggle-group-pressed-text) group-data-multiple/toggle-group:data-pressed:bg-(--toggle-group-pressed-bg) group-data-multiple/toggle-group:data-pressed:shadow-(--toggle-group-pressed-shadow)",
        className
      )}
      {...props}
    />
  )
}

export {
  segmentedIndicatorClassName,
  segmentedItemClassName,
  segmentedTrackClassName,
  ToggleGroup,
  ToggleGroupItem,
}
export type { ToggleGroupProps }

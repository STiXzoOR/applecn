"use client"

import { cn } from "cn"
import { useEffect, useRef, useState, type ComponentProps } from "react"

import { PageControl } from "./page-control"

/**
 * A carousel (HIG › Collections; the App Store's shelves and apple.com's galleries): a
 * horizontally scrolling, snapping row of items with a page control beneath. Scrolling is
 * native — momentum, the trackpad, touch — and the page control follows the scroll position
 * and moves it on request.
 */
type CarouselProps = ComponentProps<"section"> & {
  /** How many pages the control shows; defaults to the number of items. */
  pages?: number
  "aria-label": string
  /** Hide the page control. */
  hidePageControl?: boolean
}

function Carousel({
  className,
  pages,
  hidePageControl = false,
  children,
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count =
    pages ?? (Array.isArray(children) ? children.filter(Boolean).length : 1)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const onScroll = () => {
      const items = track.querySelectorAll<HTMLElement>(
        '[data-slot="carousel-item"]'
      )
      if (items.length === 0) return
      const perPage = Math.max(1, Math.round(items.length / count))
      const first = items[0]!
      const pitch =
        (items[1]?.offsetLeft ?? first.offsetWidth) - first.offsetLeft
      const item = pitch > 0 ? Math.round(track.scrollLeft / pitch) : 0
      setIndex(Math.max(0, Math.min(count - 1, Math.floor(item / perPage))))
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => track.removeEventListener("scroll", onScroll)
  }, [count])

  const goTo = (next: number) => {
    const track = trackRef.current
    if (!track) return
    const items = track.querySelectorAll<HTMLElement>(
      '[data-slot="carousel-item"]'
    )
    const perPage = Math.max(1, Math.round(items.length / count))
    const target = items[Math.min(items.length - 1, next * perPage)]
    if (!target) return
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    })
    setIndex(next)
  }

  return (
    <section
      data-slot="carousel"
      className={cn("flex flex-col items-center gap-3", className)}
      {...props}
    >
      <div
        ref={trackRef}
        data-slot="carousel-track"
        className="flex w-full snap-x snap-mandatory [scrollbar-width:none] gap-(--list-inset) overflow-x-auto scroll-smooth px-(--list-inset) [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {!hidePageControl && count > 1 ? (
        <PageControl count={count} index={index} onIndexChange={goTo} />
      ) : null}
    </section>
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-item"
      className={cn("shrink-0 snap-start", className)}
      {...props}
    />
  )
}

export { Carousel, CarouselItem }
export type { CarouselProps }

"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"

import { Button } from "./button"
import { Icon } from "./icon"
import { PageControl } from "./page-control"

/**
 * A carousel (HIG › Collections; the App Store's shelves and apple.com's galleries): a
 * horizontally scrolling, snapping row of items with a page control beneath. Scrolling is
 * native — momentum, the trackpad, touch — and the page control follows the scroll position
 * and moves it on request.
 *
 * Two markups reach the same tree. shadcn's is explicit, the track written out as
 * `CarouselContent`; applecn's is the shorthand this component shipped with, items straight
 * under the root. `Carousel` tells them apart by looking for a `CarouselContent` among its
 * children and, finding none, supplies the track itself — keeping `CarouselPrevious` and
 * `CarouselNext` out of it, since an arrow is not a slide.
 */
interface CarouselState {
  /** The scroller. `CarouselContent` takes it; shadcn calls the same thing `carouselRef`. */
  readonly trackRef: React.RefObject<HTMLDivElement | null>
  readonly orientation: "horizontal"
  /** The page currently under the scroller, and how many there are. */
  readonly index: number
  readonly count: number
  readonly goTo: (index: number) => void
  readonly scrollPrev: () => void
  readonly scrollNext: () => void
  readonly canScrollPrev: boolean
  readonly canScrollNext: boolean
}

const CarouselContext = createContext<CarouselState | null>(null)

/**
 * The scroller and where it has got to. shadcn's returns embla's `api` and `opts` beside these;
 * applecn's carousel scrolls natively and takes no carousel library, so it has neither, and adds
 * `index`, `count` and `goTo` — the page control's own vocabulary.
 */
function useCarousel(): CarouselState {
  const state = useContext(CarouselContext)
  if (!state) throw new Error("useCarousel must be used within a <Carousel />")
  return state
}

type CarouselProps = ComponentProps<"section"> & {
  /** How many pages the control shows; defaults to the number of items. */
  pages?: number
  "aria-label": string
  /** Hide the page control. */
  hidePageControl?: boolean
}

const isElementOf = (child: ReactNode, ...types: unknown[]) =>
  isValidElement(child) && types.includes(child.type)

function Carousel({
  className,
  pages,
  hidePageControl = false,
  children,
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const given = Children.toArray(children)
  const content = given.find((child) => isElementOf(child, CarouselContent)) as
    | ReactElement<{ children?: ReactNode }>
    | undefined
  const arrows = given.filter((child) =>
    isElementOf(child, CarouselPrevious, CarouselNext)
  )
  const slides = content
    ? Children.toArray(content.props.children)
    : given.filter(
        (child) => !isElementOf(child, CarouselPrevious, CarouselNext)
      )
  const count =
    pages ?? Math.max(1, slides.filter((child) => Boolean(child)).length)

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

  const state = useMemo<CarouselState>(() => {
    const goTo = (next: number) => {
      const track = trackRef.current
      if (!track) return
      const items = track.querySelectorAll<HTMLElement>(
        '[data-slot="carousel-item"]'
      )
      const perPage = Math.max(1, Math.round(items.length / count))
      const target = items[Math.min(items.length - 1, next * perPage)]
      if (!target) return
      track.scrollTo?.({
        left: target.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      })
      setIndex(next)
    }
    return {
      trackRef,
      orientation: "horizontal",
      index,
      count,
      goTo,
      scrollPrev: () => goTo(Math.max(0, index - 1)),
      scrollNext: () => goTo(Math.min(count - 1, index + 1)),
      canScrollPrev: index > 0,
      canScrollNext: index < count - 1,
    }
  }, [count, index])

  return (
    <CarouselContext.Provider value={state}>
      <section
        data-slot="carousel"
        aria-roledescription="carousel"
        className={cn("relative flex flex-col items-center gap-3", className)}
        {...props}
      >
        {content ? (
          given
        ) : (
          <>
            <CarouselContent>{slides}</CarouselContent>
            {arrows}
          </>
        )}
        {hidePageControl || count <= 1 ? null : (
          <PageControl count={count} index={index} onIndexChange={state.goTo} />
        )}
      </section>
    </CarouselContext.Provider>
  )
}

/** The scroller itself: native, snapping, and without a scrollbar. */
function CarouselContent({ className, ...props }: ComponentProps<"div">) {
  const { trackRef } = useCarousel()
  return (
    <div
      ref={trackRef}
      data-slot="carousel-content"
      className={cn(
        "flex w-full snap-x snap-mandatory [scrollbar-width:none] gap-(--list-inset) overflow-x-auto scroll-smooth px-(--list-inset) [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("shrink-0 snap-start", className)}
      {...props}
    />
  )
}

/** apple.com's gallery arrows: a gray circle on each edge, dimmed at the end of the run. */
function CarouselPrevious({
  className,
  variant = "gray",
  ...props
}: ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      shape="circle"
      size="small"
      aria-label="Previous slide"
      className={cn("absolute inset-y-0 start-2 my-auto", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Icon icon={ArrowLeft01Icon} weight="semibold" />
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "gray",
  ...props
}: ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      shape="circle"
      size="small"
      aria-label="Next slide"
      className={cn("absolute inset-y-0 end-2 my-auto", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Icon icon={ArrowRight01Icon} weight="semibold" />
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
}
export type { CarouselProps }

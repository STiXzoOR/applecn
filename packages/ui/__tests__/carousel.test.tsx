import { render, renderHook, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import userEvent from "@testing-library/user-event"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "../src/components/carousel"

describe("Carousel", () => {
  test("is a horizontal snapping scroller of items with a page control", () => {
    render(
      <Carousel aria-label="Featured" pages={3}>
        <CarouselItem>One</CarouselItem>
        <CarouselItem>Two</CarouselItem>
        <CarouselItem>Three</CarouselItem>
      </Carousel>
    )
    const region = screen.getByRole("region", { name: "Featured" })
    expect(region).toHaveAttribute("data-slot", "carousel")
    const track = region.querySelector('[data-slot="carousel-content"]')!
    expect(track.className).toContain("snap-x")
    expect(track.className).toContain("overflow-x-auto")
    expect(region.querySelectorAll('[data-slot="carousel-item"]')).toHaveLength(
      3
    )
    expect(
      region.querySelectorAll('[data-slot="carousel-item"]')[0]!.className
    ).toContain("snap-start")
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-slot",
      "page-control"
    )
  })
})

describe("Carousel composed shadcn's way", () => {
  test("leaves an explicit track alone: one scroller, and the arrows drive it", () => {
    render(
      <Carousel aria-label="Featured" pages={3}>
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
          <CarouselItem>Two</CarouselItem>
          <CarouselItem>Three</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
    const region = screen.getByRole("region", { name: "Featured" })
    expect(
      region.querySelectorAll('[data-slot="carousel-content"]')
    ).toHaveLength(1)
    const previous = screen.getByRole("button", { name: "Previous slide" })
    expect(previous).toHaveAttribute("data-slot", "carousel-previous")
    // Nothing has scrolled yet, so there is nothing behind the first page.
    expect(previous).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next slide" })).toHaveAttribute(
      "data-slot",
      "carousel-next"
    )
  })

  test("the arrows move the page control's index", async () => {
    render(
      <Carousel aria-label="Featured" pages={3}>
        <CarouselItem>One</CarouselItem>
        <CarouselItem>Two</CarouselItem>
        <CarouselItem>Three</CarouselItem>
        <CarouselNext />
      </Carousel>
    )
    const pages = screen.getAllByRole("tab")
    expect(pages[0]!).toHaveAttribute("aria-selected", "true")
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }))
    expect(pages[1]!).toHaveAttribute("aria-selected", "true")
  })
})

describe("useCarousel", () => {
  test("refuses to answer outside a Carousel, as shadcn's does", () => {
    expect(() => renderHook(() => useCarousel())).toThrow(
      /must be used within a <Carousel/
    )
  })
})

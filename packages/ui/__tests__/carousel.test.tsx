import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Carousel, CarouselItem } from "../src/components/carousel"

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
    const track = region.querySelector('[data-slot="carousel-track"]')!
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

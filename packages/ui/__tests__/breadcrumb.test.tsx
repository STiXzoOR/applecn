import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../src/components/breadcrumb"

describe("Breadcrumb", () => {
  test("is a navigation of links separated by chevrons, the current page last and not a link", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Macintosh HD</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/users">Users</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Documents</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    )
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(nav).toHaveAttribute("data-slot", "breadcrumb")
    expect(screen.getAllByRole("link")).toHaveLength(2)
    const page = screen.getByText("Documents")
    expect(page).toHaveAttribute("aria-current", "page")
    expect(
      nav.querySelectorAll('[data-slot="breadcrumb-separator"]')
    ).toHaveLength(2)
    expect(screen.getByRole("link", { name: "Users" }).className).toContain(
      "text-label-2"
    )
  })
})

describe("Breadcrumb composed shadcn's way", () => {
  test("leaves an explicit list alone: one <ol>, and only the separators written", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Macintosh HD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Documents</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(nav.querySelectorAll("ol")).toHaveLength(1)
    expect(
      nav.querySelectorAll('[data-slot="breadcrumb-separator"]')
    ).toHaveLength(2)
    expect(nav.querySelector('[data-slot="breadcrumb-list"]')!.tagName).toBe(
      "OL"
    )
    const ellipsis = nav.querySelector('[data-slot="breadcrumb-ellipsis"]')!
    expect(ellipsis).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByText("More").className).toContain("sr-only")
  })

  test("a separator carries the caller's own glyph when one is given", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Now</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText("/")).toHaveAttribute(
      "data-slot",
      "breadcrumb-separator"
    )
  })
})

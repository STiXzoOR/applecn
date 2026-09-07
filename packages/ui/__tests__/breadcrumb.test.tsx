import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
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

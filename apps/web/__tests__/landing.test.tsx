import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Hero } from "@/components/landing/hero"
import { LandingNav } from "@/components/landing/nav"
import { Mosaic } from "@/components/landing/mosaic"
import { Evidence } from "@/components/landing/evidence"
import { Showcase } from "@/components/landing/showcase"

describe("landing page", () => {
  test("the nav links to the docs, components, foundations and the repository", () => {
    render(<LandingNav />)
    const nav = screen.getByRole("navigation", { name: "Site" })
    expect(nav.className).toContain("h-(--nav-bar-height)")
    expect(screen.getByRole("link", { name: "applecn" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs"
    )
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components/button"
    )
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      expect.stringContaining("github.com")
    )
  })

  test("the hero states the promise and leads to the docs and the registry", () => {
    render(<Hero />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /design system/i
    )
    expect(screen.getByRole("link", { name: /Get started/ })).toHaveAttribute(
      "href",
      "/docs"
    )
    expect(screen.getByText(/npx shadcn@latest add/)).toBeInTheDocument()
  })

  test("the showcase switches the device between iOS, macOS and the web", async () => {
    render(<Showcase />)
    expect(screen.getByRole("tab", { name: "iOS 26" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByLabelText("iPhone")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("tab", { name: "macOS 26" }))
    expect(await screen.findByLabelText("Mac")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Mac").closest("[data-platform]")
    ).toHaveAttribute("data-platform", "macos")
    await userEvent.click(screen.getByRole("tab", { name: "Web" }))
    expect(await screen.findByLabelText("Browser")).toBeInTheDocument()
  })

  test("the evidence band shows measured controls with their sources", () => {
    render(<Evidence />)
    expect(screen.getByText(/63 × 28/)).toBeInTheDocument()
    expect(
      screen.getAllByText(/UIKit|AppKit|apple\.com/).length
    ).toBeGreaterThan(2)
    expect(screen.getByRole("switch")).toBeInTheDocument()
  })

  test("the mosaic links every tile to a component page", () => {
    render(<Mosaic />)
    const links = screen.getAllByRole("link")
    expect(links.length).toBeGreaterThan(6)
    for (const link of links)
      expect(link.getAttribute("href")).toMatch(/^\/components\//)
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../src/components/hover-card"

describe("HoverCard", () => {
  test("a link shows a preview card on hover, as a glass popover with the platform corner", async () => {
    render(
      <HoverCard>
        <HoverCardTrigger href="https://www.apple.com/" delay={0}>
          apple.com
        </HoverCardTrigger>
        <HoverCardContent>
          <p>Apple</p>
        </HoverCardContent>
      </HoverCard>
    )
    const link = screen.getByRole("link", { name: "apple.com" })
    expect(link).toHaveAttribute("data-slot", "hover-card-trigger")
    expect(link.className).toContain("text-link")
    await userEvent.hover(link)
    const card = await screen.findByText("Apple")
    const popup = card.closest('[data-slot="hover-card-content"]')!
    expect(popup.className).toContain("rounded-popover")
    expect(popup.className).toContain("glass")
  })
})

describe("HoverCard stamps shadcn's portal slot", () => {
  test("the content portals through an element a shadcn selector finds", async () => {
    render(
      <HoverCard>
        <HoverCardTrigger href="#" delay={0}>
          applecn
        </HoverCardTrigger>
        <HoverCardContent>A registry.</HoverCardContent>
      </HoverCard>
    )
    await userEvent.hover(screen.getByText("applecn"))
    const card = await screen.findByText("A registry.")
    expect(card.closest('[data-slot="hover-card-portal"]')).not.toBeNull()
  })
})

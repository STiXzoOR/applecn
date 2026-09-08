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
    expect(link).toHaveAttribute("data-slot", "preview-card-trigger")
    expect(link.className).toContain("text-link")
    await userEvent.hover(link)
    const card = await screen.findByText("Apple")
    const popup = card.closest('[data-slot="preview-card-content"]')!
    expect(popup.className).toContain("rounded-popover")
    expect(popup.className).toContain("glass")
  })
})

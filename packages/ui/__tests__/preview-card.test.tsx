import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "../src/components/preview-card"

describe("PreviewCard", () => {
  test("a link shows a preview card on hover, as a glass popover with the platform corner", async () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger href="https://www.apple.com/" delay={0}>
          apple.com
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Apple</p>
        </PreviewCardContent>
      </PreviewCard>
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

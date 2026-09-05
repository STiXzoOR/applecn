import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  DisclosureGroup,
  DisclosureGroupPanel,
  DisclosureGroupTrigger,
} from "../src/components/disclosure-group"

describe("DisclosureGroup", () => {
  test("hides its details until the row is pressed, turning the chevron", async () => {
    render(
      <DisclosureGroup>
        <DisclosureGroupTrigger>Advanced Options</DisclosureGroupTrigger>
        <DisclosureGroupPanel>Details</DisclosureGroupPanel>
      </DisclosureGroup>
    )
    const trigger = screen.getByRole("button", { name: "Advanced Options" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Details")).toBeNull()
    const chevron = trigger.querySelector(
      '[data-slot="disclosure-group-chevron"]'
    )!
    expect(chevron.getAttribute("class")).toContain(
      "group-data-open/disclosure:rotate-90"
    )
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Details")).toBeVisible()
  })
})

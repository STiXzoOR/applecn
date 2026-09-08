import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../src/components/collapsible"
import { checkA11y } from "./helpers/axe"

describe("Collapsible", () => {
  test("hides its details until the row is pressed, turning the chevron", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
        <CollapsibleContent>Details</CollapsibleContent>
      </Collapsible>
    )
    const trigger = screen.getByRole("button", { name: "Advanced Options" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Details")).toBeNull()
    const chevron = trigger.querySelector('[data-slot="collapsible-chevron"]')!
    expect(chevron.getAttribute("class")).toContain(
      "group-data-open/disclosure:rotate-90"
    )
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Details")).toBeVisible()
  })

  test("has no accessibility violations, open or closed", async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
        <CollapsibleContent>Details</CollapsibleContent>
      </Collapsible>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
    await userEvent.click(
      screen.getByRole("button", { name: "Advanced Options" })
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

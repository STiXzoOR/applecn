import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../src/components/accordion"

describe("Accordion", () => {
  test("is a grouped list of disclosure rows; one opens at a time by default", async () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionPanel>Yes.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionPanel>Yes, like an inset grouped list.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
    const root = screen
      .getByRole("button", { name: "Is it accessible?" })
      .closest('[data-slot="accordion"]')!
    expect(root.className).toContain("rounded-list")
    expect(root.className).toContain("bg-card")
    const first = screen.getByRole("button", { name: "Is it accessible?" })
    expect(first.className).toContain("min-h-(--list-row-min-height)")
    expect(first).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(first)
    expect(first).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Yes.")).toBeVisible()
    await userEvent.click(screen.getByRole("button", { name: "Is it styled?" }))
    expect(first).toHaveAttribute("aria-expanded", "false")
  })
})

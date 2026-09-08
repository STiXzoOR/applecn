import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Accordion,
  AccordionItem,
  AccordionContent,
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

  /**
   * A disclosure row IS a list row — the same `--list-row-min-height`, `--list-row-padding-*` and
   * `--list-font` — so its line box is the same measured `--type-body-leading` that `item` writes,
   * not the judged `leading-snug` this file carried. On iOS 15 + 22 + 15 is exactly the 52 pt
   * `--list-row-min-height`, where `leading-snug` is 1.375 × 17 = 23.375 px and a 53.375 pt row;
   * macOS and the web are floor-driven either way.
   *
   * The panel's own `leading-snug` stays. It sets `--list-subtitle-font` on body copy rather than
   * on a row, and Apple has published no leading to pair with it — the same reason `item`'s `sm`
   * and `xs` assert none.
   */
  test("a row's leading is the measured body leading, like every other list row", () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionPanel>Yes.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
    const row = screen.getByRole("button", { name: "Is it accessible?" })
    expect(row.className).toContain("text-[length:var(--list-font)]")
    expect(row.className).toContain("leading-(--type-body-leading)")
    expect(row.className).not.toContain("leading-snug")
  })
})

describe("Accordion takes shadcn's markup unchanged", () => {
  test("AccordionContent is shadcn's name for the panel, and the same component", async () => {
    expect(AccordionContent).toBe(AccordionPanel)
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await userEvent.click(screen.getByRole("button", { name: /accessible/ }))
    expect(
      screen.getByText("Yes.").closest('[data-slot="accordion-content"]')
    ).not.toBeNull()
  })
})

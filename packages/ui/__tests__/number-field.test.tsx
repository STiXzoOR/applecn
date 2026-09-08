import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "../src/components/number-field"
import { checkA11y } from "./helpers/axe"

/**
 * `number-field` is the one primitive spec §5.7.1 names as a gap: shadcn's Base UI registry has
 * no `number-field`, ReUI does, and Apple's stepper is semantically one. The surface here is
 * ReUI's — the six exports, its `data-slot` values, its `sm`/`default`/`lg` sizes — and the
 * behaviour Base UI's. Nothing about the numbers is ReUI's: the field is applecn's own combined
 * field, so the chrome comes from `input-group` and the sizes from Apple's measured control
 * heights.
 */
const Field = () => (
  <NumberField defaultValue={1} min={0} max={3}>
    <NumberFieldGroup>
      <NumberFieldDecrement />
      <NumberFieldInput aria-label="Copies" />
      <NumberFieldIncrement />
    </NumberFieldGroup>
  </NumberField>
)

describe("NumberField", () => {
  test("is a number input that increments, decrements and clamps at its bounds", async () => {
    render(<Field />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("1")
    await userEvent.click(screen.getByRole("button", { name: "Increment" }))
    expect(input).toHaveValue("2")
    await userEvent.click(screen.getByRole("button", { name: "Decrement" }))
    expect(input).toHaveValue("1")
    await userEvent.click(screen.getByRole("button", { name: "Decrement" }))
    expect(input).toHaveValue("0")
    expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled()
  })

  test("carries ReUI's slots, so a registry consumer's CSS selects", () => {
    render(<Field />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("data-slot", "number-field-input")
    const group = input.closest('[data-slot="number-field-group"]')!
    expect(group).not.toBeNull()
    expect(group.closest('[data-slot="number-field"]')).not.toBeNull()
    expect(
      group.querySelector('[data-slot="number-field-increment"]')
    ).not.toBeNull()
    expect(
      group.querySelector('[data-slot="number-field-decrement"]')
    ).not.toBeNull()
  })

  test("the group is an input-group: Apple's field surface, not a second copy of it", () => {
    render(<Field />)
    const group = screen
      .getByRole("textbox")
      .closest('[data-slot="number-field-group"]')!
    expect(group.className).toContain("rounded-field")
    expect(group.className).toContain("h-(--text-field-height)")
    expect(group.className).toContain("border-(--input-border-color)")
    expect(group.className).toContain("shadow-(--input-shadow)")
  })

  test("the smaller and larger fields are Apple's measured control heights", () => {
    render(
      <>
        <NumberField defaultValue={1} size="sm">
          <NumberFieldGroup data-testid="sm">
            <NumberFieldInput aria-label="Small" />
          </NumberFieldGroup>
        </NumberField>
        <NumberField defaultValue={1} size="lg">
          <NumberFieldGroup data-testid="lg">
            <NumberFieldInput aria-label="Large" />
          </NumberFieldGroup>
        </NumberField>
      </>
    )
    expect(screen.getByTestId("sm").className).toContain(
      "h-(--control-height-small)"
    )
    expect(screen.getByTestId("lg").className).toContain(
      "h-(--control-height-large)"
    )
  })

  test("the scrub area names the field it drags", async () => {
    render(
      <NumberField defaultValue={1}>
        <NumberFieldScrubArea label="Copies" />
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Copies" />
        </NumberFieldGroup>
      </NumberField>
    )
    expect(screen.getByText("Copies")).toBeInTheDocument()
    expect(
      screen
        .getByText("Copies")
        .closest('[data-slot="number-field-scrub-area"]')
    ).not.toBeNull()
  })

  test("has no accessibility violations", async () => {
    const { container } = render(<Field />)
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

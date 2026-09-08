import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../src/components/input-group"
import { checkA11y } from "./helpers/axe"

describe("InputGroup", () => {
  test("puts an addon and the control in one field", () => {
    render(
      <InputGroup data-testid="group">
        <InputGroupAddon data-testid="addon">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Handle" placeholder="handle" />
      </InputGroup>
    )
    const group = screen.getByTestId("group")
    expect(group).toHaveAttribute("data-slot", "input-group")
    expect(group).toHaveAttribute("role", "group")
    expect(screen.getByTestId("addon")).toHaveAttribute(
      "data-slot",
      "input-group-addon"
    )
    expect(screen.getByLabelText("Handle")).toHaveAttribute(
      "data-slot",
      "input-group-control"
    )
    expect(screen.getByText("@").tagName).toBe("SPAN")
  })

  test("is Apple's text field: the field height, corner, hairline and fill", () => {
    render(
      <InputGroup data-testid="group">
        <InputGroupInput aria-label="Handle" />
      </InputGroup>
    )
    const group = screen.getByTestId("group")
    expect(group.className).toContain("h-(--text-field-height)")
    expect(group.className).toContain("rounded-field")
    expect(group.className).toContain("border-(length:--input-border-width)")
    expect(group.className).toContain("border-(--input-border-color)")
    expect(group.className).toContain("bg-background-3")
    expect(group.className).toContain("shadow-(--input-shadow)")
    expect(group.className).toContain("text-[length:var(--text-field-font)]")
    // The ring belongs to the group, not the control: the whole capsule lights up.
    expect(group.className).toContain("focus-within:ring-4")
  })

  test("the control inside carries no surface of its own", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Handle" />
      </InputGroup>
    )
    const input = screen.getByLabelText("Handle")
    expect(input).toHaveAttribute("data-variant", "plain")
    expect(input.className).toContain("flex-1")
    expect(input.className).toContain("bg-transparent")
  })

  test("an addon takes shadcn's four alignments", () => {
    render(
      <>
        <InputGroupAddon data-testid="default" />
        <InputGroupAddon data-testid="end" align="inline-end" />
        <InputGroupAddon data-testid="below" align="block-end" />
      </>
    )
    expect(screen.getByTestId("default")).toHaveAttribute(
      "data-align",
      "inline-start"
    )
    expect(screen.getByTestId("default").className).toContain("order-first")
    expect(screen.getByTestId("end")).toHaveAttribute(
      "data-align",
      "inline-end"
    )
    expect(screen.getByTestId("end").className).toContain("order-last")
    expect(screen.getByTestId("below").className).toContain("w-full")
  })

  test("clicking the addon puts the caret in the field", async () => {
    render(
      <InputGroup>
        <InputGroupAddon data-testid="addon">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Handle" />
      </InputGroup>
    )
    await userEvent.click(screen.getByTestId("addon"))
    expect(screen.getByLabelText("Handle")).toHaveFocus()
  })

  test("a button in an addon keeps its own focus, and does not steal the caret", async () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Handle" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
    await userEvent.click(screen.getByRole("button", { name: "Copy" }))
    expect(screen.getByLabelText("Handle")).not.toHaveFocus()
  })

  test("the button is a quiet one at Apple's smallest control size, defaulting as shadcn defaults", () => {
    render(<InputGroupButton>Copy</InputGroupButton>)
    const button = screen.getByRole("button", { name: "Copy" })
    // shadcn's size name reaches the DOM so its `[data-size=xs]` CSS still selects…
    expect(button).toHaveAttribute("data-size", "xs")
    expect(button).toHaveAttribute("type", "button")
    // …while the geometry is Apple's mini control.
    expect(button.className).toContain("h-(--control-height-mini)")
    expect(button.className).toContain("bg-transparent")
  })

  test("the icon sizes are round, as Apple's in-field buttons are", () => {
    render(
      <InputGroupButton size="icon-sm" aria-label="Clear">
        ×
      </InputGroupButton>
    )
    const button = screen.getByRole("button", { name: "Clear" })
    expect(button).toHaveAttribute("data-size", "icon-sm")
    expect(button).toHaveAttribute("data-shape", "circle")
    expect(button.className).toContain("h-(--control-height-small)")
  })

  test("a textarea grows the group instead of sitting in a fixed field", () => {
    render(
      <InputGroup data-testid="group">
        <InputGroupTextarea aria-label="Note" />
      </InputGroup>
    )
    expect(screen.getByTestId("group").className).toContain(
      "has-[>textarea]:h-auto"
    )
    const textarea = screen.getByLabelText("Note")
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea).toHaveAttribute("data-slot", "input-group-control")
    // `cn` must actually drop the field's own surface, not merely append after it.
    expect(textarea.className).not.toContain("bg-background-3")
    expect(textarea.className).not.toContain("shadow-(--textarea-shadow)")
    expect(textarea.className).not.toContain(
      "border-(length:--textarea-border-width)"
    )
    expect(textarea.className).toContain("resize-none")
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Website" placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear">
            ×
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

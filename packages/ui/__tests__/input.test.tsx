import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../src/components/field"
import { Input, inputVariants } from "../src/components/input"
import { Label } from "../src/components/label"
import { Textarea } from "../src/components/textarea"

describe("Input", () => {
  test("is the bordered text field by default: the platform's height and corner, a hairline, on the tertiary background", () => {
    render(<Input aria-label="Name" />)
    const i = screen.getByRole("textbox", { name: "Name" })
    expect(i).toHaveAttribute("data-slot", "input")
    expect(i).toHaveAttribute("data-variant", "bordered")
    expect(i.className).toContain("h-(--text-field-height)")
    expect(i.className).toContain("rounded-field")
    expect(i.className).toContain("border-[0.5px]")
    expect(i.className).toContain("border-separator")
    expect(i.className).toContain("bg-background-3")
    expect(i.className).toContain("macos:shadow-control")
    expect(i.className).toContain("text-[length:var(--text-field-font)]")
    expect(i.className).toContain("placeholder:text-placeholder")
  })

  test("plain and rounded (filled) variants", () => {
    expect(inputVariants({ variant: "plain" })).toContain("bg-transparent")
    expect(inputVariants({ variant: "rounded" })).toContain("bg-fill-3")
    expect(inputVariants({ variant: "rounded" })).toContain("rounded-lg")
  })

  test("a clearable field shows the clear button only once there is text, and clears it", async () => {
    render(<Input aria-label="City" clearable />)
    expect(screen.queryByRole("button", { name: "Clear text" })).toBeNull()
    const i = screen.getByRole("textbox", { name: "City" })
    await userEvent.type(i, "Cupertino")
    const clear = screen.getByRole("button", { name: "Clear text" })
    await userEvent.click(clear)
    expect(i).toHaveValue("")
    expect(screen.queryByRole("button", { name: "Clear text" })).toBeNull()
  })
})

describe("Textarea", () => {
  test("is a multi-line text view on the same surface", () => {
    render(<Textarea aria-label="Notes" />)
    const t = screen.getByRole("textbox", { name: "Notes" })
    expect(t.tagName).toBe("TEXTAREA")
    expect(t).toHaveAttribute("data-slot", "textarea")
    expect(t.className).toContain("rounded-field")
    expect(t.className).toContain("border-separator")
    expect(t.className).toContain("bg-background-3")
    expect(t.className).toContain("text-[length:var(--text-field-font)]")
  })
})

describe("Label and Field", () => {
  test("a label is body text", () => {
    render(<Label htmlFor="x">Email</Label>)
    const l = screen.getByText("Email")
    expect(l.tagName).toBe("LABEL")
    expect(l.className).toContain("type-body")
  })

  test("a field wires its label, description and error to the control", () => {
    render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldDescription>We never share it.</FieldDescription>
        <FieldError match>Enter a valid address.</FieldError>
      </Field>
    )
    const input = screen.getByLabelText("Email")
    expect(input).toHaveAttribute("aria-invalid", "true")
    const describedBy = input.getAttribute("aria-describedby") ?? ""
    expect(describedBy).not.toBe("")
    const description = screen.getByText("We never share it.")
    expect(describedBy.split(" ")).toContain(description.id)
    const error = screen.getByText("Enter a valid address.")
    expect(error.className).toContain("text-destructive")
    expect(error.className).toContain("type-footnote")
  })
})

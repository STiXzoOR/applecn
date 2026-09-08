import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { InputOTP } from "../src/components/input-otp"

describe("InputOTP", () => {
  test("is a row of one-character boxes that advances as digits are typed", async () => {
    const onChange = vi.fn()
    render(
      <InputOTP
        aria-label="Verification code"
        length={4}
        onValueChange={onChange}
      />
    )
    const group = screen.getByRole("group", { name: "Verification code" })
    expect(group).toHaveAttribute("data-slot", "passcode-field")
    const inputs = group.querySelectorAll("input")
    expect(inputs).toHaveLength(4)
    expect(inputs[0]!.className).toContain("rounded-field")
    expect(inputs[0]!.className).toContain(
      "border-(length:--passcode-field-border-width)"
    )
    expect(inputs[0]!.className).toContain(
      "border-(--passcode-field-border-color)"
    )
    expect(inputs[0]!.className).toContain("h-(--passcode-field-height)")
    expect(inputs[0]!.className).toContain("w-(--passcode-field-width)")
    expect(inputs[0]!.className).toContain("shadow-(--passcode-field-shadow)")
    await userEvent.click(inputs[0]!)
    await userEvent.keyboard("12")
    expect(onChange).toHaveBeenLastCalledWith("12", expect.anything())
    expect(inputs[2]).toHaveFocus()
  })
})

describe("InputOTP labelling", () => {
  test("names every box, including the first — Base UI drops `aria-label` there", () => {
    render(<InputOTP aria-label="Verification code" length={3} />)
    const boxes = screen.getAllByRole("textbox") as HTMLInputElement[]
    expect(boxes).toHaveLength(3)
    // A real <label> is the only thing Base UI honours on the first box; it names
    // the field as a whole too, so the first box carries the field's own name.
    expect(boxes[0]!.labels).toHaveLength(1)
    expect(boxes[0]!).toHaveAccessibleName("Verification code")
    expect(boxes[1]!).toHaveAccessibleName("Digit 2")
    expect(boxes[2]!).toHaveAccessibleName("Digit 3")
    expect(screen.getByRole("group")).toHaveAccessibleName("Verification code")
  })

  test("keeps the boxes and the label out of each other's ids", () => {
    render(<InputOTP aria-label="Code" length={2} />)
    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

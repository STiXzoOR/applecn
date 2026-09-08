import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../src/components/input-otp"
import { checkA11y } from "./helpers/axe"

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
    expect(group).toHaveAttribute("data-slot", "input-otp")
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

describe("InputOTP composed shadcn's way", () => {
  test("renders the boxes it is given, grouped and separated, instead of generating them", () => {
    render(
      <InputOTP aria-label="Verification code" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    )
    const group = screen.getByRole("group", { name: "Verification code" })
    expect(group.querySelectorAll("input")).toHaveLength(4)
    expect(
      group.querySelectorAll('[data-slot="input-otp-group"]')
    ).toHaveLength(2)
    const separator = group.querySelector('[data-slot="input-otp-separator"]')!
    expect(separator).toHaveAttribute("role", "separator")
    const boxes = screen.getAllByRole("textbox") as HTMLInputElement[]
    expect(boxes[0]!).toHaveAttribute("data-slot", "input-otp-slot")
    expect(boxes[1]!).toHaveAccessibleName("Digit 2")
    // `index` is shadcn's prop for its own DOM-less slots; it must never reach the input.
    expect(boxes[0]!).not.toHaveAttribute("index")
  })

  test("a generated box is the same InputOTPSlot, so shadcn's selector reaches both", () => {
    render(<InputOTP aria-label="Code" length={2} />)
    for (const box of screen.getAllByRole("textbox"))
      expect(box).toHaveAttribute("data-slot", "input-otp-slot")
  })
})

describe("InputOTP accessibility", () => {
  test("has no violations, generated boxes or explicit ones", async () => {
    const generated = render(
      <InputOTP aria-label="Verification code" length={4} />
    )
    expect(await checkA11y(generated.container)).toHaveNoViolations()
    generated.unmount()
    const explicit = render(
      <InputOTP aria-label="Verification code" length={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(await checkA11y(explicit.container)).toHaveNoViolations()
  })
})

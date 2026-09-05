import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { PasscodeField } from "../src/components/passcode-field"

describe("PasscodeField", () => {
  test("is a row of one-character boxes that advances as digits are typed", async () => {
    const onChange = vi.fn()
    render(
      <PasscodeField
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
    expect(inputs[0]!.className).toContain("border-separator")
    await userEvent.click(inputs[0]!)
    await userEvent.keyboard("12")
    expect(onChange).toHaveBeenLastCalledWith("12", expect.anything())
    expect(inputs[2]).toHaveFocus()
  })
})

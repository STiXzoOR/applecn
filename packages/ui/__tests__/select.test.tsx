import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from "../src/components/select"

function Fruit(props: { variant?: "plain" | "popup" }) {
  return (
    <Select defaultValue="apple" items={{ apple: "Apple", pear: "Pear" }}>
      <SelectTrigger aria-label="Fruit" variant={props.variant}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="pear">Pear</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select (menu picker)", () => {
  test("the trigger shows the value and opens a listbox of options", async () => {
    render(<Fruit />)
    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    expect(trigger).toHaveTextContent("Apple")
    await userEvent.click(trigger)
    const listbox = await screen.findByRole("listbox")
    expect(listbox.className).toContain("rounded-4xl")
    expect(listbox.className).toContain("glass")
    expect(listbox.className).toContain("min-w-(--menu-width)")
    const pear = screen.getByRole("option", { name: "Pear" })
    expect(pear.className).toContain("h-(--menu-item-height)")
    await userEvent.click(pear)
    expect(trigger).toHaveTextContent("Pear")
  })

  test("the plain trigger reads as a tinted label with chevrons; the popup style is a macOS pop-up button", () => {
    expect(selectTriggerVariants({ variant: "plain" })).toContain(
      "text-primary"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain("bg-fill-3")
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "h-(--text-field-height)"
    )
    render(<Fruit />)
    expect(
      screen
        .getByRole("combobox")
        .querySelector('[data-slot="select-trigger-icon"]')
    ).not.toBeNull()
  })
})

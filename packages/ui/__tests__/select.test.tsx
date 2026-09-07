import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectGroup>
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
    expect(listbox.className).toContain("rounded-menu")
    expect(listbox.className).toContain("glass")
    expect(listbox.className).toContain("min-w-(--menu-width)")
    expect(listbox.className).toContain("p-(--menu-padding)")
    const pear = screen.getByRole("option", { name: "Pear" })
    expect(pear.className).toContain("h-(--menu-item-height)")
    expect(pear.className).toContain("rounded-menu-item")
    expect(pear.className).toContain("text-[length:var(--menu-font)]")
    await userEvent.click(pear)
    expect(trigger).toHaveTextContent("Pear")
  })

  test("the plain trigger reads as a tinted label with chevrons; the popup style is a macOS pop-up button", () => {
    expect(selectTriggerVariants({ variant: "plain" })).toContain(
      "text-primary"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "bg-(--select-popup-bg)"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "h-(--control-height-regular)"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "rounded-control"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "shadow-(--select-popup-shadow)"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "hover:bg-(--select-popup-hover-bg)"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "border-(length:--select-popup-border-width)"
    )
    expect(selectTriggerVariants({ variant: "popup" })).toContain(
      "border-(--select-popup-border-color)"
    )
    render(<Fruit />)
    expect(
      screen
        .getByRole("combobox")
        .querySelector('[data-slot="select-trigger-icon"]')
    ).not.toBeNull()
  })

  test("the group label reads its type from tokens", async () => {
    render(<Fruit />)
    await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }))
    const label = await screen.findByText("Fruit", {
      selector: "[data-slot=select-label]",
    })
    expect(label.className).toContain(
      "text-[length:var(--select-label-font-size)]"
    )
    expect(label.className).toContain("leading-(--select-label-leading)")
    expect(label.className).toContain("font-(--select-label-weight)")
    expect(label.className).toContain("tracking-(--select-label-tracking)")
  })
})

describe("Select is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    expect(selectTriggerVariants({ variant: "popup" })).not.toMatch(
      /(^|\s)(ios|macos|web):/
    )
    render(<Fruit />)
    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    await userEvent.click(trigger)
    const listbox = await screen.findByRole("listbox")
    expect(listbox.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const pear = screen.getByRole("option", { name: "Pear" })
    expect(pear.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    expect(pear.className).toContain(
      "data-highlighted:bg-(--select-item-highlight-bg)"
    )
    expect(pear.className).toContain(
      "data-highlighted:text-(--select-item-highlight-text)"
    )
    const label = screen.getByText("Fruit", {
      selector: "[data-slot=select-label]",
    })
    expect(label.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

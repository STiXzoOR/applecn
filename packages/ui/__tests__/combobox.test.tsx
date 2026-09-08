import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../src/components/combobox"

const fruits = ["Apple", "Apricot", "Banana"]

function Fruit() {
  return (
    <Combobox items={fruits}>
      <ComboboxInput aria-label="Fruit" placeholder="Fruit" />
      <ComboboxContent>
        <ComboboxEmpty>No fruit.</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxGroupLabel>Fruit</ComboboxGroupLabel>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxGroup>
      </ComboboxContent>
    </Combobox>
  )
}

describe("Combobox", () => {
  test("filters the list as the person types and selects with Enter", async () => {
    render(<Fruit />)
    const input = screen.getByRole("combobox", { name: "Fruit" })
    expect(input).toHaveAttribute("data-slot", "combobox-input")
    expect(input.className).toContain("h-(--text-field-height)")
    expect(input.className).toContain("rounded-field")
    await userEvent.type(input, "Ap")
    const options = await screen.findAllByRole("option")
    expect(options.map((o) => o.textContent)).toEqual(["Apple", "Apricot"])
    expect(options[0]!.className).toContain("h-(--menu-item-height)")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(input).toHaveValue("Apple")
  })

  test("says when nothing matches", async () => {
    render(<Fruit />)
    await userEvent.type(screen.getByRole("combobox"), "zz")
    expect(await screen.findByText("No fruit.")).toBeInTheDocument()
  })

  test("the field's border and shadow, the row highlight and the group label read from tokens", async () => {
    render(<Fruit />)
    const input = screen.getByRole("combobox", { name: "Fruit" })
    expect(input.className).toContain(
      "border-(length:--combobox-field-border-width)"
    )
    expect(input.className).toContain("border-(--combobox-field-border-color)")
    expect(input.className).toContain("shadow-(--combobox-field-shadow)")
    await userEvent.type(input, "Ap")
    const option = (await screen.findAllByRole("option"))[0]!
    expect(option.className).toContain(
      "data-highlighted:bg-(--menu-item-highlight-bg)"
    )
    expect(option.className).toContain(
      "data-highlighted:text-(--menu-item-highlight-text)"
    )
    // The indicator reads the row's highlight state, so the row has to name the group it
    // belongs to: a bare `group-*` modifier matches no ancestor and never fires.
    expect(option.className).toContain("group/combobox-item")
    const indicator = option.querySelector("span")!
    expect(indicator.className).toContain(
      "group-data-highlighted/combobox-item:text-(--combobox-item-indicator-highlight-text)"
    )
    const label = screen.getByText("Fruit", {
      selector: "[data-slot=combobox-label]",
    })
    expect(label.className).toContain("px-(--menu-item-px)")
    expect(label.className).toContain("py-(--menu-label-py)")
    expect(label.className).toContain(
      "text-[length:var(--menu-label-font-size)]"
    )
    expect(label.className).toContain("leading-(--menu-label-leading)")
    expect(label.className).toContain("font-(--menu-label-weight)")
    expect(label.className).toContain("tracking-(--menu-label-tracking)")
  })
})

describe("Combobox is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", async () => {
    render(<Fruit />)
    const input = screen.getByRole("combobox", { name: "Fruit" })
    expect(input.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    await userEvent.type(input, "Ap")
    const option = (await screen.findAllByRole("option"))[0]!
    expect(option.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const label = screen.getByText("Fruit", {
      selector: "[data-slot=combobox-label]",
    })
    expect(label.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

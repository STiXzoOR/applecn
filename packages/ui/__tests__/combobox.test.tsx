import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
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
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
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
})

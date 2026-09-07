import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { ToggleGroup, ToggleGroupItem } from "../src/components/toggle-group"

function Styles(props: { multiple?: boolean }) {
  return (
    <ToggleGroup aria-label="Text style" multiple={props.multiple}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

describe("ToggleGroup", () => {
  test("is a group of pressable toggles, single-select by default", async () => {
    render(<Styles />)
    const group = screen.getByRole("group", { name: "Text style" })
    expect(group).toHaveAttribute("data-slot", "toggle-group")
    const bold = screen.getByRole("button", { name: "Bold" })
    const italic = screen.getByRole("button", { name: "Italic" })
    await userEvent.click(bold)
    expect(bold).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(italic)
    expect(italic).toHaveAttribute("aria-pressed", "true")
    expect(bold).toHaveAttribute("aria-pressed", "false")
  })

  test("multiple lets several stay pressed, as in a font-attributes control", async () => {
    render(<Styles multiple />)
    await userEvent.click(screen.getByRole("button", { name: "Bold" }))
    await userEvent.click(screen.getByRole("button", { name: "Italic" }))
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  test("is the joined control: the platform's corner on the group, square items inside on the fill", () => {
    render(<Styles />)
    const group = screen.getByRole("group")
    expect(group.className).toContain("rounded-segmented")
    expect(group.className).toContain("bg-fill-3")
    expect(group.className).toContain("h-(--segmented-height)")
    const item = screen.getByRole("button", { name: "Bold" })
    expect(item).toHaveAttribute("data-slot", "toggle-group-item")
    expect(item.className).toContain("data-pressed:bg-background")
    expect(item.className).toContain("data-pressed:shadow-segment")
    expect(item.className).toContain("macos:data-pressed:bg-primary")
  })
})

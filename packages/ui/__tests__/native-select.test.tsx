import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "../src/components/native-select"
import { checkA11y } from "./helpers/axe"

function Sort({
  size,
  disabled,
}: {
  size?: "sm" | "default"
  disabled?: boolean
} = {}) {
  return (
    <>
      <label htmlFor="sort">Sort by</label>
      <NativeSelect
        id="sort"
        size={size}
        disabled={disabled}
        defaultValue="name"
      >
        <NativeSelectOption value="name">Name</NativeSelectOption>
        <NativeSelectOptGroup label="Dates">
          <NativeSelectOption value="added">Date Added</NativeSelectOption>
          <NativeSelectOption value="modified">
            Date Modified
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </>
  )
}

describe("NativeSelect", () => {
  test("is a real select whose parts are stamped as shadcn stamps them", () => {
    render(<Sort />)
    const select = screen.getByRole("combobox", { name: "Sort by" })
    expect(select.tagName).toBe("SELECT")
    expect(select).toHaveAttribute("data-slot", "native-select")

    const wrapper = select.parentElement!
    expect(wrapper).toHaveAttribute("data-slot", "native-select-wrapper")
    expect(
      wrapper.querySelector('[data-slot="native-select-icon"]')
    ).not.toBeNull()
    expect(
      select.querySelector('[data-slot="native-select-option"]')
    ).not.toBeNull()
    expect(
      select.querySelector('[data-slot="native-select-optgroup"]')
    ).not.toBeNull()
  })

  test("is the pop-up button: the platform's control bezel around a native menu", () => {
    render(<Sort />)
    const select = screen.getByRole("combobox", { name: "Sort by" })
    expect(select.className).toContain("h-(--control-height-regular)")
    expect(select.className).toContain("rounded-(--control-radius-regular)")
    expect(select.className).toContain("bg-(--select-popup-bg)")
    expect(select.className).toContain(
      "border-(length:--select-popup-border-width)"
    )
    expect(select.className).toContain("border-(--select-popup-border-color)")
    expect(select.className).toContain("shadow-(--select-popup-shadow)")
    expect(select.className).toContain("appearance-none")
  })

  test("size=sm steps the bezel down to the small control, and says so in the DOM", () => {
    render(<Sort size="sm" />)
    const select = screen.getByRole("combobox", { name: "Sort by" })
    expect(select).toHaveAttribute("data-size", "sm")
    expect(select.parentElement).toHaveAttribute("data-size", "sm")
    expect(select.className).toContain("h-(--control-height-small)")
    expect(select.className).toContain("rounded-(--control-radius-small)")
    expect(select.className).toContain(
      "text-[length:var(--control-font-small)]"
    )
  })

  test("the caller's className dresses the wrapper, as it does in shadcn", () => {
    render(
      <>
        <label htmlFor="sort">Sort by</label>
        <NativeSelect id="sort" className="max-w-xs">
          <NativeSelectOption value="name">Name</NativeSelectOption>
        </NativeSelect>
      </>
    )
    const select = screen.getByRole("combobox", { name: "Sort by" })
    expect(select.parentElement!.className).toContain("max-w-xs")
    expect(select.className).not.toContain("max-w-xs")
  })

  test("the chevrons are decoration: hidden from assistive technology and unclickable", () => {
    render(<Sort />)
    const icon = screen
      .getByRole("combobox", { name: "Sort by" })
      .parentElement!.querySelector('[data-slot="native-select-icon"]')!
    expect(icon).toHaveAttribute("aria-hidden", "true")
    // An <svg>'s `className` is an SVGAnimatedString, so the attribute is the string.
    expect(icon.getAttribute("class")).toContain("pointer-events-none")
    expect(icon.getAttribute("class")).toContain("absolute")
  })

  test("a disabled select dims the whole bezel, not just the text", () => {
    render(<Sort disabled />)
    const select = screen.getByRole("combobox", { name: "Sort by" })
    expect(select).toBeDisabled()
    expect(select.parentElement!.className).toContain(
      "has-[select:disabled]:opacity-50"
    )
  })

  test("picking an option changes the value", async () => {
    render(<Sort />)
    const select = screen.getByRole("combobox", { name: "Sort by" })
    await userEvent.selectOptions(select, "modified")
    expect(select).toHaveValue("modified")
  })

  test("has no accessibility violations", async () => {
    const { container } = render(<Sort />)
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

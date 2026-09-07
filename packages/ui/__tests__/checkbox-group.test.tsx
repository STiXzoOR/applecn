import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { Checkbox } from "../src/components/checkbox"
import { CheckboxGroup } from "../src/components/checkbox-group"
import { Label } from "../src/components/label"

describe("CheckboxGroup", () => {
  test("a parent checkbox controls its children and shows the mixed state", async () => {
    render(
      <CheckboxGroup
        aria-label="Text style"
        allValues={["bold", "italic"]}
        defaultValue={["bold"]}
        parent={<Checkbox aria-label="All styles" />}
      >
        <Label>
          <Checkbox value="bold" /> Bold
        </Label>
        <Label>
          <Checkbox value="italic" /> Italic
        </Label>
      </CheckboxGroup>
    )
    const group = screen.getByRole("group", { name: "Text style" })
    expect(group).toHaveAttribute("data-slot", "checkbox-group")
    const parent = screen.getByRole("checkbox", { name: "All styles" })
    expect(parent).toHaveAttribute("aria-checked", "mixed")
    await userEvent.click(parent)
    expect(screen.getByRole("checkbox", { name: "Italic" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(parent).toHaveAttribute("aria-checked", "true")
  })
})

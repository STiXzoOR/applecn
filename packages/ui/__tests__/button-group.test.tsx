import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Button } from "../src/components/button"
import { ButtonGroup } from "../src/components/button-group"

describe("ButtonGroup", () => {
  test("joins buttons into one control: only the outer corners stay rounded, hairlines between", () => {
    render(
      <ButtonGroup aria-label="Pagination">
        <Button variant="gray">Previous</Button>
        <Button variant="gray">Next</Button>
      </ButtonGroup>
    )
    const group = screen.getByRole("group", { name: "Pagination" })
    expect(group).toHaveAttribute("data-slot", "button-group")
    expect(group.className).toContain("[&>*:not(:first-child)]:rounded-s-none")
    expect(group.className).toContain("[&>*:not(:last-child)]:rounded-e-none")
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })
})

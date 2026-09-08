import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import TableDataTable from "@/registry/examples/table/data-table"

/**
 * The `data-table` example (Task 30a). shadcn ships no `data-table` component — theirs is a
 * guide composing `table` with TanStack Table — so applecn's is that composition, and this
 * asserts the three behaviours the guide is about: sorting, row selection and filtering. The
 * paint belongs to `table`, which the ui package's own tests and the idiom harness cover; what
 * is untested anywhere else is the wiring between TanStack's state and applecn's markup.
 */
function names() {
  return within(screen.getByRole("table", { name: "Devices" }))
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelectorAll("td")[1]?.textContent)
}

describe("the data-table example", () => {
  test("the column header sorts the rows it names", async () => {
    render(<TableDataTable />)
    expect(names()[0]).toBe("Neo’s iPhone")
    await userEvent.click(screen.getByRole("button", { name: /^Name/ }))
    expect(names()).toEqual([
      "Living Room",
      "Neo’s iPad",
      "Neo’s iPhone",
      "Studio",
      "Watch",
    ])
  })

  test("selecting a row marks it selected, which is what paints Apple's tint", async () => {
    render(<TableDataTable />)
    const table = screen.getByRole("table", { name: "Devices" })
    await userEvent.click(
      within(table).getByRole("checkbox", { name: "Select Studio" })
    )
    const row = within(table).getByText("Studio").closest("tr")!
    expect(row).toHaveAttribute("aria-selected", "true")
    expect(row.className).toContain("aria-selected:bg-selection")
    expect(screen.getByText(/1 of 5 selected/)).toBeInTheDocument()
  })

  test("the search field filters, and says so when nothing is left", async () => {
    render(<TableDataTable />)
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter devices by name" }),
      "Studio"
    )
    expect(names()).toEqual(["Studio"])
    await userEvent.clear(
      screen.getByRole("searchbox", { name: "Filter devices by name" })
    )
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter devices by name" }),
      "zzz"
    )
    expect(screen.getByText("No devices.")).toBeInTheDocument()
  })
})

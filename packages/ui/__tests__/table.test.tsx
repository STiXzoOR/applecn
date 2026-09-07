import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/table"

function Files(props: { striped?: boolean }) {
  return (
    <Table striped={props.striped} aria-label="Files">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>Notes.txt</TableCell>
          <TableCell>2 KB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Photo.jpg</TableCell>
          <TableCell>1 MB</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe("Table (macOS)", () => {
  test("is a table with small headers and compact rows", () => {
    render(<Files />)
    const table = screen.getByRole("table", { name: "Files" })
    expect(table).toHaveAttribute("data-slot", "table")
    const head = screen.getByRole("columnheader", { name: "Name" })
    expect(head.className).toContain("type-caption-1")
    expect(head.className).toContain("text-label-2")
    const cell = screen.getByRole("cell", { name: "Notes.txt" })
    expect(cell.className).toContain("type-subheadline")
  })

  test("a selected row takes the tint; a striped table alternates rows", () => {
    render(<Files striped />)
    const selected = screen.getByRole("row", { name: /Notes\.txt/ })
    expect(selected).toHaveAttribute("aria-selected", "true")
    expect(selected.className).toContain("aria-selected:bg-selection")
    expect(screen.getByRole("table").className).toContain(
      "[&_tbody_tr:nth-child(even)]:bg-fill-4"
    )
  })
})

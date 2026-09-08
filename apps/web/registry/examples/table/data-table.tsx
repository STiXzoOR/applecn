"use client"

import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table"
import { Button } from "@applecn/ui/components/button"
import { Checkbox } from "@applecn/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@applecn/ui/components/dropdown-menu"
import { Icon } from "@applecn/ui/components/icon"
import { SearchField } from "@applecn/ui/components/search-field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@applecn/ui/components/table"
import { useState } from "react"

/**
 * shadcn ships no `data-table` component — their Data Table page is a GUIDE composing their
 * `table` with TanStack Table, so applecn's is the same composition on the same primitive,
 * with the sorting, filtering, column visibility, row selection and paging that guide shows.
 * The Apple part is `table` itself: NSTableView's compact rows, small column headers and the
 * accent-tinted selection. Nothing here is a new component, and nothing here is a new token.
 */

// v9 registers only the features a table uses; anything unregistered is tree-shaken away.
const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

interface Device {
  id: string
  name: string
  kind: string
  storage: number
}

const devices: Device[] = [
  { id: "1", name: "Neo’s iPhone", kind: "iPhone 17 Pro", storage: 256 },
  { id: "2", name: "Studio", kind: "Mac Studio", storage: 2048 },
  { id: "3", name: "Neo’s iPad", kind: "iPad Pro", storage: 512 },
  { id: "4", name: "Watch", kind: "Apple Watch Ultra", storage: 64 },
  { id: "5", name: "Living Room", kind: "Apple TV 4K", storage: 128 },
]

const columnHelper = createColumnHelper<typeof features, Device>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.name}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <Button
        variant="plain"
        size="mini"
        className="-mx-1 text-inherit"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <Icon icon={ArrowUpDownIcon} scale="small" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("name"),
  }),
  columnHelper.accessor("kind", { header: "Kind" }),
  columnHelper.accessor("storage", {
    header: () => <div className="text-end">Capacity</div>,
    cell: ({ row }) => (
      <div className="text-end tabular-nums">
        {row.getValue<number>("storage").toLocaleString("en-US")} GB
      </div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="plain"
              size="mini"
              aria-label={`Actions for ${row.original.name}`}
            />
          }
        >
          <Icon icon={MoreHorizontalIcon} scale="medium" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Rename…</DropdownMenuItem>
            <DropdownMenuItem>Show info</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
])

export default function TableDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useTable({
    features,
    data: devices,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const filter = table.getColumn("name")

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Filtering a table on macOS is a search field, not a bare text input. */}
        <SearchField
          className="max-w-3xs"
          placeholder="Filter devices"
          aria-label="Filter devices by name"
          value={(filter?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => filter?.setFilterValue(value)}
          showsCancelButton={false}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="bordered" size="small" className="ms-auto" />
            }
          >
            Columns
            <Icon icon={ChevronDownIcon} scale="small" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-4xl bg-background p-2">
        <Table aria-label="Devices">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} selected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No devices.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3">
        <p className="type-footnote text-label-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected
        </p>
        <Button
          variant="bordered"
          size="small"
          className="ms-auto"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="bordered"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

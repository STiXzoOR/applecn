import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * The macOS table (HIG › Lists and tables): small column headers, compact rows, optional
 * alternating row colour, and a selected row painted with the accent colour.
 */
type TableProps = ComponentProps<"table"> & {
  striped?: boolean
}

function Table({ className, striped = false, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        data-striped={striped || undefined}
        className={cn(
          "w-full caption-bottom border-collapse text-label",
          striped && "[&_tbody_tr:nth-child(even)]:bg-fill-4",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b-[0.5px] [&_tr]:border-separator",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody data-slot="table-body" className={cn("", className)} {...props} />
  )
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t-[0.5px] border-separator bg-fill-4", className)}
      {...props}
    />
  )
}

type TableRowProps = ComponentProps<"tr"> & {
  selected?: boolean
}

function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      aria-selected={selected}
      className={cn(
        "h-7 transition-colors duration-(--duration-press) aria-selected:bg-primary aria-selected:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-6 px-2 text-start align-middle type-caption-1 font-normal whitespace-nowrap text-label-2",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-2 align-middle type-subheadline whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-2 type-footnote text-label-2", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
export type { TableProps, TableRowProps }

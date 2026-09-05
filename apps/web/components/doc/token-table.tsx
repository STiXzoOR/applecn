import type { ReactNode } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@apple-ds/ui/components/table'

export function TokenTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="rounded-3xl bg-card p-2">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className="h-9">
              {row.map((cell, j) => (
                <TableCell key={j} className={j === 0 ? 'font-medium' : 'text-label-2 tabular-nums'}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

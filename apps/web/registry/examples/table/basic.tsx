import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@apple-ds/ui/components/table'

const files = [
  ['Notes.txt', 'Today, 09:12', '2 KB'],
  ['Photo.jpg', 'Yesterday', '1.4 MB'],
  ['Budget.numbers', 'Aug 30', '312 KB'],
  ['Deck.key', 'Aug 28', '24 MB'],
]

export default function TableBasic() {
  return (
    <div className="rounded-4xl bg-background p-2">
      <Table striped aria-label="Files">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Modified</TableHead>
            <TableHead className="text-end">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(([name, date, size], i) => (
            <TableRow key={name} selected={i === 1}>
              <TableCell>{name}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell className="text-end tabular-nums">{size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

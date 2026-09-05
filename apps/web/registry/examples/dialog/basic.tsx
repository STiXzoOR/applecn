"use client"

import { Button } from "@applecn/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@applecn/ui/components/dialog"
import { Input } from "@applecn/ui/components/input"

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="gray" />}>Rename…</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Enter a new name for “Projects”.
          </DialogDescription>
        </DialogHeader>
        <Input aria-label="Name" defaultValue="Projects" variant="bordered" />
        <DialogFooter>
          <DialogClose render={<Button size="small" />}>Rename</DialogClose>
          <DialogClose render={<Button size="small" variant="gray" />}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

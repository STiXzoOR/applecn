"use client"

import { Button } from "@applecn/ui/components/button"
import { Input } from "@applecn/ui/components/input"
import { Label } from "@applecn/ui/components/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@applecn/ui/components/sheet"
import { Switch } from "@applecn/ui/components/switch"

export default function SheetBasic() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="gray" />}>Inspector</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Arrange</SheetTitle>
          <SheetDescription>
            Position and size for the selected shape.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="w-8" htmlFor="sheet-x">
              X
            </Label>
            <Input id="sheet-x" defaultValue="120 pt" />
            <Label className="w-8" htmlFor="sheet-y">
              Y
            </Label>
            <Input id="sheet-y" defaultValue="64 pt" />
          </div>
          <Label className="flex items-center justify-between">
            Lock aspect ratio
            <Switch defaultChecked />
          </Label>
        </div>
        <SheetFooter>
          <SheetClose render={<Button size="small" />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

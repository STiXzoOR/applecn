"use client"

import { useEffect, useState } from "react"

import { Button } from "@applecn/ui/components/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@applecn/ui/components/command"
import { Kbd } from "@applecn/ui/components/kbd"

export default function CommandBasic() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((was) => !was)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="tinted" onClick={() => setOpen(true)}>
        Spotlight Search
      </Button>
      <p className="type-footnote text-label-2">
        or press <Kbd>⌘</Kbd> <Kbd>Space</Kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Spotlight Search" />
        <CommandList>
          <CommandEmpty>No Results</CommandEmpty>
          <CommandGroup heading="Applications">
            <CommandItem onSelect={() => setOpen(false)}>
              Calendar
              <CommandShortcut>⌘1</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Reminders
              <CommandShortcut>⌘2</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Music</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Documents">
            <CommandItem onSelect={() => setOpen(false)}>
              Q3 Budget.numbers
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Keynote Outline.pages
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

"use client"

import { ScrollArea } from "@applecn/ui/components/scroll-area"
import { Text } from "@applecn/ui/components/text"

const albums = [
  "Abbey Road",
  "Blue",
  "Kind of Blue",
  "Rumours",
  "Purple Rain",
  "Blonde",
  "Currents",
  "Discovery",
  "Homogenic",
  "Illinois",
  "In Rainbows",
  "Lemonade",
]

export default function ScrollAreaBasic() {
  return (
    <ScrollArea className="h-48 w-full max-w-sm rounded-card bg-card">
      <ul className="flex flex-col p-2">
        {albums.map((album) => (
          <li
            key={album}
            className="flex h-(--sidebar-row-height) items-center rounded-sidebar px-3 text-[length:var(--sidebar-font)] hover:bg-fill-4"
          >
            <Text as="span" variant="body">
              {album}
            </Text>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

"use client"

import { useState } from "react"

import { List, ListRow, ListSection } from "@applecn/ui/components/list"

const options = ["Date Edited", "Date Created", "Title"]

export default function ListSelection() {
  const [selected, setSelected] = useState("Date Edited")
  return (
    <div className="rounded-4xl bg-grouped-background-1">
      <List aria-label="Sort notes by">
        <ListSection header="Sort notes by" role="radiogroup">
          {options.map((option) => (
            <ListRow
              key={option}
              title={option}
              accessory="checkmark"
              checked={selected === option}
              onClick={() => setSelected(option)}
            />
          ))}
        </ListSection>
      </List>
    </div>
  )
}

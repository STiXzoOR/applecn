"use client"

import { useState } from "react"

import { PageControl } from "@applecn/ui/components/page-control"
import { Text } from "@applecn/ui/components/text"

const pages = ["Cupertino", "London", "Tokyo", "Sydney"]

export default function PageControlBasic() {
  const [index, setIndex] = useState(0)
  return (
    <div className="flex flex-col items-center gap-4 rounded-4xl bg-[linear-gradient(135deg,var(--system-blue),var(--system-purple))] p-6 text-white">
      <Text variant="title-1" emphasized color="inherit">
        {pages[index]}
      </Text>
      <PageControl
        aria-label="Cities"
        count={pages.length}
        index={index}
        onIndexChange={setIndex}
        background="prominent"
      />
    </div>
  )
}

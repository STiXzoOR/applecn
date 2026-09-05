"use client"

import { Input } from "@applecn/ui/components/input"

export default function InputBasic() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Input aria-label="Name" placeholder="Rounded" />
      <div className="rounded-4xl bg-card px-4">
        <Input
          aria-label="Email"
          variant="plain"
          placeholder="Plain, inside a list row"
        />
      </div>
      <Input
        aria-label="Title"
        variant="bordered"
        placeholder="Bordered (macOS)"
      />
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
    </div>
  )
}

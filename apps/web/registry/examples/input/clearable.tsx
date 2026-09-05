"use client"

import { Input } from "@apple-ds/ui/components/input"

export default function InputClearable() {
  return (
    <Input
      aria-label="City"
      placeholder="City"
      clearable
      defaultValue="Cupertino"
      className="max-w-sm"
    />
  )
}

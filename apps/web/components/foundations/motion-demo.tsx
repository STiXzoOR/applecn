"use client"

import { useState } from "react"

import { Text } from "@apple-ds/ui/components/text"

export function MotionDemo({
  name,
  easing,
  duration,
}: {
  name: string
  easing: string
  duration: number
}) {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      className="grid grid-cols-[10rem_1fr] items-center gap-4 rounded-3xl bg-card px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <Text variant="subheadline" className="font-mono">
        {name}
      </Text>
      <div className="relative h-6">
        <div
          className="absolute top-0 size-6 rounded-full bg-primary"
          style={{
            transform: on ? "translateX(calc(100% * 8))" : "translateX(0)",
            transition: `transform ${duration}ms ${easing}`,
          }}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}

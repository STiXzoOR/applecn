import { describe, expect, test } from "vitest"

import { cn } from "../src/lib/utils"

describe("cn", () => {
  test("resolves a genuine Tailwind conflict, last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  test("keeps a type utility beside a text colour", () => {
    // The reason type-* are @utility blocks and not @theme --text-* entries:
    // tailwind-merge groups by prefix, so `text-body` would drop `text-label`.
    expect(cn("type-body", "text-label")).toBe("type-body text-label")
  })

  test("takes clsx-style conditionals", () => {
    expect(cn("a", false && "b", ["c", { d: true, e: false }])).toBe("a c d")
  })
})

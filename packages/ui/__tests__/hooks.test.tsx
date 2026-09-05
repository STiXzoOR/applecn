import { renderHook } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { useColorScheme } from "../src/hooks/use-color-scheme"
import { useReducedMotion } from "../src/hooks/use-reduced-motion"

describe("preference hooks", () => {
  test("useReducedMotion follows prefers-reduced-motion (false in the test viewport)", () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  test("useColorScheme reports light or dark (light in the test viewport)", () => {
    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe("light")
  })
})

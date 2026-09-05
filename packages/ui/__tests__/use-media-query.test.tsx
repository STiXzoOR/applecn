import { act, renderHook } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { useIsDesktop, useMediaQuery } from "../src/hooks/use-media-query"
import { setViewport } from "./helpers/viewport"

describe("useMediaQuery", () => {
  test("reports the current match and follows viewport changes", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 640px)"))
    expect(result.current).toBe(false)
    act(() => setViewport("desktop"))
    expect(result.current).toBe(true)
  })

  test("useIsDesktop is the sheet breakpoint (640 px)", () => {
    setViewport("desktop")
    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBe(true)
  })
})

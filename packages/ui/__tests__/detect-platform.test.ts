import { describe, expect, test } from "vitest"

import { detectPlatform } from "../src/lib/detect-platform"

describe("detectPlatform", () => {
  test("iPhone and iPad user agents are ios", () => {
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
      })
    ).toBe("ios")
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 26_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
      })
    ).toBe("ios")
  })

  test("an iPad that reports itself as a Mac is ios when it has touch points", () => {
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
        maxTouchPoints: 5,
      })
    ).toBe("ios")
  })

  test("a Mac is macos", () => {
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
        maxTouchPoints: 0,
      })
    ).toBe("macos")
  })

  test("everything else is web, including the server", () => {
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
      })
    ).toBe("web")
    expect(
      detectPlatform({
        userAgent:
          "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36",
      })
    ).toBe("web")
    expect(detectPlatform({ userAgent: "" })).toBe("web")
  })
})

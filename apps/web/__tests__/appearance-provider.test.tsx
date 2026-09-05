import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import {
  AppearanceProvider,
  resetAppearanceCache,
  useAppearance,
} from "@/components/appearance"

function Probe() {
  const { platform, setPlatform } = useAppearance()
  return (
    <button type="button" onClick={() => setPlatform("macos")}>
      {platform}
    </button>
  )
}

const remember = (platform: string, contrast = false) =>
  window.localStorage.setItem(
    "applecn:appearance",
    JSON.stringify({ platform, contrast, transparency: false })
  )

describe("AppearanceProvider", () => {
  beforeEach(() => resetAppearanceCache())
  afterEach(() => {
    window.localStorage.clear()
    resetAppearanceCache()
    delete document.documentElement.dataset.platform
    delete document.documentElement.dataset.contrast
  })

  test("the server always renders the iOS default, whatever the browser remembers", () => {
    remember("web")
    const html = renderToString(
      <AppearanceProvider>
        <Probe />
      </AppearanceProvider>
    )
    expect(html).toContain('data-platform="ios"')
    expect(html).toContain(">ios<")
  })

  test("the client adopts the remembered platform and stamps the document root", async () => {
    remember("web")
    render(
      <AppearanceProvider>
        <Probe />
      </AppearanceProvider>
    )
    await act(async () => {})
    expect(screen.getByRole("button")).toHaveTextContent("web")
    expect(document.documentElement.dataset.platform).toBe("web")
  })

  test("changing a setting persists it without dropping the others", async () => {
    remember("web", true)
    render(
      <AppearanceProvider>
        <Probe />
      </AppearanceProvider>
    )
    await userEvent.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toHaveTextContent("macos")
    expect(
      JSON.parse(window.localStorage.getItem("applecn:appearance")!)
    ).toEqual({ platform: "macos", contrast: true, transparency: false })
    expect(document.documentElement.dataset.platform).toBe("macos")
    expect(document.documentElement.dataset.contrast).toBe("more")
  })
})

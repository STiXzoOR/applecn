import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { AppearanceProvider } from "@/components/appearance"
import { PlatformSwitch } from "@/components/appearance-controls"
import { DocsShell } from "@/components/docs-shell"
import { LandingNav } from "@/components/landing/nav"
import { ThemeProvider } from "@/components/theme-provider"

function shell(children = <p>Page</p>) {
  return render(
    <ThemeProvider>
      <AppearanceProvider>
        <DocsShell>{children}</DocsShell>
      </AppearanceProvider>
    </ThemeProvider>
  )
}

describe("the documentation shell", () => {
  test("gives the platform switch room for all three idioms instead of a fixed width", () => {
    shell()
    const track = screen.getByRole("group", { name: "Platform" })
    // "iOS macOS Web" needs ~170 px; a fixed w-40 pushes "Web" outside the track.
    expect(track.className).not.toMatch(/(^|\s)(max-)?w-\d+(\s|$)/)
    expect(track.className).toContain("shrink-0")
  })

  test("offers every idiom the tokens ship", () => {
    render(
      <ThemeProvider>
        <AppearanceProvider>
          <PlatformSwitch />
        </AppearanceProvider>
      </ThemeProvider>
    )
    const track = screen.getByRole("group", { name: "Platform" })
    expect(
      within(track)
        .getAllByRole("button")
        .map((segment) => segment.textContent)
    ).toEqual(["iOS", "macOS", "Web"])
  })
})

describe("the landing nav", () => {
  test("collapses its links into a menu on phones so the bar never overflows", async () => {
    render(<LandingNav />)
    const row = screen.getByRole("link", { name: "Docs" }).parentElement!
    expect(row.className).toContain("hidden")
    expect(row.className).toContain("sm:flex")
    // A nav bar is not a sidebar: the phone menu is a sheet of list rows.
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const sheet = await screen.findByRole("dialog")
    for (const title of ["Docs", "Foundations", "Components", "GitHub"])
      expect(within(sheet).getByRole("link", { name: title })).toBeVisible()
  })

  test("keeps the appearance menu reachable at every width", () => {
    render(<LandingNav />)
    expect(screen.getByRole("button", { name: "Appearance" })).toBeVisible()
  })
})

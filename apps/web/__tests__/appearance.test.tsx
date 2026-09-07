import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import { AppearanceProvider } from "@/components/appearance"
import { AppearanceMenu } from "@/components/appearance-controls"
import { ThemeProvider } from "@/components/theme-provider"

describe("AppearanceMenu", () => {
  test("opens without crashing and lists the appearance and accessibility options", async () => {
    render(
      <ThemeProvider>
        <AppearanceProvider>
          <AppearanceMenu />
        </AppearanceProvider>
      </ThemeProvider>
    )
    await userEvent.click(screen.getByRole("button", { name: "Appearance" }))
    expect(
      await screen.findByRole("menuitemradio", { name: "Light" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Increase Contrast" })
    ).toBeInTheDocument()
    expect(screen.getByText("Appearance", { selector: "div" })).toBeVisible()
  })
})

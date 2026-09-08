import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from "../src/components/alert"
import { checkA11y } from "./helpers/axe"
import { resolve, variableMap } from "./helpers/token-cascade"

describe("Alert", () => {
  test("is a live region carrying a title and a description, each stamped as shadcn stamps it", () => {
    render(
      <Alert>
        <AlertTitle>Backup complete</AlertTitle>
        <AlertDescription>Last backup 2 minutes ago.</AlertDescription>
      </Alert>
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveAttribute("data-slot", "alert")
    expect(alert.querySelector('[data-slot="alert-title"]')).toHaveTextContent(
      "Backup complete"
    )
    expect(
      alert.querySelector('[data-slot="alert-description"]')
    ).toHaveTextContent("Last backup 2 minutes ago.")
  })

  test("is the notification banner in flow: the card corner and the banner's own type", () => {
    render(
      <Alert>
        <AlertTitle>Backup complete</AlertTitle>
        <AlertDescription>Last backup 2 minutes ago.</AlertDescription>
      </Alert>
    )
    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("rounded-card")
    expect(alert.className).toContain("bg-card")
    const title = alert.querySelector('[data-slot="alert-title"]')!
    expect(title.className).toContain("type-subheadline")
    expect(title.className).toContain("font-semibold")
    const description = alert.querySelector('[data-slot="alert-description"]')!
    expect(description.className).toContain("type-subheadline")
    expect(description.className).toContain("text-label-2")
  })

  test("lays the leading glyph out in a column of its own, and takes none when there is none", () => {
    const { rerender } = render(
      <Alert>
        <AlertTitle>Backup complete</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert").className).toContain("grid-cols-[0_1fr")

    rerender(
      <Alert>
        <svg aria-hidden="true" />
        <AlertTitle>Backup complete</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert").className).toContain(
      "has-[>svg]:grid-cols-[auto_1fr"
    )
  })

  test("takes shadcn's two variants, and destructive paints the banner red", () => {
    const { rerender } = render(
      <Alert>
        <AlertTitle>Backup complete</AlertTitle>
      </Alert>
    )
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "default")

    rerender(
      <Alert variant="destructive">
        <AlertTitle>Backup failed</AlertTitle>
      </Alert>
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveAttribute("data-variant", "destructive")
    expect(alert.className).toContain("text-destructive")
    expect(alert.className).toContain("bg-destructive/10")
  })

  test("AlertAction parks a control opposite the text", () => {
    render(
      <Alert>
        <AlertTitle>Backup failed</AlertTitle>
        <AlertAction>
          <button type="button">Retry</button>
        </AlertAction>
      </Alert>
    )
    const action = screen
      .getByRole("alert")
      .querySelector('[data-slot="alert-action"]')!
    expect(action.className).toContain("justify-self-end")
    expect(action).toContainElement(
      screen.getByRole("button", { name: "Retry" })
    )
  })

  /**
   * The banner has to LOOK like a banner. `--card` is `--grouped-background-2`, which is the same
   * colour as `--background` in light on all three idioms and in dark on macOS — so a container
   * painted with `bg-card` and nothing else is invisible in four of the six idiom x appearance
   * combinations, and the default variant read as loose text beside a destructive variant that
   * read as a banner. Two variants of one component that do not look like the same component.
   *
   * The fill is right and stays; what was missing is a boundary. Recorded in two parts: the
   * mechanism (which combinations the fill cannot be seen in) and the gate (the container draws
   * an edge of its own, in every variant, so it does not depend on the fill at all).
   */
  const COMBINATIONS = (["ios", "macos", "web"] as const).flatMap((platform) =>
    (["light", "dark"] as const).map(
      (appearance) => [platform, appearance] as const
    )
  )

  test("the card fill alone cannot carry the container: it is the page ground in four of six", () => {
    const invisible = COMBINATIONS.filter(([platform, appearance]) => {
      const vars = variableMap(platform, { name: appearance, appearance })
      return resolve("var(--card)", vars) === resolve("var(--background)", vars)
    }).map(([platform, appearance]) => `${platform}/${appearance}`)
    expect(
      invisible,
      "if this set changed, the token values moved and the reason for the hairline moved with it"
    ).toEqual(["ios/light", "macos/light", "macos/dark", "web/light"])
  })

  test.each(["default", "destructive"] as const)(
    "the %s variant draws an edge of its own, so the container is visible in all six",
    (variant) => {
      const className = alertVariants({ variant })
      expect(className).toContain("border-[0.5px]")
      expect(className).toContain("border-separator")
    }
  )

  test("has no accessibility violations", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Backup complete</AlertTitle>
        <AlertDescription>Last backup 2 minutes ago.</AlertDescription>
        <AlertAction>
          <button type="button">Undo</button>
        </AlertAction>
      </Alert>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

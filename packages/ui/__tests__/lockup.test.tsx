import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { Lockup } from "../src/components/lockup"

describe("Lockup", () => {
  test("is the App Store product lockup: an icon on the icon mask, a title, a subtitle and a Get button", () => {
    render(
      <Lockup
        icon={<span data-testid="icon" />}
        title="Procreate"
        subtitle="Sketch, paint, create."
        action={<button type="button">Get</button>}
      />
    )
    const lockup = screen
      .getByText("Procreate")
      .closest('[data-slot="lockup"]')!
    const icon = lockup.querySelector('[data-slot="lockup-icon"]')!
    expect(icon.className).toContain("rounded-icon")
    expect(icon.className).toContain("size-16")
    expect(screen.getByText("Procreate").className).toContain("type-headline")
    expect(screen.getByText("Sketch, paint, create.").className).toContain(
      "text-label-2"
    )
    expect(screen.getByRole("button", { name: "Get" })).toBeInTheDocument()
  })

  test("sizes: small for lists, large for a hero", () => {
    render(<Lockup size="large" icon={<span />} title="Keynote" />)
    expect(
      screen
        .getByText("Keynote")
        .closest('[data-slot="lockup"]')!
        .querySelector('[data-slot="lockup-icon"]')!.className
    ).toContain("size-30")
  })
})

import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { cn } from "../src/lib/utils"
import { ColorWell } from "../src/components/color-well"

describe("ColorWell", () => {
  test("is a colour input shown as the platform's well: a 28 pt ring on iOS, AppKit's 48×24 capsule on macOS", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const input = screen.getByLabelText("Highlight")
    expect(input).toHaveAttribute("type", "color")
    expect(input).toHaveValue("#ff3b30")
    const well = input.closest('[data-slot="color-well"]')!
    expect(well.className).toContain("rounded-(--color-well-radius)")
    expect(well.className).toContain("h-(--color-well-height)")
    expect(well.className).toContain("w-(--color-well-width)")
    expect(well.className).toContain(
      "border-(length:--color-well-border-width)"
    )
    expect(well.className).toContain("bg-(--color-well-bg)")
    expect(well.className).toContain("p-(--color-well-padding)")
    expect(well.className).toContain("shadow-(--color-well-shadow)")
    const swatch = well.querySelector('[data-slot="color-well-swatch"]')!
    expect(swatch.className).toContain("rounded-(--color-well-swatch-radius)")
  })
})

describe("ColorWell is idiom-agnostic", () => {
  test("carries no platform variant; the idiom supplies the values", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const well = screen
      .getByLabelText("Highlight")
      .closest('[data-slot="color-well"]')!
    expect(well.className).not.toMatch(/(^|\s)(ios|macos|web):/)
    const swatch = well.querySelector('[data-slot="color-well-swatch"]')!
    expect(swatch.className).not.toMatch(/(^|\s)(ios|macos|web):/)
  })
})

/**
 * Task 35 asked for `color-well` to be rebuilt on `input-group`, as Task 33 rebuilt
 * `search-field`. It cannot be, and these are the numbers that say so — pinned here so the answer
 * is executable rather than remembered. A search capsule IS the combined field; a colour well is a
 * 28 pt swatch, and it shares neither `input-group`'s element nor any of its values.
 *
 * Spiked as a real rebuild and measured in a browser on 2026-09-08:
 *
 * - **The radius breaks.** The well reads `rounded-(--color-well-radius)`, an arbitrary value;
 *   `input-group` writes `rounded-field`, a named theme radius. `cn` does not merge the two — it
 *   does not know applecn's named radii — so both survive on the element and the cascade decides,
 *   and Tailwind emits the named one later. Measured: the composed well came out at **5 px on iOS
 *   and on the web where the well is a circle** (`calc(infinity * 1px)`, 16,777,216 px computed).
 *   macOS matched at 6 px only because `--color-well-radius` and `--text-field-radius` happen to
 *   agree there. The same collision resolved the other way for `search-field`, whose
 *   `rounded-search` Tailwind emits after `rounded-field`; that it went the right way there and
 *   the wrong way here is exactly why it is a race and not a rule.
 * - **The element is wrong.** The well is a `<label>` wrapping `<input type="color">`, which is
 *   what makes the whole swatch open the system picker. `InputGroup` renders a `<div role="group">`
 *   and takes no `render` prop, so a rebuild either loses the label or grows a wrapper around it —
 *   and `role="group"` on a single labelled input is not what the well is.
 * - **Nothing of the group survives.** Seven of `input-group`'s utilities are overridden outright
 *   (height, width, radius, border width, fill, padding, shadow), two more must be neutralised
 *   (`gap-1.5`, `flex-wrap`), and it brings a field type (`--text-field-font`) and two
 *   `has-[>textarea]` rules to a control that has neither. What is left that the well wants is
 *   `relative`, `outline-none` and a focus ring it already writes for itself.
 */
describe("ColorWell cannot be rebuilt on input-group", () => {
  test("the well is a label around the colour input, which a group is not", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const well = screen
      .getByLabelText("Highlight")
      .closest('[data-slot="color-well"]')!
    expect(well.tagName).toBe("LABEL")
    expect(well).not.toHaveAttribute("role", "group")
  })

  test("the radius is the well's own, with no named radius left on the element to beat it", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const well = screen
      .getByLabelText("Highlight")
      .closest('[data-slot="color-well"]')!
    expect(well.className).toContain("rounded-(--color-well-radius)")
    expect(well.className).not.toContain("rounded-field")
    // The merge, executably: `cn` keeps both, so the cascade would decide.
    expect(cn("rounded-field", "rounded-(--color-well-radius)")).toBe(
      "rounded-field rounded-(--color-well-radius)"
    )
  })

  test("the well is a swatch, not a field: no field type, no gap, no wrap", () => {
    render(<ColorWell aria-label="Highlight" defaultValue="#ff3b30" />)
    const well = screen
      .getByLabelText("Highlight")
      .closest('[data-slot="color-well"]')!
    expect(well.className).not.toContain("text-[length:var(--text-field-font)]")
    expect(well.className).not.toContain("gap-1.5")
    expect(well.className).not.toContain("flex-wrap")
    expect(well.className).toContain("inline-flex")
    expect(well.className).toContain("justify-center")
  })
})

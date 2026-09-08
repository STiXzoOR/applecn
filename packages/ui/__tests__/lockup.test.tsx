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

/**
 * Task 32 asked for `lockup` to be rebuilt on `item`, as Task 31 rebuilt `list`. It cannot be,
 * and these are the numbers that say so — pinned here so the answer is executable rather than
 * remembered. A lockup shares `item`'s SHAPE (media, title, description, a trailing action) and
 * none of its VALUES: `item`'s parts are a list row's parts, and every one of them carries a
 * list-row metric that a lockup measures differently.
 *
 * Measured in a browser on 2026-09-08, against the built docs on the web idiom:
 *
 * - `ItemMedia` sizes any DESCENDANT glyph, `[&_svg]:size-[70%]`. A lockup's well sizes a direct
 *   CHILD only, `[&>svg]:size-1/2`, so artwork wrapped in a span — which is how the App Store
 *   lockup is composed, and how this module's own example composes it — keeps its natural size.
 *   Under `ItemMedia` a 24 px glyph in a 64 px well becomes 44.8 px. The two rules cannot be made
 *   to coexist either: at equal specificity `[&_svg]` won the race against `[&>svg]`.
 * - `ItemDescription` sets `text-[length:var(--list-subtitle-font)]`. A lockup's subtitle is
 *   `type-footnote`, and a named text style does not override an arbitrary-length one — they are
 *   different `cn` groups, so both survive. Written in either order the result was the same
 *   hybrid: 13 px from the list token, 20 px leading from the text style, neither style intact.
 * - `Item` itself is a ROW: `min-h-(--list-row-min-height)`, `px/py-(--list-row-padding-*)`,
 *   `w-full`, `flex-wrap`, and shadcn's `default`/`sm`/`xs` on `data-size` where a lockup's is
 *   Apple's `small`/`medium`/`large`. On iOS a `small` lockup is 48 pt, under the row minimum of
 *   52, so it would grow. Six neutralising classes and two overridden state attributes is not a
 *   composition.
 *
 * So `lockup` stays Apple's own, in the shape §5.6 already gave `text` and `link`: verified to
 * duplicate nothing, rather than rebuilt onto a base that does not fit.
 */
describe("Lockup measures its own type and artwork, not a list row's", () => {
  const render1 = (props: Partial<Parameters<typeof Lockup>[0]> = {}) => {
    const { unmount } = render(
      <Lockup
        icon={<span data-testid="art" />}
        title="Procreate"
        subtitle="Sketch, paint, create."
        description="Apple · Productivity"
        {...props}
      />
    )
    const root = screen.getByText("Procreate").closest('[data-slot="lockup"]')!
    const at = (slot: string) =>
      root.querySelector(`[data-slot="lockup-${slot}"]`)!.className
    return { root, at, unmount }
  }

  test("the well sizes a direct child only, so wrapped artwork keeps its size", () => {
    const { at } = render1()
    expect(at("icon")).toContain("[&>svg]:size-1/2")
    expect(at("icon")).not.toContain("[&_svg]")
    expect(at("icon")).toContain("rounded-icon")
    expect(at("icon")).toContain("shadow-artwork")
  })

  test("the icon is 48, 64 and 120 pt, never the list row's tile", () => {
    for (const [size, tile] of [
      ["small", "size-12"],
      ["medium", "size-16"],
      ["large", "size-30"],
    ] as const) {
      const { at, unmount } = render1({ size })
      expect(at("icon")).toContain(tile)
      expect(at("icon")).not.toContain("--list-icon-tile")
      unmount()
    }
  })

  test("the text is named Apple styles, never --list-subtitle-font", () => {
    const { at, unmount } = render1()
    expect(at("title")).toContain("type-headline")
    expect(at("subtitle")).toContain("type-footnote")
    expect(at("description")).toContain("type-footnote")
    expect(at("subtitle")).not.toContain("--list-subtitle-font")
    expect(at("description")).not.toContain("--list-subtitle-font")
    unmount()

    const large = render1({ size: "large" })
    expect(large.at("title")).toContain("type-title-2")
    expect(large.at("subtitle")).toContain("type-body")
  })

  test("a lockup is not a row: no row minimum, no row padding, its own gap scale", () => {
    for (const [size, gap] of [
      ["small", "gap-3"],
      ["medium", "gap-4"],
      ["large", "gap-5"],
    ] as const) {
      const { root, unmount } = render1({ size })
      expect(root.className).toContain(gap)
      expect(root.className).not.toContain("--list-row-min-height")
      expect(root.className).not.toContain("--list-row-padding")
      expect(root).toHaveAttribute("data-size", size)
      unmount()
    }
  })
})

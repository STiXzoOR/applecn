import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, test } from "vitest"

import { ToggleGroup, ToggleGroupItem } from "../src/components/toggle-group"

function Styles(props: { multiple?: boolean }) {
  return (
    <ToggleGroup aria-label="Text style" multiple={props.multiple}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function Range(props: { value?: string }) {
  return (
    <ToggleGroup aria-label="Range" defaultValue={[props.value ?? "day"]}>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}

const pill = () =>
  document.querySelector<HTMLElement>('[data-slot="toggle-group-indicator"]')

/**
 * jsdom lays nothing out, so every `offsetLeft` and `offsetWidth` is 0 and the sliding pill has
 * nothing to follow. These give each segment a width and its place in the track — the only two
 * numbers the indicator reads — so the slide itself can be asserted rather than only its classes.
 */
const SEGMENT = 60
const originals = new Map<string, PropertyDescriptor>()

function stubLayout() {
  const segments = (element: HTMLElement) =>
    [...(element.parentElement?.children ?? [])].filter(
      (child) => (child as HTMLElement).dataset?.slot === "toggle-group-item"
    )
  for (const [name, get] of [
    [
      "offsetWidth",
      function (this: HTMLElement) {
        return this.dataset.slot === "toggle-group-item" ? SEGMENT : 0
      },
    ],
    [
      "offsetLeft",
      function (this: HTMLElement) {
        return Math.max(0, segments(this).indexOf(this)) * SEGMENT
      },
    ],
  ] as const) {
    const original = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      name
    )
    if (original) originals.set(name, original)
    Object.defineProperty(HTMLElement.prototype, name, {
      configurable: true,
      get,
    })
  }
}

afterEach(() => {
  for (const [name, descriptor] of originals)
    Object.defineProperty(HTMLElement.prototype, name, descriptor)
  originals.clear()
})

describe("ToggleGroup", () => {
  test("is a group of pressable toggles, single-select by default", async () => {
    render(<Styles />)
    const group = screen.getByRole("group", { name: "Text style" })
    expect(group).toHaveAttribute("data-slot", "toggle-group")
    const bold = screen.getByRole("button", { name: "Bold" })
    const italic = screen.getByRole("button", { name: "Italic" })
    await userEvent.click(bold)
    expect(bold).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(italic)
    expect(italic).toHaveAttribute("aria-pressed", "true")
    expect(bold).toHaveAttribute("aria-pressed", "false")
  })

  test("multiple lets several stay pressed, as in a font-attributes control", async () => {
    render(<Styles multiple />)
    await userEvent.click(screen.getByRole("button", { name: "Bold" }))
    await userEvent.click(screen.getByRole("button", { name: "Italic" }))
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  test("is the joined control: the platform's corner on the group, square items inside on the fill", () => {
    render(<Styles />)
    const group = screen.getByRole("group")
    expect(group.className).toContain("rounded-segmented")
    expect(group.className).toContain("bg-fill-3")
    expect(group.className).toContain("h-(--segmented-height)")
    expect(group.className).toContain("p-(--segmented-inset)")
    // The pill is positioned against the track, so the track is the containing block.
    expect(group.className).toContain("relative")
    const item = screen.getByRole("button", { name: "Bold" })
    expect(item).toHaveAttribute("data-slot", "toggle-group-item")
    expect(item.className).toContain(
      "rounded-[calc(var(--radius-segmented)-var(--segmented-inset))]"
    )
    expect(item.className).toContain("text-[length:var(--segmented-font)]")
    expect(item.className).toContain("font-medium")
    expect(item.className).toContain("data-pressed:font-semibold")
    expect(item.className).toContain(
      "data-pressed:text-(--toggle-group-pressed-text)"
    )
  })

  test("a pill slides to the pressed segment instead of the segment painting itself", () => {
    render(<Range />)
    const indicator = pill()!
    expect(indicator).not.toBeNull()
    expect(indicator.className).toContain("bg-(--toggle-group-pressed-bg)")
    expect(indicator.className).toContain(
      "shadow-(--toggle-group-pressed-shadow)"
    )
    expect(indicator.className).toContain(
      "rounded-[calc(var(--radius-segmented)-var(--segmented-inset))]"
    )
    expect(indicator.className).toContain("transition-[translate,width]")
    expect(indicator.className).toContain("motion-reduce:transition-none")
    // The segment no longer paints its own selection in a single-select group — the pill does,
    // and two of them would show the selection twice, one of them jumping.
    const item = screen.getByRole("button", { name: "Day" })
    expect(item.className).not.toMatch(/(^|\s)data-pressed:bg-/)
  })

  test("the pill takes the pressed segment's place in the track and follows it", async () => {
    stubLayout()
    render(<Range value="week" />)
    await waitFor(() => expect(pill()).not.toHaveAttribute("hidden"))
    expect(pill()!.style.getPropertyValue("--active-toggle-left")).toBe("60px")
    expect(pill()!.style.getPropertyValue("--active-toggle-width")).toBe("60px")
    await userEvent.click(screen.getByRole("button", { name: "Month" }))
    await waitFor(() =>
      expect(pill()!.style.getPropertyValue("--active-toggle-left")).toBe(
        "120px"
      )
    )
  })

  test("with nothing pressed there is nothing for the pill to mark, so it stays down", async () => {
    stubLayout()
    render(
      <ToggleGroup aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
      </ToggleGroup>
    )
    await waitFor(() => expect(pill()).toHaveAttribute("hidden"))
  })

  test("a multi-selection is painted on the segments, which one sliding pill cannot show", async () => {
    stubLayout()
    render(<Styles multiple />)
    await userEvent.click(screen.getByRole("button", { name: "Bold" }))
    await userEvent.click(screen.getByRole("button", { name: "Italic" }))
    expect(pill()).toHaveAttribute("hidden")
    const item = screen.getByRole("button", { name: "Bold" })
    expect(item.className).toContain(
      "group-data-multiple/toggle-group:data-pressed:bg-(--toggle-group-pressed-bg)"
    )
    expect(item.className).toContain(
      "group-data-multiple/toggle-group:data-pressed:shadow-(--toggle-group-pressed-shadow)"
    )
  })

  test("a segment too narrow for its label clips inside the track instead of painting outside it", () => {
    render(<Range />)
    const item = screen.getByRole("button", { name: "Day" })
    expect(item.className).toContain("min-w-(--segmented-height)")
    expect(item.className).toContain("overflow-hidden")
  })

  test("arrow keys walk the segments, the pill in the track notwithstanding", async () => {
    render(<Range />)
    screen.getByRole("button", { name: "Day" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Week" })
    )
    await userEvent.keyboard("{Enter}")
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })
})

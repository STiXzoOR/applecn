import { Wifi01Icon } from "@hugeicons/core-free-icons"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { Icon } from "../src/components/icon"
import {
  List,
  ListRow,
  ListSection,
  listVariants,
} from "../src/components/list"

describe("List", () => {
  test("an inset grouped list is sections of rows on the grouped card with a sentence-case header", () => {
    render(
      <List aria-label="Settings">
        <ListSection header="Connections" footer="Wi-Fi is on.">
          <ListRow
            leading={<Icon icon={Wifi01Icon} />}
            title="Wi-Fi"
            value="Home"
            accessory="disclosure"
            href="/wifi"
          />
          <ListRow title="Airplane Mode" />
        </ListSection>
      </List>
    )
    const list = screen.getByRole("group", { name: "Settings" })
    expect(list).toHaveAttribute("data-slot", "list")
    expect(list).toHaveAttribute("data-style", "inset-grouped")
    expect(screen.getByRole("list")).toHaveAttribute(
      "data-slot",
      "list-section-group"
    )
    const group = screen
      .getByText("Wi-Fi")
      .closest('[data-slot="list-section-group"]')!
    expect(group.className).toContain("mx-(--list-inset)")
    expect(group.className).toContain("rounded-list")
    expect(group.className).toContain("bg-card")
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    const header = screen.getByText("Connections")
    expect(header.className).toContain("text-[length:var(--list-header-font)]")
    expect(header.className).toContain("font-(--list-header-font-weight)")
    expect(header.className).toContain("text-label-2")
    expect(screen.getByText("Wi-Fi is on.").className).toContain(
      "text-[length:var(--list-footer-font)]"
    )
  })

  test("rows are at least 44 pt, link rows are links, and a disclosure row shows a chevron", () => {
    render(
      <List aria-label="Settings">
        <ListSection>
          <ListRow
            title="Wi-Fi"
            value="Home"
            accessory="disclosure"
            href="/wifi"
          />
        </ListSection>
      </List>
    )
    const row = screen.getByRole("link", { name: /Wi-Fi/ })
    expect(row).toHaveAttribute("href", "/wifi")
    expect(row.className).toContain("min-h-(--list-row-min-height)")
    expect(row.className).toContain("px-(--list-row-padding-x)")
    expect(row.className).toContain("py-(--list-row-padding-y)")
    expect(row.className).toContain("text-[length:var(--list-font)]")
    expect(row.querySelector('[data-slot="list-row-accessory"]')).not.toBeNull()
    expect(screen.getByText("Home").className).toContain("text-label-2")
  })

  test("a checkmark row reports its selection and calls back when pressed", async () => {
    const onClick = vi.fn()
    render(
      <List aria-label="Sort" style="plain">
        <ListSection role="radiogroup">
          <ListRow
            title="Date"
            accessory="checkmark"
            checked
            onClick={onClick}
          />
          <ListRow
            title="Name"
            accessory="checkmark"
            checked={false}
            onClick={onClick}
          />
        </ListSection>
      </List>
    )
    expect(screen.getByRole("radio", { name: "Date" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    await userEvent.click(screen.getByRole("radio", { name: "Name" }))
    expect(onClick).toHaveBeenCalled()
  })

  test("list styles", () => {
    expect(listVariants({ style: "plain" })).not.toContain("mx-(--list-inset)")
    expect(listVariants({ style: "sidebar" })).toContain("gap-1")
  })
})

describe("List composes Item", () => {
  test("a row is an Item underneath, so shadcn markup drops in", () => {
    render(
      <List>
        <ListSection>
          <ListRow title="Wi-Fi" />
        </ListSection>
      </List>
    )
    const row = screen.getByText("Wi-Fi").closest('[data-slot="item"]')
    expect(row).not.toBeNull()
  })

  /**
   * The row took `leading-snug` from this file because `item`'s own leading was dead and a row
   * with no leading at all would have inherited one. `item` now writes the measured
   * `--type-body-leading` beside its font size, where it survives the merge, and a `leading-snug`
   * written here would outrank it — `className` is merged last. Measured in a browser on the list
   * docs page: a plain single-line row was 53.375 px and is 52, which is the published metric.
   */
  test("a row takes item's measured leading, and does not overrule it", () => {
    render(
      <List>
        <ListSection>
          <ListRow title="Wi-Fi" />
        </ListSection>
      </List>
    )
    const row = screen.getByText("Wi-Fi").closest('[data-slot="item"]')!
    expect(row.className).not.toContain("leading-snug")
    expect(row.className).toContain("leading-(--type-body-leading)")
  })

  test("the inset grouped list keeps its 26 pt corners", () => {
    render(
      <List style="inset-grouped">
        <ListSection>
          <ListRow title="A" />
        </ListSection>
      </List>
    )
    expect(
      screen.getByText("A").closest('[data-slot="list-section-group"]')!
        .className
    ).toContain("rounded-list")
  })
})

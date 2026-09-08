import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../src/components/item"
import { checkA11y } from "./helpers/axe"

describe("Item", () => {
  test("lays media, content and actions across a row", () => {
    render(
      <Item>
        <ItemMedia data-testid="media" />
        <ItemContent>
          <ItemTitle>Wi-Fi</ItemTitle>
          <ItemDescription>Connected</ItemDescription>
        </ItemContent>
        <ItemActions>
          <button type="button">Info</button>
        </ItemActions>
      </Item>
    )
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument()
    expect(screen.getByText("Connected")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Info" })).toBeInTheDocument()
    expect(screen.getByTestId("media")).toHaveAttribute(
      "data-slot",
      "item-media"
    )
  })

  test("is Apple's list row: 52 pt minimum, 15 × 16 padding", () => {
    render(
      <Item data-testid="row">
        <ItemTitle>A</ItemTitle>
      </Item>
    )
    const row = screen.getByTestId("row")
    expect(row.className).toContain("min-h-(--list-row-min-height)")
    expect(row.className).toContain("px-(--list-row-padding-x)")
    expect(row.className).toContain("py-(--list-row-padding-y)")
    expect(row).toHaveAttribute("data-slot", "item")
  })

  test("a group separates its rows", () => {
    render(
      <ItemGroup data-testid="group">
        <Item>
          <ItemTitle>A</ItemTitle>
        </Item>
        <ItemSeparator data-testid="separator" />
        <Item>
          <ItemTitle>B</ItemTitle>
        </Item>
      </ItemGroup>
    )
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-slot",
      "item-group"
    )
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-slot",
      "item-separator"
    )
  })

  test("renders as what it is told to be, so a row can be a link", () => {
    render(
      <Item render={<a href="/wi-fi" />}>
        <ItemTitle>Wi-Fi</ItemTitle>
      </Item>
    )
    const link = screen.getByRole("link", { name: "Wi-Fi" })
    expect(link).toHaveAttribute("data-slot", "item")
    expect(link.className).toContain("min-h-(--list-row-min-height)")
  })

  test("a header and a footer take a line of their own", () => {
    render(
      <Item>
        <ItemHeader data-testid="header">Yesterday</ItemHeader>
        <ItemTitle>A</ItemTitle>
        <ItemFooter data-testid="footer">2 items</ItemFooter>
      </Item>
    )
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-slot",
      "item-header"
    )
    expect(screen.getByTestId("header").className).toContain("basis-full")
    expect(screen.getByTestId("footer")).toHaveAttribute(
      "data-slot",
      "item-footer"
    )
    expect(screen.getByTestId("footer").className).toContain("basis-full")
  })

  test("media is the icon tile, and takes artwork as well", () => {
    render(
      <>
        <ItemMedia data-testid="icon" />
        <ItemMedia data-testid="artwork" variant="image" />
      </>
    )
    expect(screen.getByTestId("icon").className).toContain(
      "size-(--list-icon-tile)"
    )
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-variant",
      "default"
    )
    expect(screen.getByTestId("artwork")).toHaveAttribute(
      "data-variant",
      "image"
    )
    expect(screen.getByTestId("artwork").className).toContain("object-cover")
  })

  test("has no accessibility violations", async () => {
    const { container } = render(
      <ItemGroup>
        <Item>
          <ItemTitle>A</ItemTitle>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemTitle>B</ItemTitle>
        </Item>
      </ItemGroup>
    )
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { cn } from "cn"
import { describe, expect, test, vi } from "vitest"

import { buttonVariants } from "../src/components/button"
import {
  PageControl,
  pageControlVariants,
} from "../src/components/page-control"
import { PaginationContent, PaginationLink } from "../src/components/pagination"

describe("PageControl", () => {
  test("is a row of 7 pt dots 9 pt apart with the current page filled", () => {
    render(<PageControl aria-label="Pages" count={4} index={1} />)
    const list = screen.getByRole("tablist", { name: "Pages" })
    expect(list).toHaveAttribute("data-slot", "page-control")
    expect(list.className).toContain("gap-(--page-control-gap)")
    const dots = screen.getAllByRole("tab")
    expect(dots).toHaveLength(4)
    expect(dots[1]).toHaveAttribute("aria-selected", "true")
    expect(dots[0]!.className).toContain("size-(--page-control-dot)")
    expect(dots[0]!.className).toContain("aria-selected:bg-label")
  })

  test("pressing a dot and arrow keys change the page", async () => {
    const onIndexChange = vi.fn()
    render(
      <PageControl
        aria-label="Pages"
        count={3}
        index={0}
        onIndexChange={onIndexChange}
      />
    )
    await userEvent.click(screen.getAllByRole("tab")[2]!)
    expect(onIndexChange).toHaveBeenLastCalledWith(2)
    screen.getAllByRole("tab")[0]!.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
  })

  test("the prominent background is a thin-material capsule", () => {
    expect(pageControlVariants({ background: "prominent" })).toContain(
      "material-thin"
    )
    expect(pageControlVariants({ background: "prominent" })).toContain(
      "rounded-full"
    )
    expect(pageControlVariants({ background: "minimal" })).not.toContain(
      "material"
    )
  })
})

/**
 * Spec §5.6 gave `page-control` a `pagination` base. Spiked and abandoned: the two components
 * share the idea of a row of page markers and nothing else — not the element, not the semantics,
 * not the API, and not one measured value. `pagination` is a `<nav>` of anchors a person follows;
 * a page control is a tablist of 7 pt dots that moves a paged view it sits over.
 *
 * The dot's own class string is the claim, and each assertion below is the spike.
 */
describe("PageControl cannot be rebuilt on pagination", () => {
  const dot = (): HTMLElement => {
    render(<PageControl aria-label="Pages" count={3} index={0} />)
    return screen.getAllByRole("tab")[0]!
  }

  test("a dot is a button in a tablist; a pagination link is an anchor in a nav", () => {
    expect(dot().tagName).toBe("BUTTON")
    // A dot is selected within a set; a pagination link is the page you are currently on.
    expect(dot()).toHaveAttribute("aria-selected", "true")
    expect(dot()).not.toHaveAttribute("aria-current")
    render(
      <PaginationLink href="#2" isActive>
        2
      </PaginationLink>
    )
    const link = screen.getByRole("link", { name: "2" })
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("aria-current", "page")
    // `PaginationLink` takes no `render`, so the element cannot be changed; an anchor with no
    // `href` is not focusable, and a dot has nowhere to navigate to.
    render(<PaginationContent>rows</PaginationContent>)
    expect(
      document.querySelector('[data-slot="pagination-content"]')!.tagName
    ).toBe("UL")
  })

  test("the control's own numbers are the ones a small button would overrule", () => {
    expect(dot().className).toContain("size-(--page-control-dot)")
    expect(dot().className).not.toContain("h-(--control-height-small)")
    // 7 pt on iOS and macOS, 8 on the web, against a 28 / 20 / 28 pt control.
    const composed = cn(
      buttonVariants({ variant: "plain", size: "small", shape: "circle" }),
      "size-(--page-control-dot) bg-label-4 aria-selected:bg-label"
    )
    // The size wins, and so far so good. What comes with it does not.
    expect(composed).toContain("size-(--page-control-dot)")
    // A button's transparent hairline and padding-box clip survive, and they eat the dot: a 7 pt
    // circle paints 5 pt of fill inside a 1 px border it never asked for.
    expect(composed).toContain("border-transparent")
    expect(composed).toContain("bg-clip-padding")
    // So does a button's press: a dot does not shrink or dim under the finger.
    expect(composed).toContain("active:scale-(--button-active-scale)")
    expect(composed).toContain("active:opacity-80")
    // And a control's type, on an element that holds no text at all.
    expect(composed).toContain("text-[length:var(--control-font-small)]")
  })

  test("the row's gap is measured, and the keyboard is the control's own", async () => {
    const onIndexChange = vi.fn()
    render(
      <PageControl
        aria-label="Pages"
        count={3}
        index={1}
        onIndexChange={onIndexChange}
      />
    )
    const list = screen.getByRole("tablist", { name: "Pages" })
    expect(list.className).toContain("gap-(--page-control-gap)")
    // `PaginationContent` is `gap-1` — 4 px against the measured 10 / 10 / 8.
    render(<PaginationContent>rows</PaginationContent>)
    expect(
      document.querySelector('[data-slot="pagination-content"]')!.className
    ).toContain("gap-1")
    // Nothing in `pagination` moves between pages: it has no value, no index and no keys. The
    // control's `count` / `index` / `onIndexChange` and its Home / End / arrows are its own.
    screen.getAllByRole("tab")[1]!.focus()
    await userEvent.keyboard("{Home}")
    expect(onIndexChange).toHaveBeenLastCalledWith(0)
  })
})

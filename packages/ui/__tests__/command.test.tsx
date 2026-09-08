import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../src/components/command"
import { tokenPlatformCss } from "../src/tokens/css"
import { checkA11y } from "./helpers/axe"

function Spotlight() {
  return (
    <Command label="Spotlight">
      <CommandInput placeholder="Spotlight Search" />
      <CommandList>
        <CommandEmpty>No Results</CommandEmpty>
        <CommandGroup heading="Applications">
          <CommandItem>
            Calendar
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem>Reminders</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">
          <CommandItem>Budget.numbers</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

describe("Command", () => {
  test("is a search field over a list of results", () => {
    render(<Spotlight />)
    const input = screen.getByPlaceholderText("Spotlight Search")
    expect(input).toHaveAttribute("data-slot", "command-input")
    expect(
      input.closest('[data-slot="command-input-wrapper"]'),
      "shadcn wraps the field, and a shadcn user's CSS targets that wrapper"
    ).not.toBeNull()
    // Spotlight's field is flush with a rule under it, not a bezel inside the palette's bezel.
    const wrapper = input.closest('[data-slot="command-input-wrapper"]')!
    expect(wrapper.className).toContain("h-(--text-field-height)")
    expect(wrapper.className).toContain("border-b-[0.5px]")
    expect(wrapper.className).toContain("border-separator")
    const list = screen.getByRole("listbox")
    expect(list).toHaveAttribute("data-slot", "command-list")
    expect(screen.getAllByRole("option")).toHaveLength(3)
    expect(screen.getByText("Calendar").closest("[data-slot]")).toHaveAttribute(
      "data-slot",
      "command-item"
    )
  })

  test("stamps every data-slot shadcn does", () => {
    const { container } = render(<Spotlight />)
    for (const slot of [
      "command",
      "command-input-wrapper",
      "command-input",
      "command-list",
      "command-group",
      "command-item",
      "command-shortcut",
      "command-separator",
    ])
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
        slot
      ).not.toBeNull()
  })

  test("filters as you type, and says so when nothing matches", async () => {
    render(<Spotlight />)
    const input = screen.getByPlaceholderText("Spotlight Search")
    await userEvent.type(input, "cal")
    expect(screen.getByText("Calendar")).toBeVisible()
    expect(screen.queryByText("Reminders")).toBeNull()
    await userEvent.clear(input)
    await userEvent.type(input, "zzz")
    const empty = screen.getByText("No Results")
    expect(empty).toHaveAttribute("data-slot", "command-empty")
  })

  test("a result row is a menu row, highlighted the way a menu highlights", () => {
    render(<Spotlight />)
    const item = screen.getByText("Calendar").closest("[data-slot]")!
    expect(item.className).toContain("h-(--menu-item-height)")
    expect(item.className).toContain("rounded-menu-item")
    expect(item.className).toContain("px-(--menu-item-px)")
    expect(item.className).toContain(
      "data-[selected=true]:bg-(--menu-item-highlight-bg)"
    )
    // cmdk always writes the attribute, true or false, so the rule has to read its value.
    expect(item).toHaveAttribute("data-selected")
    const shortcut = screen.getByText("⌘1")
    expect(shortcut).toHaveAttribute("data-slot", "command-shortcut")
    expect(shortcut.className).toContain("ms-auto")
  })

  test("the separator and the group heading read the menu's own metrics", () => {
    const { container } = render(<Spotlight />)
    const separator = container.querySelector(
      '[data-slot="command-separator"]'
    )!
    expect(separator.className).toContain("h-(--menu-separator-height)")
    expect(separator.className).toContain("bg-(--menu-separator-bg)")
    // cmdk gives it `role="separator"`, which ARIA forbids inside its own `role="listbox"`.
    // Spec §3.2: the role goes, the grouping is already announced by the group's own role.
    expect(separator).toHaveAttribute("role", "none")
    const group = container.querySelector('[data-slot="command-group"]')!
    expect(group.className).toContain("[&_[cmdk-group-heading]]:text-label-2")
    expect(screen.getByText("Applications")).toBeVisible()
  })

  test("a caller can take the separator role back", () => {
    const { container } = render(
      <Command label="Spotlight">
        <CommandList>
          <CommandSeparator role="separator" />
        </CommandList>
      </Command>
    )
    expect(
      container.querySelector('[data-slot="command-separator"]')
    ).toHaveAttribute("role", "separator")
  })

  /**
   * The palette is not in a positioner, so it has no `--available-height` to cap itself with —
   * and a cap that resolves to nothing leaves `max-height: none`, which never lets
   * `overflow-y-auto` engage. `CommandDialog` then pins a `position: fixed` popup at `top-1/3`
   * with no height of its own, and every result below the fold is unreachable: no scrollbar on
   * the list, and no page scroll to reach it with. So the ceiling has to be one the token scopes
   * actually deliver.
   */
  test("the result list caps its own height with a token every idiom delivers", () => {
    render(<Spotlight />)
    const list = screen.getByRole("listbox")
    expect(list.className).toContain("max-h-(--command-list-max-height)")
    expect(list.className).toContain("overflow-y-auto")
    for (const platform of ["ios", "macos", "web"] as const) {
      const scopes = tokenPlatformCss(platform) as Record<
        string,
        Record<string, string>
      >
      const value =
        scopes[`[data-platform="${platform}"]`]?.["--command-list-max-height"]
      expect(
        value,
        `${platform} delivers --command-list-max-height`
      ).toBeTruthy()
      // A real length, not a chain that ends nowhere: the rows are the measured menu row.
      expect(value).toContain("var(--menu-item-height)")
    }
  })

  test("has no accessibility violations", async () => {
    const { container } = render(<Spotlight />)
    expect(await checkA11y(container)).toHaveNoViolations()
  })
})

describe("CommandDialog", () => {
  function Palette(props: {
    showCloseButton?: boolean
    title?: string
    description?: string
  }) {
    return (
      <CommandDialog open {...props}>
        <CommandInput placeholder="Spotlight Search" />
        <CommandList>
          <CommandItem>Calendar</CommandItem>
        </CommandList>
      </CommandDialog>
    )
  }

  test("floats the palette in a dialog named for assistive technology", async () => {
    render(<Palette />)
    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveAccessibleName("Command Palette")
    expect(dialog).toHaveAccessibleDescription("Search for a command to run...")
    // shadcn's stable variant wraps the children in `Command`; its Base UI base at the recorded
    // commit does not, which leaves `cmdk` with no root at all.
    const root = dialog.querySelector('[data-slot="command"]')!
    expect(root).not.toBeNull()
    // The material rides the root, not the dialog: `dialogPopupClassName` already sets a bg.
    expect(root.className).toContain("glass")
    expect(dialog.className).toContain("bg-transparent")
    // Spotlight sits high on the screen, not centred, and holds no padding of its own.
    expect(dialog.className).toContain("top-1/3")
    expect(dialog.className).toContain("p-0")
  })

  test("the title and description are the caller's when given", async () => {
    render(<Palette title="Go to file" description="Type a file name" />)
    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveAccessibleName("Go to file")
    expect(dialog).toHaveAccessibleDescription("Type a file name")
  })

  test("names nothing visible: the header is for assistive technology only", async () => {
    render(<Palette />)
    const dialog = await screen.findByRole("dialog")
    const header = dialog.querySelector('[data-slot="dialog-header"]')!
    expect(
      header,
      "the header belongs inside the dialog, or it leaks into the page"
    ).not.toBeNull()
    expect(header.className).toContain("sr-only")
  })

  test("shows no close button unless asked, as shadcn does", async () => {
    const plain = render(<Palette />)
    expect(await screen.findByRole("dialog")).toBeVisible()
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
    plain.unmount()
    render(<Palette showCloseButton />)
    await screen.findByRole("dialog")
    expect(screen.getByRole("button", { name: "Close" })).toBeVisible()
  })

  test("has no accessibility violations", async () => {
    render(<Palette />)
    const dialog = await screen.findByRole("dialog")
    expect(await checkA11y(dialog)).toHaveNoViolations()
  })
})

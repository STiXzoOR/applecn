"use client"

import {
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Icon } from "./icon"

/**
 * A searchable list of commands (shadcn's Command, on `cmdk`). Apple's is Spotlight: a field you
 * type into and a list of results under it, where a result row is a menu row — the same
 * `--menu-item-height`, `--menu-item-radius` and highlight the pull-down menu uses, because that
 * is what Spotlight's rows are. `CommandDialog` floats the same palette a third of the way down
 * the screen, on glass, the way Spotlight arrives.
 */
function Command({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex size-full flex-col overflow-hidden", className)}
      {...props}
    />
  )
}

/**
 * Spotlight's field: a magnifier and the text, flush across the top of the palette with a hairline
 * under it — no bezel, because Spotlight's field has none. That is also the shape shadcn's stable
 * variant draws; its Base UI base puts the field in an `InputGroup` capsule instead, which is a
 * bezel inside a bezel here and clips against the iOS panel's 34 pt corner. `command-input-wrapper`
 * is a `data-slot` neither project stamps from an export of its own.
 */
function CommandInput({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-(--text-field-height) shrink-0 items-center gap-2 border-b-[0.5px] border-separator px-3"
    >
      <Icon icon={Search01Icon} className="shrink-0 text-label-2" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex-1 bg-transparent text-[length:var(--text-field-font)] text-label outline-hidden placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * The results, and the only thing in the palette that scrolls. The ceiling is applecn's own
 * `--command-list-max-height` rather than the `--available-height` the menu-shaped lists cap
 * themselves with: that variable comes out of a Base UI positioner measuring the space around an
 * anchor, and the palette has no anchor and no positioner — inside `CommandDialog` it is a fixed
 * popup pinned a third of the way down. Read there it resolves to nothing, `max-height` stays
 * `none`, `overflow-y-auto` never engages and the results below the fold cannot be reached at
 * all. The token is eight menu rows plus the palette's own padding, so the cap follows the row
 * height each idiom draws: 360 px on iOS and the web, 202 px on macOS.
 */
function CommandList({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-(--command-list-max-height) overflow-x-hidden overflow-y-auto p-(--menu-padding)",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "py-6 text-center text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * The heading is `cmdk`'s own element rather than a child of ours, so it is dressed through it —
 * on the same tokens `DropdownMenuLabel` reads.
 */
function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-(--menu-item-px) [&_[cmdk-group-heading]]:py-(--menu-label-py) [&_[cmdk-group-heading]]:text-[length:var(--menu-label-font-size)] [&_[cmdk-group-heading]]:leading-(--menu-label-leading) [&_[cmdk-group-heading]]:font-(--menu-label-weight) [&_[cmdk-group-heading]]:tracking-(--menu-label-tracking) [&_[cmdk-group-heading]]:text-label-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * The rule between groups. `cmdk` gives it `role="separator"`, which ARIA does not permit inside
 * the `role="listbox"` its own `Command.List` renders — axe fails `aria-required-children` on
 * shadcn's markup and applecn's alike. Spec §3.2: the divergence is `role="none"`, the smallest
 * one that removes the degradation, and nothing is lost by it — `Command.Group` already announces
 * each group through an inner `role="group"` labelled by its heading, so the separator is
 * decoration beside semantics that already exist. (`item`'s ruling rejected `role="none"` on
 * `ItemSeparator` because there the separator WAS the structure; here it is not.) A caller who
 * wants the role back passes `role="separator"`.
 */
function CommandSeparator({
  className,
  role = "none",
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  // `cmdk` writes its own `role` after the props it is handed, so `asChild` is the only way past
  // it — and it keeps what the primitive is for: the rule disappears while a search is running,
  // unless `alwaysRender` says otherwise.
  return (
    <CommandPrimitive.Separator {...props} asChild>
      <div
        data-slot="command-separator"
        role={role}
        className={cn(
          "mx-(--menu-separator-mx) my-1 h-(--menu-separator-height) shrink-0 bg-(--menu-separator-bg)",
          className
        )}
      />
    </CommandPrimitive.Separator>
  )
}

/**
 * A result. `cmdk` writes `data-selected` and `data-disabled` with a value on every row rather
 * than only on the current one, so both rules read the value rather than the attribute.
 */
function CommandItem({
  className,
  children,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex h-(--menu-item-height) cursor-default items-center gap-(--menu-item-gap) rounded-menu-item px-(--menu-item-px) text-[length:var(--menu-font)] text-label outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-(--menu-item-highlight-bg) data-[selected=true]:text-(--menu-item-highlight-text) data-[selected=true]:[&_[data-slot=command-shortcut]]:text-(--menu-shortcut-highlight-text) [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <Icon
        icon={Tick02Icon}
        weight="bold"
        className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-[length:var(--menu-font)] text-label-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * The palette on glass, a third of the way down. Three departures from shadcn's Base UI variant,
 * all internal — the exports, the slots and the props are shadcn's exactly:
 *
 * - The children are wrapped in `Command`, as shadcn's own stable variant does. The Base UI base
 *   at the recorded commit dropped that wrapper, which leaves `CommandInput` and `CommandList`
 *   with no `cmdk` root — its own `command-dialog` example cannot render.
 * - The header renders INSIDE `DialogContent`. shadcn renders it as a sibling, which in Base UI
 *   puts the title and description in the page rather than in the dialog, where they are read
 *   aloud with the surrounding page and stay in the DOM after the palette closes.
 * - `showCloseButton` is honoured here rather than passed down, because applecn's `DialogContent`
 *   does not take it yet (Task 59 owns that). The button is the same round dismiss `sheet` draws.
 *
 * The material sits on the `Command` root rather than on `DialogContent`: `dialogPopupClassName`
 * carries `bg-popover`, and `glass` sets a background of its own, so the two would race in the
 * cascade. The dialog keeps the geometry and the shadow and paints nothing.
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 gap-0 overflow-hidden bg-transparent p-0",
          className
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className="glass">{children}</Command>
        {showCloseButton ? (
          <DialogClose
            data-slot="dialog-close"
            className="absolute end-4 top-4"
            render={<Button variant="gray" size="small" shape="circle" />}
          >
            <Icon icon={Cancel01Icon} weight="bold" className="size-3" />
            <span className="sr-only">Close</span>
          </DialogClose>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}

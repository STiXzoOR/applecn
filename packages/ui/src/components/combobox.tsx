"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import { useRef } from "react"

import { Icon } from "./icon"

/**
 * A combo box (HIG › Combo boxes): a text field that also offers a list of suggestions,
 * filtered as the person types — the App Store's search suggestions, AppKit's NSComboBox. The
 * field is the platform's bordered text field; the list a glass menu with the platform's rows.
 * Pass `items` to the root and render each with the `ComboboxList` function child.
 */
const Combobox = ComboboxPrimitive.Root

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-field"
      className="relative flex w-full items-center"
    >
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        className={cn(
          "h-(--text-field-height) w-full min-w-0 rounded-field border-(length:--combobox-field-border-width) border-(--combobox-field-border-color) bg-background-3 ps-2 pe-14 text-[length:var(--text-field-font)] text-label shadow-(--combobox-field-shadow) transition-[box-shadow] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40",
          className
        )}
        {...props}
      />
      <span className="absolute inset-y-0 end-1 flex items-center gap-0.5">
        <ComboboxPrimitive.Clear
          data-slot="combobox-clear"
          aria-label="Clear"
          className="flex size-5 items-center justify-center rounded-full bg-gray-3 text-white outline-none data-disabled:hidden"
        >
          <Icon icon={Cancel01Icon} weight="bold" className="size-2.5" />
        </ComboboxPrimitive.Clear>
        <ComboboxTrigger />
      </span>
    </ComboboxPrimitive.InputGroup>
  )
}

/** The chevron that drops the whole list, whatever has been typed. `ComboboxInput` renders one. */
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      aria-label="Show suggestions"
      className={cn(
        "flex size-6 items-center justify-center rounded-sm text-label-2 outline-none hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    >
      {children ?? (
        <ComboboxPrimitive.Icon
          render={<Icon icon={ArrowDown01Icon} weight="semibold" />}
        />
      )}
    </ComboboxPrimitive.Trigger>
  )
}

/** What is selected. With `multiple`, its function child is where the chips are drawn. */
function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-elevated=""
          className={cn(
            "z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-(--menu-width) origin-(--transform-origin) flex-col overflow-hidden rounded-menu glass p-(--menu-padding) text-label duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("flex flex-col overflow-y-auto", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "group/combobox-item flex h-(--menu-item-height) shrink-0 cursor-default items-center gap-2 rounded-menu-item ps-2 pe-4 text-[length:var(--menu-font)] text-label outline-none select-none data-highlighted:bg-(--menu-item-highlight-bg) data-highlighted:text-(--menu-item-highlight-text) data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-primary group-data-highlighted/combobox-item:text-(--combobox-item-indicator-highlight-text)">
        <ComboboxPrimitive.ItemIndicator
          render={<Icon icon={Tick02Icon} weight="bold" />}
        />
      </span>
      <span className="flex-1 truncate">{children}</span>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-4 py-3 text-[length:var(--menu-font)] text-label-2 empty:hidden",
        className
      )}
      {...props}
    />
  )
}

function ComboboxGroup(props: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />
}

/**
 * The heading over a group of rows. shadcn calls this `ComboboxLabel` — its `ComboboxLabel` wraps
 * Base UI's `GroupLabel`, not the field's own label — and `ComboboxGroupLabel` is kept as an alias
 * so the name applecn shipped with still reaches it.
 */
function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-(--menu-item-px) py-(--menu-label-py) text-[length:var(--menu-label-font-size)] leading-(--menu-label-leading) font-(--menu-label-weight) tracking-(--menu-label-tracking) text-label-2",
        className
      )}
      {...props}
    />
  )
}

const ComboboxGroupLabel = ComboboxLabel

/** A run of rows sharing one source, so a group can hold more than the list it renders. */
function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

/** The menu's own hairline, between two runs of rows. */
function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "mx-(--menu-separator-mx) my-1 h-(--menu-separator-height) shrink-0 bg-(--menu-separator-bg)",
        className
      )}
      {...props}
    />
  )
}

/**
 * The field a `multiple` combo box wears instead of a plain input: the same bordered box, holding
 * the chips and the input together — Mail's address field.
 */
function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-(--text-field-height) w-full flex-wrap items-center gap-1 rounded-field border-(length:--combobox-field-border-width) border-(--combobox-field-border-color) bg-background-3 p-1 text-[length:var(--text-field-font)] text-label shadow-(--combobox-field-shadow) focus-within:ring-4 focus-within:ring-ring/60",
        className
      )}
      {...props}
    />
  )
}

/** One selection, as a token with its own remove button. */
function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & { showRemove?: boolean }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-6 items-center gap-0.5 rounded-full bg-fill-3 ps-2.5 pe-0.5 type-footnote text-label select-none data-highlighted:bg-primary data-highlighted:text-white",
        className
      )}
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          aria-label="Remove"
          className="flex size-5 items-center justify-center rounded-full text-label-2 outline-none hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          <Icon icon={Cancel01Icon} weight="bold" className="size-2.5" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  )
}

/** The input that sits among the chips — borderless, because `ComboboxChips` is the field. */
function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "h-6 min-w-16 flex-1 bg-transparent px-1 outline-none placeholder:text-placeholder",
        className
      )}
      {...props}
    />
  )
}

/**
 * An anchor for a chips field's list, so the popup lines up with the whole box rather than the
 * input wandering inside it. shadcn's is exactly this ref; pass it to `ComboboxChips` and to
 * `ComboboxContent`'s `anchor`.
 */
function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}

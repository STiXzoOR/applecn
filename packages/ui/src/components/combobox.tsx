"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "cn"

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
          "h-(--text-field-height) w-full min-w-0 rounded-field border-[0.5px] border-separator bg-background-3 ps-2 pe-14 text-[length:var(--text-field-font)] text-label transition-[box-shadow] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-40 macos:shadow-control web:border web:border-label-4",
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
        <ComboboxPrimitive.Trigger
          data-slot="combobox-trigger"
          aria-label="Show suggestions"
          className="flex size-6 items-center justify-center rounded-sm text-label-2 outline-none hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          <ComboboxPrimitive.Icon
            render={<Icon icon={ArrowDown01Icon} weight="semibold" />}
          />
        </ComboboxPrimitive.Trigger>
      </span>
    </ComboboxPrimitive.InputGroup>
  )
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
            "z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-(--menu-width) origin-(--transform-origin) flex-col overflow-hidden rounded-menu glass p-(--menu-padding) text-label shadow-glass duration-(--duration-overlay) ease-(--ease-standard) outline-none motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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
        "flex h-(--menu-item-height) shrink-0 cursor-default items-center gap-2 rounded-menu-item ps-2 pe-4 text-[length:var(--menu-font)] text-label outline-none select-none data-highlighted:bg-fill-3 data-disabled:opacity-40 macos:data-highlighted:bg-selection macos:data-highlighted:text-white",
        className
      )}
      {...props}
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-primary macos:group-data-highlighted:text-white">
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

function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "px-4 py-2 type-footnote text-label-2 macos:px-2.5 macos:py-1 macos:type-caption-1 macos:font-semibold",
        className
      )}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
}

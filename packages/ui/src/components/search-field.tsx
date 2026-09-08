"use client"

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import { useRef, useState, type ComponentProps } from "react"

import { Icon } from "./icon"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"

/**
 * The search field (HIG › Search fields). iOS 26: the 44 pt capsule on the tertiary fill with
 * the magnifier at 12 pt, a "Search" placeholder, the clear button once there is text, and the
 * Cancel button while editing; macOS 26: AppKit's 24 pt capsule on the bezel; the web the App
 * Store's 32 px field. Escape clears; Cancel clears and ends editing.
 *
 * The capsule is shadcn's `InputGroup` (spec §5.6). Apple's search capsule IS the combined field —
 * a surface with affordances inside it — so the group draws it and this file writes only the
 * numbers where Apple's search metrics differ from the text field's: the 44 pt height against the
 * field's 34, the capsule radius against the field's 5 pt corners, the tertiary fill, the leading
 * padding and the shadow. Everything else the group already had. The magnifier and the clear
 * button are `InputGroupAddon`s, which is where the click-to-focus behaviour comes from — tapping
 * the magnifier in Apple's capsule puts the caret in the box, and this file no longer implements
 * that. The box is `InputGroupInput`.
 *
 * Measured in a browser on all three idioms, 2026-09-08: the composed capsule resolves to the same
 * radius, padding, fill, hairline, shadow, gap and type size as the hand-written one it replaces.
 * Two of the group's own classes are overruled rather than inherited, both deliberately —
 * `flex-wrap`, because a search capsule is one line and a wrapped clear button is not a thing Apple
 * draws, and the control's `focus-visible` ring, because `input-group` lights the whole capsule and
 * not the text inside it, which is what its own doc comment says and what this field already did.
 *
 * The Apple `data-slot` values stay on top of the group's, exactly as shadcn's own `ItemSeparator`
 * stamps `item-separator` over `Separator`'s slot.
 */
type SearchFieldProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Show the Cancel button while editing (iOS). */
  showsCancelButton?: boolean
  cancelLabel?: string
}

function SearchField({
  className,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Search",
  showsCancelButton = true,
  cancelLabel = "Cancel",
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internal, setInternal] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const current = value ?? internal
  const editing = focused || current !== ""

  const update = (next: string) => {
    setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="search-field-root"
      className={cn("flex w-full items-center gap-2", className)}
    >
      <InputGroup
        data-slot="search-field"
        className="h-(--search-field-height) flex-1 flex-nowrap rounded-search border-(length:--search-field-border-width) border-(--search-field-border-color) bg-(--search-field-bg) ps-(--search-field-padding-start) pe-2 shadow-(--search-field-shadow) transition-[box-shadow] focus-within:ring-3 focus-within:ring-ring/50"
      >
        <InputGroupAddon>
          <Icon
            icon={Search01Icon}
            data-slot="search-field-icon"
            className="text-label-2"
          />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="search"
          data-slot="search-field-input"
          className="focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          placeholder={placeholder}
          value={current}
          onValueChange={update}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") update("")
            onKeyDown?.(event)
          }}
          {...props}
        />
        {current !== "" ? (
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear text"
              data-slot="search-field-clear"
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-3 text-white outline-none"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => update("")}
            >
              <Icon icon={Cancel01Icon} weight="bold" className="size-2.5" />
            </button>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {showsCancelButton && editing ? (
        <button
          type="button"
          data-slot="search-field-cancel"
          className="shrink-0 px-1 text-[length:var(--text-field-font)] text-primary outline-none focus-visible:ring-4 focus-visible:ring-ring/60 active:opacity-60"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            update("")
            setFocused(false)
            inputRef.current?.blur()
          }}
        >
          {cancelLabel}
        </button>
      ) : null}
    </div>
  )
}

export { SearchField }
export type { SearchFieldProps }

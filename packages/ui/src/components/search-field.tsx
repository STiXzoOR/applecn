"use client"

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { useRef, useState, type ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * The search field (HIG › Search fields): a 36 pt capsule on the tertiary fill with the
 * magnifier, a "Search" placeholder, the clear button once there is text, and the Cancel
 * button while editing. Escape clears; Cancel clears and ends editing.
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
      <span
        data-slot="search-field"
        className="flex h-(--search-field-height) flex-1 items-center gap-1.5 rounded-full bg-fill-3 px-2 type-body text-label transition-[box-shadow] duration-(--duration-hover) focus-within:ring-3 focus-within:ring-ring/50"
      >
        <Icon
          icon={Search01Icon}
          data-slot="search-field-icon"
          className="text-label-2"
        />
        <input
          ref={inputRef}
          type="search"
          data-slot="search-field-input"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          placeholder={placeholder}
          value={current}
          onChange={(event) => update(event.target.value)}
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
        ) : null}
      </span>
      {showsCancelButton && editing ? (
        <button
          type="button"
          data-slot="search-field-cancel"
          className="shrink-0 px-1 type-body text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-60"
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

'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { useState } from 'react'

import { Icon } from './icon'

/**
 * The text field (HIG › Text fields). `rounded` is the iOS standalone field on the tertiary
 * fill, `plain` the field inside a list row, `bordered` the macOS bezelled field. `clearable`
 * adds the iOS clear button at the trailing end once there is text.
 */
const inputVariants = cva(
  'type-body w-full min-w-0 text-label transition-[box-shadow,background-color] duration-(--duration-hover) outline-none placeholder:text-placeholder focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 file:type-subheadline file:me-2 file:border-0 file:bg-transparent file:font-medium',
  {
    variants: {
      variant: {
        rounded: 'h-(--text-field-height) rounded-lg bg-fill-3 px-3',
        plain: 'h-(--text-field-height) bg-transparent px-0',
        bordered: 'h-(--text-field-height) rounded-md border border-input bg-background px-2 shadow-control',
      },
    },
    defaultVariants: {
      variant: 'rounded',
    },
  },
)

type InputProps = InputPrimitive.Props &
  VariantProps<typeof inputVariants> & {
    /** Show the iOS clear button while the field has text. */
    clearable?: boolean
    /** Called after the clear button empties the field; controlled inputs set their value here. */
    onClear?: () => void
  }

function Input({
  className,
  variant = 'rounded',
  clearable = false,
  onClear,
  value,
  defaultValue,
  onValueChange,
  ...props
}: InputProps) {
  const [internal, setInternal] = useState<string>(String(defaultValue ?? ''))
  const current = value !== undefined ? String(value) : internal

  if (!clearable) {
    return (
      <InputPrimitive
        data-slot="input"
        data-variant={variant}
        className={cn(inputVariants({ variant }), className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        {...props}
      />
    )
  }

  return (
    <span data-slot="input-clearable" className="relative inline-flex w-full items-center">
      <InputPrimitive
        data-slot="input"
        data-variant={variant}
        className={cn(inputVariants({ variant }), 'pe-9', className)}
        value={current}
        onValueChange={(next, details) => {
          setInternal(next)
          onValueChange?.(next, details)
        }}
        {...props}
      />
      {current !== '' ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear text"
          data-slot="input-clear"
          className="absolute inset-y-0 end-2 my-auto flex size-5 items-center justify-center rounded-full bg-gray-3 text-white outline-none"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setInternal('')
            onClear?.()
          }}
        >
          <Icon icon={Cancel01Icon} weight="bold" className="size-2.5" />
        </button>
      ) : null}
    </span>
  )
}

export { Input, inputVariants }
export type { InputProps }

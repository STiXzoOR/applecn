'use client'

import { Field as FieldPrimitive } from '@base-ui/react/field'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * A form field: label, control, description and error, wired together by Base UI so the
 * control is named by the label and described by the description and the error.
 */
function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn('group/field flex w-full flex-col gap-1.5 data-disabled:opacity-40', className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn('type-body flex w-fit items-center gap-2 text-label select-none', className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn('type-footnote text-label-2', className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error data-slot="field-error" className={cn('type-footnote text-destructive', className)} {...props} />
  )
}

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('flex w-full flex-col gap-4', className)} {...props} />
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel }

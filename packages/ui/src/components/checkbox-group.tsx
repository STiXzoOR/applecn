"use client"

import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"
import { cn } from "cn"
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"

/**
 * A checkbox group (HIG › Toggles, checkboxes on macOS): a set of checkboxes that share a
 * value, optionally under a `parent` checkbox that turns them all on or off and shows the
 * mixed state while they differ — the macOS "text style" hierarchy. Pass `allValues` so the
 * parent knows the whole set.
 */
type CheckboxGroupProps = CheckboxGroupPrimitive.Props & {
  "aria-label"?: string
  /** A `Checkbox` rendered above the group that controls every child. */
  parent?: ReactElement
  children?: ReactNode
}

function CheckboxGroup({
  className,
  parent,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {parent && isValidElement(parent)
        ? cloneElement(parent as ReactElement<{ parent?: boolean }>, {
            parent: true,
          })
        : null}
      <div
        data-slot="checkbox-group-items"
        className={cn("flex flex-col gap-3", parent && "ps-8")}
      >
        {children}
      </div>
    </CheckboxGroupPrimitive>
  )
}

export { CheckboxGroup }
export type { CheckboxGroupProps }

'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from 'cn'

import { Icon } from './icon.tsx'

/**
 * The checkbox (HIG › Toggles). On iOS it is the 22 pt circle of a list in selection mode; on
 * macOS the 14 pt rounded square — the same classes, switched by the platform tokens and the
 * `macos:` variant. Supports the mixed state for a checkbox that controls a group.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer group/checkbox relative flex size-(--checkbox-size) shrink-0 items-center justify-center rounded-full border-[1.5px] border-gray-3 bg-transparent text-primary-foreground transition-[background-color,border-color] duration-(--duration-press) ease-(--ease-standard) outline-none macos:rounded-[3.5px] after:absolute after:-inset-2 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current group-data-indeterminate/checkbox:[&_svg]:hidden"
      >
        <Icon icon={Tick02Icon} weight="bold" scale="medium" className="size-[70%]" />
        <span
          aria-hidden="true"
          className="hidden h-[1.5px] w-[50%] rounded-full bg-current group-data-indeterminate/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

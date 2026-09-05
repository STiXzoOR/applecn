'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon, UnfoldMoreIcon } from '@hugeicons/core-free-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

import { Icon } from './icon.tsx'

/**
 * The menu picker (HIG › Pickers, Pop-up buttons). The `plain` trigger reads as a tinted value
 * with chevrons, the way an inline picker does in an iOS list; `popup` is the macOS pop-up
 * button. The popup is a glass menu with leading check marks (iOS 26). Pass `items` to the
 * root (`{ value: label }`) so the trigger shows the label while the popup is closed.
 */
const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" className={cn('scroll-my-1 p-1', className)} {...props} />
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" className={cn('flex flex-1 truncate text-start', className)} {...props} />
}

const selectTriggerVariants = cva(
  'type-body flex w-fit items-center justify-between gap-1.5 whitespace-nowrap transition-[color,box-shadow,background-color] duration-(--duration-hover) outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/30 data-placeholder:text-placeholder [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        plain: 'rounded-md px-1 text-primary hover:opacity-70',
        popup: 'h-(--text-field-height) rounded-lg bg-fill-3 px-3 text-label hover:bg-fill-2 macos:shadow-control macos:rounded-md macos:bg-background',
      },
    },
    defaultVariants: {
      variant: 'plain',
    },
  },
)

function SelectTrigger({
  className,
  variant = 'plain',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-variant={variant}
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<Icon icon={UnfoldMoreIcon} weight="semibold" data-slot="select-trigger-icon" className="text-label-2" />}
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'glass relative isolate z-50 max-h-(--available-height) min-w-(--menu-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-4xl p-1 text-label shadow-menu duration-(--duration-overlay) ease-(--ease-standard) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          {children}
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('type-footnote px-3 py-2 text-label-2', className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'type-body relative flex h-(--menu-item-height) w-full cursor-default items-center gap-2 rounded-3xl pe-4 ps-2 text-label outline-hidden select-none data-highlighted:bg-fill-3 data-disabled:pointer-events-none data-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-primary">
        <SelectPrimitive.ItemIndicator render={<Icon icon={Tick02Icon} weight="bold" data-slot="select-item-indicator" />} />
      </span>
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-2 bg-fill-4', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn('top-0 z-10 flex w-full cursor-default items-center justify-center py-1 text-label-2', className)}
      {...props}
    >
      <Icon icon={ArrowUp01Icon} weight="semibold" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({ className, ...props }: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn('bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 text-label-2', className)}
      {...props}
    >
      <Icon icon={ArrowDown01Icon} weight="semibold" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}

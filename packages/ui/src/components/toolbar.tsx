'use client'

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar'
import type { IconSvgElement } from '@hugeicons/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { createContext, useContext, type ComponentProps } from 'react'

import { Icon } from './icon'

/**
 * Toolbars (HIG › Toolbars) under Liquid Glass: items sit in floating glass groups, each a
 * capsule of 44 pt circular buttons; a lone button is its own glass circle; the one
 * `prominent` action (Done, Submit) is tinted and sits at the trailing edge.
 */
const GroupContext = createContext(false)

type ToolbarProps = ToolbarPrimitive.Root.Props & {
  placement?: 'top' | 'bottom'
}

function Toolbar({ className, placement = 'top', ...props }: ToolbarProps) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      data-placement={placement}
      className={cn('flex min-h-(--toolbar-height) items-center gap-2 px-4', placement === 'bottom' && 'pb-[env(safe-area-inset-bottom)]', className)}
      {...props}
    />
  )
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <GroupContext.Provider value={true}>
      <ToolbarPrimitive.Group data-slot="toolbar-group" className={cn('glass flex items-center gap-1 rounded-full p-1', className)} {...props} />
    </GroupContext.Provider>
  )
}

const toolbarButtonVariants = cva(
  'pressable flex size-(--control-height-regular) shrink-0 items-center justify-center rounded-full outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40 [&_svg]:size-6',
  {
    variants: {
      prominent: {
        true: 'glass-prominent',
        false: 'text-primary hover:bg-fill-4',
      },
      grouped: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [{ prominent: false, grouped: false, class: 'glass' }],
    defaultVariants: {
      prominent: false,
      grouped: false,
    },
  },
)

type ToolbarButtonProps = ToolbarPrimitive.Button.Props &
  Omit<VariantProps<typeof toolbarButtonVariants>, 'grouped'> & {
    icon?: IconSvgElement
  }

function ToolbarButton({ className, prominent = false, icon, children, ...props }: ToolbarButtonProps) {
  const grouped = useContext(GroupContext)
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      data-prominent={prominent || undefined}
      className={cn(toolbarButtonVariants({ prominent, grouped }), className)}
      {...props}
    >
      {icon ? <Icon icon={icon} weight="semibold" /> : null}
      {children}
    </ToolbarPrimitive.Button>
  )
}

function ToolbarSeparator({ className, ...props }: ToolbarPrimitive.Separator.Props) {
  return <ToolbarPrimitive.Separator data-slot="toolbar-separator" className={cn('mx-1 h-6 w-[0.5px] bg-separator', className)} {...props} />
}

type ToolbarSpacerProps = ComponentProps<'div'> & {
  kind?: 'flexible' | 'fixed'
}

function ToolbarSpacer({ className, kind = 'flexible', ...props }: ToolbarSpacerProps) {
  return (
    <div
      data-slot="toolbar-spacer"
      data-kind={kind}
      aria-hidden="true"
      className={cn(kind === 'flexible' ? 'flex-1' : 'w-5 shrink-0', className)}
      {...props}
    />
  )
}

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer, toolbarButtonVariants }
export type { ToolbarButtonProps, ToolbarProps, ToolbarSpacerProps }

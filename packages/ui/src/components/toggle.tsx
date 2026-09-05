'use client'

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

/**
 * A toggle button (HIG › Toggles, outside lists): a button whose pressed state is the tinted
 * fill, the way the Phone app's filter button lights up. Use a `Switch` inside list rows.
 */
const toggleVariants = cva(
  'group/toggle inline-flex shrink-0 items-center justify-center gap-1.5 bg-transparent font-semibold whitespace-nowrap text-foreground transition-[background-color,transform,opacity] duration-(--duration-press) ease-(--ease-standard) outline-none select-none hover:bg-fill-4 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 data-pressed:bg-primary/15 data-pressed:text-primary motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        mini: 'type-caption-1 h-(--control-height-mini) min-w-(--control-height-mini) px-2.5',
        small: 'type-subheadline h-(--control-height-small) min-w-(--control-height-small) px-3',
        regular: 'type-body h-(--control-height-regular) min-w-(--control-height-regular) px-4',
        large: 'type-body h-(--control-height-large) min-w-(--control-height-large) px-5',
        xl: 'type-title-3 h-(--control-height-xl) min-w-(--control-height-xl) px-6',
      },
      shape: {
        capsule: 'rounded-full',
        rounded: 'rounded-lg',
        circle: 'aspect-square rounded-full px-0',
      },
    },
    defaultVariants: {
      size: 'regular',
      shape: 'capsule',
    },
  },
)

type ToggleProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>

function Toggle({ className, size = 'regular', shape = 'capsule', ...props }: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-size={size}
      data-shape={shape}
      className={cn(toggleVariants({ size, shape }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
export type { ToggleProps }

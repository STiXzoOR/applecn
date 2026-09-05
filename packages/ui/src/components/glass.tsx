import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * Liquid Glass: the functional layer that floats above content (tab bars, toolbars, sheets,
 * menus). `regular` keeps text legible over anything; `clear` shows more of a rich background
 * and expects a dimming layer over bright content; `prominent` is the one tinted action. The
 * default shape is a capsule, as on iOS 26; `interactive` adds the press feedback.
 */
const glassVariants = cva('relative', {
  variants: {
    variant: {
      regular: 'glass',
      clear: 'glass-clear',
      prominent: 'glass-prominent',
    },
    shape: {
      capsule: 'rounded-full',
      rounded: 'rounded-4xl',
      circle: 'aspect-square rounded-full',
    },
    interactive: {
      true: 'pressable',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'regular',
    shape: 'capsule',
    interactive: false,
  },
})

type GlassProps = ComponentProps<'div'> & VariantProps<typeof glassVariants>

function Glass({ className, variant = 'regular', shape = 'capsule', interactive = false, ...props }: GlassProps) {
  return (
    <div
      data-slot="glass"
      data-variant={variant}
      data-shape={shape}
      className={cn(glassVariants({ variant, shape, interactive }), className)}
      {...props}
    />
  )
}

export { Glass, glassVariants }
export type { GlassProps }

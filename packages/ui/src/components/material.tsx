import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * A content-layer material: a translucent surface that blurs what is behind it. Thicker
 * materials give text more contrast; thinner ones keep the background present. For bars,
 * sheets and menus use `Glass` instead.
 */
const materialVariants = cva('', {
  variants: {
    thickness: {
      'ultra-thin': 'material-ultra-thin',
      thin: 'material-thin',
      regular: 'material-regular',
      thick: 'material-thick',
    },
  },
  defaultVariants: {
    thickness: 'regular',
  },
})

type MaterialProps = ComponentProps<'div'> & VariantProps<typeof materialVariants>

function Material({ className, thickness = 'regular', ...props }: MaterialProps) {
  return (
    <div
      data-slot="material"
      data-thickness={thickness}
      className={cn(materialVariants({ thickness }), className)}
      {...props}
    />
  )
}

export { Material, materialVariants }
export type { MaterialProps }

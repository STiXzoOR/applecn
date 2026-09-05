'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

/**
 * Apple's half-point hairline. `inset="leading"` starts the line after a row's leading content
 * (the iOS list separator); `inset="both"` keeps it inside the row's padding on both sides.
 */
const separatorVariants = cva(
  'shrink-0 bg-separator data-horizontal:h-[0.5px] data-vertical:w-[0.5px] data-vertical:self-stretch',
  {
    variants: {
      inset: {
        none: '',
        leading: 'ms-(--list-row-padding-x)',
        both: 'mx-(--list-row-padding-x)',
      },
    },
    defaultVariants: {
      inset: 'none',
    },
  },
)

type SeparatorProps = SeparatorPrimitive.Props & VariantProps<typeof separatorVariants>

function Separator({ className, orientation = 'horizontal', inset = 'none', ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separatorVariants({ inset }), className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
export type { SeparatorProps }

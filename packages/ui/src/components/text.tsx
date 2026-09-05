import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps, ElementType } from 'react'

import { textStyleNames, type TextStyleName } from '../tokens/typography.ts'

/**
 * A label. `variant` is one of Apple's eleven text styles (size, leading and weight come from
 * the platform's type scale), `color` one of the label roles, and `emphasized` the style's own
 * emphasized weight (SwiftUI `.bold()`), which differs per style.
 */
const textVariants = cva('', {
  variants: {
    variant: {
      'large-title': 'type-large-title',
      'title-1': 'type-title-1',
      'title-2': 'type-title-2',
      'title-3': 'type-title-3',
      headline: 'type-headline',
      body: 'type-body',
      callout: 'type-callout',
      subheadline: 'type-subheadline',
      footnote: 'type-footnote',
      'caption-1': 'type-caption-1',
      'caption-2': 'type-caption-2',
    } satisfies Record<TextStyleName, string>,
    color: {
      label: 'text-label',
      'label-2': 'text-label-2',
      'label-3': 'text-label-3',
      'label-4': 'text-label-4',
      tint: 'text-primary',
      destructive: 'text-destructive',
      inherit: 'text-inherit',
    },
    emphasized: {
      true: '',
      false: '',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  compoundVariants: textStyleNames.map((name) => ({
    variant: name,
    emphasized: true,
    class: `font-(--type-${name}-emphasized)`,
  })),
  defaultVariants: {
    variant: 'body',
    color: 'label',
    emphasized: false,
    truncate: false,
  },
})

type TextProps = Omit<ComponentProps<'p'>, 'color'> &
  VariantProps<typeof textVariants> & {
    /** The element to render; a heading level for titles, `span` for inline labels. */
    as?: ElementType
  }

function Text({
  as: Component = 'p',
  className,
  variant = 'body',
  color = 'label',
  emphasized = false,
  truncate = false,
  ...props
}: TextProps) {
  return (
    <Component
      data-slot="text"
      data-variant={variant}
      className={cn(textVariants({ variant, color, emphasized, truncate }), className)}
      {...props}
    />
  )
}

export { Text, textVariants }
export type { TextProps }

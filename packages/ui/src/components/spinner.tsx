import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * The activity indicator (HIG › Progress indicators): eight bars fading around a circle,
 * stepping once per bar. `medium` and `large` are UIKit's 20 and 37 pt. Stops under reduced
 * motion and stays a static glyph.
 */
const spinnerVariants = cva(
  'relative inline-block shrink-0 animate-spin text-label-2 [animation-duration:0.8s] [animation-timing-function:steps(8)] motion-reduce:animate-none motion-reduce:[&>*]:animate-none',
  {
    variants: {
      size: {
        medium: 'size-(--spinner-medium)',
        large: 'size-(--spinner-large)',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

const BARS = [0, 1, 2, 3, 4, 5, 6, 7] as const

type SpinnerProps = ComponentProps<'span'> &
  VariantProps<typeof spinnerVariants> & {
    /** The accessible name; "Loading" by default. */
    label?: string
  }

function Spinner({ className, size = 'medium', label = 'Loading', ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      data-size={size}
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      {BARS.map((i) => (
        <span
          key={i}
          data-slot="spinner-bar"
          aria-hidden="true"
          className="absolute inset-0"
          style={{ transform: `rotate(${i * 45}deg)`, opacity: 1 - i / 8 }}
        >
          <span className="absolute top-0 left-1/2 h-[30%] w-[10%] -translate-x-1/2 rounded-full bg-current" />
        </span>
      ))}
    </span>
  )
}

export { Spinner, spinnerVariants }
export type { SpinnerProps }

"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * The switch (HIG › Toggles): 51×31 pt with a 27 pt thumb on iOS, 38×22 on macOS, from the
 * platform tokens. On is system green by default; `color="tint"` uses the accent colour. Use it
 * in list rows, where the row text is the label.
 */
const switchVariants = cva(
  "peer group/switch relative inline-flex h-(--switch-height) w-(--switch-width) shrink-0 items-center rounded-full transition-[background-color] duration-(--duration-hover) ease-(--ease-standard) outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-unchecked:bg-fill data-disabled:cursor-not-allowed data-disabled:opacity-40",
  {
    variants: {
      color: {
        green: "data-checked:bg-system-green",
        tint: "data-checked:bg-primary",
      },
    },
    defaultVariants: {
      color: "green",
    },
  }
)

type SwitchProps = SwitchPrimitive.Root.Props &
  VariantProps<typeof switchVariants>

function Switch({ className, color = "green", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-color={color}
      className={cn(switchVariants({ color }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none mx-[2px] block size-(--switch-thumb) rounded-full bg-white shadow-thumb transition-transform duration-(--duration-hover) ease-(--ease-standard) data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb)-4px)] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
export type { SwitchProps }

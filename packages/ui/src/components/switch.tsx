"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * The switch (HIG › Toggles). iOS 26: a 63×28 track with a 37×24 oval Liquid Glass knob inset
 * 2 pt that stretches while pressed; macOS 26: 54×24 with a 31×20 knob; Apple's web apps keep
 * the 51×31 switch. All from the platform tokens. On is system green by default, `color="tint"`
 * the accent colour; off is the tertiary label. Use it in list rows, where the row text is the
 * label.
 */
const switchVariants = cva(
  "peer group/switch relative inline-flex h-(--switch-height) w-(--switch-width) shrink-0 items-center rounded-full transition-[background-color] duration-(--duration-hover) ease-(--ease-standard) outline-none focus-visible:ring-4 focus-visible:ring-ring/60 data-unchecked:bg-label-3 data-disabled:cursor-not-allowed data-disabled:opacity-40",
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
        className="pointer-events-none absolute start-(--switch-inset) block h-(--switch-thumb-height) w-(--switch-thumb-width) knob group-active/switch:w-[calc(var(--switch-thumb-width)+6px)] data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb-width)-2*var(--switch-inset))] group-active/switch:data-checked:translate-x-[calc(var(--switch-width)-var(--switch-thumb-width)-2*var(--switch-inset)-6px)] rtl:data-checked:-translate-x-[calc(var(--switch-width)-var(--switch-thumb-width)-2*var(--switch-inset))] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
export type { SwitchProps }

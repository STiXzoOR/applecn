import { UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

import { Icon } from "./icon"

/**
 * The platform's own menu, opened by the platform (shadcn's NativeSelect). It is `<select>`,
 * so iOS presents `UIPickerView`'s compact wheel and macOS the `NSPopUpButton` menu, and the
 * chrome around it is the pop-up button bezel `select`'s `popup` trigger already draws: the
 * control height and corner, the pop-up fill, hairline and shadow, with the up-and-down
 * chevrons parked at the trailing edge.
 *
 * Reach for this over `select` when the native menu is wanted — a long list on a phone, a form
 * that must post without JavaScript. `select` is the styled Base UI menu.
 *
 * `className` dresses the WRAPPER, not the `<select>`, exactly as it does in shadcn.
 */
const nativeSelectVariants = cva(
  "w-full appearance-none border-(length:--select-popup-border-width) border-(--select-popup-border-color) bg-(--select-popup-bg) text-label shadow-(--select-popup-shadow) transition-[background-color,box-shadow] duration-(--duration-hover) outline-none hover:bg-(--select-popup-hover-bg) focus-visible:ring-4 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default:
          "h-(--control-height-regular) rounded-(--control-radius-regular) ps-(--control-padding-x-regular) pe-7 text-[length:var(--control-font-regular)]",
        sm: "h-(--control-height-small) rounded-(--control-radius-small) ps-(--control-padding-x-small) pe-6 text-[length:var(--control-font-small)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type NativeSelectProps = Omit<ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants>

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={nativeSelectVariants({ size })}
        {...props}
      />
      <Icon
        icon={UnfoldMoreIcon}
        weight="semibold"
        data-slot="native-select-icon"
        aria-hidden="true"
        className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-label-2 select-none"
      />
    </div>
  )
}

/**
 * A row of the native menu. `Canvas`/`CanvasText` are shadcn's: the platform paints the popup
 * itself, and a colour of ours would fight it.
 */
function NativeSelectOption({ className, ...props }: ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

/** A titled section of it, the way a pull-down menu groups its commands. */
function NativeSelectOptGroup({
  className,
  ...props
}: ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  nativeSelectVariants,
}

"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
} from "react"

import { Icon } from "./icon"
import { InputGroup } from "./input-group"
import { Label } from "./label"

/**
 * A number field: a text field holding a number, with − and + and a draggable label.
 *
 * Derived from ReUI's `number-field` (https://reui.io/r/number-field.json, `keenthemes/reui`,
 * MIT) under spec §5.7.1, which sanctions ReUI where shadcn ships no primitive at all — shadcn's
 * Base UI registry has none, so this has no parity-ledger row and nothing here diverges from
 * shadcn. The six exports, their `data-slot` values, the `sm`/`default`/`lg` sizes and the scrub
 * area's cursor are ReUI's; the behaviour is Base UI's `number-field`, which already solves
 * increment, decrement, clamping, wheel and drag scrubbing.
 *
 * None of the numbers are ReUI's. Apple's number field IS the combined field, so the group is
 * `input-group` — the same `--text-field-height`, `rounded-field`, `--input-border-*`,
 * `--input-shadow` and `--text-field-font` the text field draws — and `sm` and `lg` step it to
 * the measured small and large control heights and fonts rather than to ReUI's `h-7`/`h-9`. No
 * token was added and no value changed.
 */
const NumberFieldContext = createContext<{
  fieldId: string
  size: "sm" | "default" | "lg"
} | null>(null)

function useNumberField(component: string) {
  const context = useContext(NumberFieldContext)
  if (!context)
    throw new Error(`${component} must be used within a NumberField component.`)
  return context
}

/**
 * `default` adds nothing: `input-group` already IS the field height and the field type, so the
 * variant only has something to say where Apple steps the control up or down.
 */
const numberFieldGroupVariants = cva("justify-between", {
  variants: {
    size: {
      sm: "h-(--control-height-small) text-[length:var(--control-font-small)]",
      default: "",
      lg: "h-(--control-height-large) text-[length:var(--control-font-large)]",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

/** One in-field affordance, the shape `input-group` gives a button inside the field. */
const numberFieldButtonVariants = cva(
  "flex shrink-0 items-center justify-center self-stretch px-2 text-label transition-[background-color] duration-(--duration-press) outline-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-inset active:bg-fill-2 disabled:pointer-events-none disabled:opacity-30"
)

const numberFieldInputVariants = cva(
  "min-w-0 flex-1 bg-transparent text-center tabular-nums outline-none placeholder:text-placeholder"
)

function NumberField({
  id,
  className,
  size = "default",
  ...props
}: NumberFieldPrimitive.Root.Props &
  VariantProps<typeof numberFieldGroupVariants>) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const resolved = size ?? "default"
  const context = useMemo(
    () => ({ fieldId, size: resolved }),
    [fieldId, resolved]
  )
  return (
    <NumberFieldContext.Provider value={context}>
      <NumberFieldPrimitive.Root
        id={fieldId}
        data-slot="number-field"
        data-size={resolved}
        className={cn("flex w-full flex-col items-start gap-2", className)}
        {...props}
      />
    </NumberFieldContext.Provider>
  )
}

/**
 * The field surface. `render` hands Base UI's group to `InputGroup`, so the chrome is the
 * primitive's rather than a second copy of it, and this file writes only what a size changes.
 */
function NumberFieldGroup({
  className,
  size: sizeProp,
  ...props
}: NumberFieldPrimitive.Group.Props &
  Partial<VariantProps<typeof numberFieldGroupVariants>>) {
  const context = useNumberField("NumberFieldGroup")
  const size = sizeProp ?? context.size
  return (
    <NumberFieldPrimitive.Group
      render={<InputGroup />}
      data-slot="number-field-group"
      className={cn(numberFieldGroupVariants({ size }), className)}
      {...props}
    />
  )
}

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  useNumberField("NumberFieldDecrement")
  return (
    <NumberFieldPrimitive.Decrement
      aria-label="Decrement"
      data-slot="number-field-decrement"
      className={cn(numberFieldButtonVariants(), className)}
      {...props}
    >
      {children ?? <Icon icon={MinusSignIcon} weight="bold" />}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  useNumberField("NumberFieldIncrement")
  return (
    <NumberFieldPrimitive.Increment
      aria-label="Increment"
      data-slot="number-field-increment"
      className={cn(numberFieldButtonVariants(), className)}
      {...props}
    >
      {children ?? <Icon icon={PlusSignIcon} weight="bold" />}
    </NumberFieldPrimitive.Increment>
  )
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  useNumberField("NumberFieldInput")
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(numberFieldInputVariants(), className)}
      {...props}
    />
  )
}

/**
 * ReUI's scrub area: the label is the drag handle, which is Base UI's own pattern for a number
 * field, and the cursor is ReUI's asset.
 */
function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & { label: string }) {
  const { fieldId } = useNumberField("NumberFieldScrubArea")
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("flex cursor-ew-resize", className)}
      {...props}
    >
      <Label className="cursor-ew-resize" htmlFor={fieldId}>
        {label}
      </Label>
      <NumberFieldPrimitive.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
        <CursorGrowIcon />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  )
}

function CursorGrowIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  )
}

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
  numberFieldButtonVariants,
  numberFieldGroupVariants,
  numberFieldInputVariants,
}

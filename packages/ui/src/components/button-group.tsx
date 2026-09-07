import { cn } from "cn"
import type { ComponentProps } from "react"

/**
 * A button group: adjacent buttons joined into one control, as AppKit's segmented push
 * buttons and apple.com's paired actions. Only the outer corners keep the platform's radius;
 * a hairline separates the segments. Give it an `aria-label` that names the set.
 */
function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit items-stretch [&>*]:relative [&>*:focus-visible]:z-10",
        orientation === "horizontal"
          ? "[&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-[0.5px] [&>*:not(:first-child)]:border-s-separator [&>*:not(:last-child)]:rounded-e-none"
          : "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-[0.5px] [&>*:not(:first-child)]:border-t-separator [&>*:not(:last-child)]:rounded-b-none",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }

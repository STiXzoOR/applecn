"use client"

import {
  ArrowRight01Icon,
  InformationCircleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react"

import { Icon } from "./icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./item"

/**
 * Lists (HIG › Lists and tables). `inset-grouped` is the iOS 26 Settings list: sections on
 * the grouped card, inset 20 pt from the edges on 26 pt corners, 52 pt rows with 15 × 16 pt
 * padding and separators that start after the leading content, 17 pt semibold title-case
 * headers and 13 pt footers — all from the platform tokens, so on macOS it is the 10 pt-corner
 * grouped form with 28 pt rows. `grouped` runs edge to edge, `plain` has no card, `sidebar` is
 * the compact navigation list.
 */
type ListStyle = "plain" | "grouped" | "inset-grouped" | "sidebar"

const StyleContext = createContext<ListStyle>("inset-grouped")

const listVariants = cva("flex flex-col", {
  variants: {
    style: {
      plain: "",
      grouped: "gap-9 py-4",
      "inset-grouped": "gap-9 py-4",
      sidebar: "gap-1 p-2",
    },
  },
  defaultVariants: {
    style: "inset-grouped",
  },
})

type ListProps = Omit<ComponentProps<"div">, "style"> &
  VariantProps<typeof listVariants>

function List({ className, style = "inset-grouped", ...props }: ListProps) {
  return (
    <StyleContext.Provider value={style ?? "inset-grouped"}>
      <div
        role="group"
        data-slot="list"
        data-style={style}
        className={cn(listVariants({ style }), className)}
        {...props}
      />
    </StyleContext.Provider>
  )
}

const groupVariants = cva("flex flex-col", {
  variants: {
    style: {
      plain: "",
      grouped: "bg-card",
      "inset-grouped": "mx-(--list-inset) overflow-hidden rounded-list bg-card",
      sidebar: "gap-0.5",
    },
  },
})

type ListSectionProps = Omit<ComponentProps<"section">, "title"> & {
  header?: ReactNode
  footer?: ReactNode
  /** A role for the row list, e.g. `radiogroup` for check-mark rows. */
  role?: string
}

function ListSection({
  className,
  header,
  footer,
  role,
  children,
  ...props
}: ListSectionProps) {
  const style = useContext(StyleContext)
  const edge =
    style === "inset-grouped"
      ? "px-[calc(var(--list-inset)+var(--list-row-padding-x))]"
      : "px-(--list-row-padding-x)"
  return (
    <section
      data-slot="list-section"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {header ? (
        <div
          data-slot="list-section-header"
          className={cn(
            "mb-2 text-[length:var(--list-header-font)] leading-snug font-(--list-header-font-weight) text-label-2",
            edge
          )}
        >
          {header}
        </div>
      ) : null}
      <ul
        data-slot="list-section-group"
        role={role}
        className={groupVariants({ style })}
      >
        {children}
      </ul>
      {footer ? (
        <div
          data-slot="list-section-footer"
          className={cn(
            "mt-2 text-[length:var(--list-footer-font)] leading-snug text-label-2",
            edge
          )}
        >
          {footer}
        </div>
      ) : null}
    </section>
  )
}

type ListRowProps = Omit<ComponentProps<"li">, "title" | "onClick"> & {
  /** An icon tile, image or control at the leading edge. */
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Secondary text at the trailing edge, before the accessory. */
  value?: ReactNode
  /** A control at the trailing edge, such as a `Switch`. */
  trailing?: ReactNode
  accessory?: "none" | "disclosure" | "checkmark" | "detail"
  /** For `checkmark` rows: the row is a radio and this is its state. */
  checked?: boolean
  href?: string
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
}

/**
 * A row is an `item` (§5.6): shadcn's `Item` is the row `list` used to draw itself, down to the
 * same `--list-row-min-height`, the same `--list-row-padding-x/y` and the same 2.5 gap, so the
 * row markup this file used to carry is now a composition of `Item`, `ItemMedia`, `ItemContent`,
 * `ItemTitle`, `ItemDescription` and `ItemActions`. The Apple-facing props are unchanged, and so
 * is every measured number — they are read one file over, in `item.tsx`.
 *
 * The `<li>` stays, and stays this file's own: it carries the list semantics `ItemGroup`
 * deliberately does not, and the leading-inset hairline, which Apple draws as a pseudo-element on
 * the row rather than as an element between rows.
 */
function ListRow({
  className,
  leading,
  title,
  subtitle,
  value,
  trailing,
  accessory = "none",
  checked,
  href,
  onClick,
  disabled = false,
  destructive = false,
  ...props
}: ListRowProps) {
  const interactive = Boolean(href || onClick)
  const radio = accessory === "checkmark" && checked !== undefined
  const render = href ? (
    <a href={href} aria-disabled={disabled || undefined} />
  ) : onClick ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...(radio ? { role: "radio", "aria-checked": checked } : {})}
    />
  ) : undefined

  return (
    <li
      data-slot="list-row"
      data-leading={leading ? "" : undefined}
      className={cn(
        'relative before:absolute before:end-0 before:top-0 before:h-[0.5px] before:bg-separator before:content-[""] first:before:hidden',
        leading
          ? "before:start-[calc(var(--list-row-padding-x)+var(--list-icon-tile)+0.625rem)]"
          : "before:start-(--list-row-padding-x)",
        className
      )}
      {...props}
    >
      <Item
        render={render}
        className={cn(
          // `leading-snug`, written again because `item`'s own is dead: `cn` merges a font-size
          // utility as conflicting with `leading-*`, and `itemVariants` puts `text-[length:…]`
          // in the size variant AFTER the base's `leading-snug`, so the base's is dropped. A row
          // written here survives, which is what keeps this rewrite pixel-for-pixel identical.
          "leading-snug",
          interactive &&
            "transition-[background-color] duration-(--duration-press) hover:bg-fill-4 active:bg-fill-3",
          destructive && "text-destructive",
          disabled && "pointer-events-none opacity-40"
        )}
      >
        {leading ? <ItemMedia>{leading}</ItemMedia> : null}
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
        </ItemContent>
        {value || trailing || accessory !== "none" ? (
          <ItemActions className="gap-2.5">
            {value ? (
              <span
                data-slot="list-row-value"
                className="shrink-0 truncate text-label-2"
              >
                {value}
              </span>
            ) : null}
            {trailing}
            {accessory !== "none" ? (
              <span
                data-slot="list-row-accessory"
                data-accessory={accessory}
                className="flex shrink-0 items-center"
              >
                {accessory === "disclosure" ? (
                  <Icon
                    icon={ArrowRight01Icon}
                    weight="semibold"
                    className="text-label-3"
                  />
                ) : null}
                {accessory === "checkmark" ? (
                  <Icon
                    icon={Tick02Icon}
                    weight="bold"
                    className={cn(
                      "text-primary",
                      checked ? "opacity-100" : "opacity-0"
                    )}
                  />
                ) : null}
                {accessory === "detail" ? (
                  <Icon icon={InformationCircleIcon} className="text-primary" />
                ) : null}
              </span>
            ) : null}
          </ItemActions>
        ) : null}
      </Item>
    </li>
  )
}

export { List, ListRow, ListSection, listVariants }
export type { ListProps, ListRowProps, ListSectionProps, ListStyle }

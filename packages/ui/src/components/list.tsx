'use client'

import { ArrowRight01Icon, InformationCircleIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'

import { Icon } from './icon'

/**
 * Lists (HIG › Lists and tables). `inset-grouped` is the Settings list: sections on the grouped
 * card, inset from the edges on the 26 pt radius, rows at least 44 pt with separators that
 * start after the leading content, sentence-case headers. `grouped` runs edge to edge, `plain`
 * has no card, `sidebar` is the compact navigation list.
 */
type ListStyle = 'plain' | 'grouped' | 'inset-grouped' | 'sidebar'

const StyleContext = createContext<ListStyle>('inset-grouped')

const listVariants = cva('flex flex-col', {
  variants: {
    style: {
      plain: '',
      grouped: 'gap-8 py-4',
      'inset-grouped': 'gap-8 py-4',
      sidebar: 'gap-1 p-2',
    },
  },
  defaultVariants: {
    style: 'inset-grouped',
  },
})

type ListProps = Omit<ComponentProps<'div'>, 'style'> & VariantProps<typeof listVariants>

function List({ className, style = 'inset-grouped', ...props }: ListProps) {
  return (
    <StyleContext.Provider value={style ?? 'inset-grouped'}>
      <div role="group" data-slot="list" data-style={style} className={cn(listVariants({ style }), className)} {...props} />
    </StyleContext.Provider>
  )
}

const groupVariants = cva('flex flex-col', {
  variants: {
    style: {
      plain: '',
      grouped: 'bg-card',
      'inset-grouped': 'mx-(--list-inset) overflow-hidden rounded-4xl bg-card',
      sidebar: 'gap-0.5',
    },
  },
})

type ListSectionProps = Omit<ComponentProps<'section'>, 'title'> & {
  header?: ReactNode
  footer?: ReactNode
  /** A role for the row list, e.g. `radiogroup` for check-mark rows. */
  role?: string
}

function ListSection({ className, header, footer, role, children, ...props }: ListSectionProps) {
  const style = useContext(StyleContext)
  const edge = style === 'inset-grouped' ? 'px-[calc(var(--list-inset)+var(--list-row-padding-x))]' : 'px-(--list-row-padding-x)'
  return (
    <section data-slot="list-section" className={cn('flex flex-col', className)} {...props}>
      {header ? (
        <div data-slot="list-section-header" className={cn('type-subheadline mb-2 text-label-2', edge)}>
          {header}
        </div>
      ) : null}
      <ul data-slot="list-section-group" role={role} className={groupVariants({ style })}>
        {children}
      </ul>
      {footer ? (
        <div data-slot="list-section-footer" className={cn('type-footnote mt-2 text-label-2', edge)}>
          {footer}
        </div>
      ) : null}
    </section>
  )
}

type ListRowProps = Omit<ComponentProps<'li'>, 'title' | 'onClick'> & {
  /** An icon tile, image or control at the leading edge. */
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Secondary text at the trailing edge, before the accessory. */
  value?: ReactNode
  /** A control at the trailing edge, such as a `Switch`. */
  trailing?: ReactNode
  accessory?: 'none' | 'disclosure' | 'checkmark' | 'detail'
  /** For `checkmark` rows: the row is a radio and this is its state. */
  checked?: boolean
  href?: string
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
}

function ListRow({
  className,
  leading,
  title,
  subtitle,
  value,
  trailing,
  accessory = 'none',
  checked,
  href,
  onClick,
  disabled = false,
  destructive = false,
  ...props
}: ListRowProps) {
  const interactive = Boolean(href || onClick)
  const rowClassName = cn(
    'type-body flex min-h-(--list-row-min-height) w-full items-center gap-3 px-(--list-row-padding-x) py-(--list-row-padding-y) text-start text-label',
    interactive && 'outline-none transition-[background-color] duration-(--duration-press) hover:bg-fill-4 focus-visible:bg-fill-4 active:bg-fill-3',
    destructive && 'text-destructive',
    disabled && 'pointer-events-none opacity-40',
  )

  const content = (
    <>
      {leading ? (
        <span data-slot="list-row-leading" className="flex size-(--list-icon-tile) shrink-0 items-center justify-center rounded-[7px] [&_svg]:size-[70%]">
          {leading}
        </span>
      ) : null}
      <span data-slot="list-row-content" className="flex min-w-0 flex-1 flex-col">
        <span data-slot="list-row-title" className="truncate">
          {title}
        </span>
        {subtitle ? (
          <span data-slot="list-row-subtitle" className="type-subheadline truncate text-label-2">
            {subtitle}
          </span>
        ) : null}
      </span>
      {value ? (
        <span data-slot="list-row-value" className="type-body shrink-0 truncate text-label-2">
          {value}
        </span>
      ) : null}
      {trailing ? (
        <span data-slot="list-row-trailing" className="flex shrink-0 items-center">
          {trailing}
        </span>
      ) : null}
      {accessory !== 'none' ? (
        <span data-slot="list-row-accessory" data-accessory={accessory} className="flex shrink-0 items-center">
          {accessory === 'disclosure' ? <Icon icon={ArrowRight01Icon} weight="semibold" className="text-label-3" /> : null}
          {accessory === 'checkmark' ? (
            <Icon icon={Tick02Icon} weight="bold" className={cn('text-primary', checked ? 'opacity-100' : 'opacity-0')} />
          ) : null}
          {accessory === 'detail' ? <Icon icon={InformationCircleIcon} className="text-primary" /> : null}
        </span>
      ) : null}
    </>
  )

  const radio = accessory === 'checkmark' && checked !== undefined

  return (
    <li
      data-slot="list-row"
      data-leading={leading ? '' : undefined}
      className={cn(
        'relative before:absolute before:end-0 before:top-0 before:h-[0.5px] before:bg-separator before:content-[""] first:before:hidden',
        leading ? 'before:start-[calc(var(--list-row-padding-x)+var(--list-icon-tile)+0.75rem)]' : 'before:start-(--list-row-padding-x)',
        className,
      )}
      {...props}
    >
      {href ? (
        <a href={href} className={rowClassName} aria-disabled={disabled || undefined}>
          {content}
        </a>
      ) : onClick ? (
        <button
          type="button"
          className={rowClassName}
          onClick={onClick}
          disabled={disabled}
          {...(radio ? { role: 'radio', 'aria-checked': checked } : {})}
        >
          {content}
        </button>
      ) : (
        <div className={rowClassName}>{content}</div>
      )}
    </li>
  )
}

export { List, ListRow, ListSection, listVariants }
export type { ListProps, ListRowProps, ListSectionProps, ListStyle }

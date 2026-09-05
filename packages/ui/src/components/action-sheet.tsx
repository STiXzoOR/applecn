'use client'

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cn } from 'cn'
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'

import { useIsDesktop } from '../hooks/use-media-query.ts'

/**
 * Action sheets (HIG › Action sheets): choices related to an action the person started. On a
 * phone a titled group of 56 pt rows rises from the bottom, destructive choices first, with
 * Cancel in its own group below. From `sm` up (iPad, desktop) it becomes a popover anchored to
 * the control and Cancel disappears: pressing outside dismisses.
 */
type Presentation = 'sheet' | 'popover'

const PresentationContext = createContext<Presentation>('sheet')

function ActionSheet(props: DrawerPrimitive.Root.Props) {
  const desktop = useIsDesktop()
  const presentation: Presentation = desktop ? 'popover' : 'sheet'
  return (
    <PresentationContext.Provider value={presentation}>
      {desktop ? (
        <PopoverPrimitive.Root data-slot="action-sheet" {...(props as PopoverPrimitive.Root.Props)} />
      ) : (
        <DrawerPrimitive.Root data-slot="action-sheet" swipeDirection="down" {...props} />
      )}
    </PresentationContext.Provider>
  )
}

function useActionSheetPresentation() {
  return useContext(PresentationContext)
}

function ActionSheetTrigger(props: DrawerPrimitive.Trigger.Props) {
  const presentation = useActionSheetPresentation()
  return presentation === 'popover' ? (
    <PopoverPrimitive.Trigger data-slot="action-sheet-trigger" {...(props as PopoverPrimitive.Trigger.Props)} />
  ) : (
    <DrawerPrimitive.Trigger data-slot="action-sheet-trigger" {...props} />
  )
}

type ActionSheetContentProps = ComponentProps<'div'> & {
  title?: ReactNode
  message?: ReactNode
}

function ActionSheetContent({ className, title, message, children, ...props }: ActionSheetContentProps) {
  const presentation = useActionSheetPresentation()
  const actions: ReactNode[] = []
  const cancels: ReactNode[] = []
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child && typeof child === 'object' && 'type' in child && child.type === ActionSheetCancel) cancels.push(child)
    else if (child) actions.push(child)
  }

  const header =
    title || message ? (
      <div data-slot="action-sheet-header" className="flex flex-col gap-0.5 px-4 py-3 text-center">
        {title ? (
          presentation === 'popover' ? (
            <PopoverPrimitive.Title data-slot="action-sheet-title" className="type-footnote font-semibold text-label-2">
              {title}
            </PopoverPrimitive.Title>
          ) : (
            <DrawerPrimitive.Title data-slot="action-sheet-title" className="type-footnote font-semibold text-label-2">
              {title}
            </DrawerPrimitive.Title>
          )
        ) : null}
        {message ? (
          presentation === 'popover' ? (
            <PopoverPrimitive.Description data-slot="action-sheet-message" className="type-footnote text-label-2">
              {message}
            </PopoverPrimitive.Description>
          ) : (
            <DrawerPrimitive.Description data-slot="action-sheet-message" className="type-footnote text-label-2">
              {message}
            </DrawerPrimitive.Description>
          )
        ) : null}
      </div>
    ) : null

  if (presentation === 'popover') {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-50">
          <PopoverPrimitive.Popup
            data-slot="action-sheet-content"
            data-presentation="popover"
            data-elevated=""
            className={cn(
              'material-regular z-50 flex min-w-(--menu-width) origin-(--transform-origin) flex-col rounded-4xl p-1 text-label shadow-popover outline-none duration-(--duration-overlay) ease-(--ease-standard) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none',
              className,
            )}
            {...props}
          >
            {header}
            <div data-slot="action-sheet-group" className="flex flex-col">
              {actions}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    )
  }

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="action-sheet-backdrop"
        className="fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-(--duration-sheet) ease-(--ease-sheet) data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:duration-0"
      />
      <DrawerPrimitive.Viewport data-slot="action-sheet-viewport" className="fixed inset-0 z-50">
        <DrawerPrimitive.Popup
          data-slot="action-sheet-content"
          data-presentation="sheet"
          data-elevated=""
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-label outline-none transition-transform duration-(--duration-sheet) ease-(--ease-sheet) will-change-transform [translate:0_var(--drawer-swipe-movement-y)] data-starting-style:translate-y-full data-ending-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          <DrawerPrimitive.Content data-slot="action-sheet-body" className="flex flex-col">
            <div
              data-slot="action-sheet-group"
              className="material-thick flex flex-col overflow-hidden rounded-4xl [&>*+*]:border-t-[0.5px] [&>*+*]:border-separator"
            >
              {header}
              {actions}
            </div>
            {cancels.length > 0 ? (
              <div data-slot="action-sheet-cancel-group" className="material-thick mt-(--action-sheet-cancel-gap) flex flex-col overflow-hidden rounded-4xl">
                {cancels}
              </div>
            ) : null}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

type ActionSheetActionProps = DrawerPrimitive.Close.Props & {
  destructive?: boolean
}

function ActionSheetAction({ className, destructive = false, ...props }: ActionSheetActionProps) {
  const presentation = useActionSheetPresentation()
  const actionClassName = cn(
    'flex w-full items-center justify-center truncate outline-none select-none focus-visible:bg-fill-4 active:bg-fill-3 disabled:opacity-40',
    presentation === 'popover'
      ? 'type-body h-(--menu-item-height) rounded-3xl px-4 hover:bg-fill-3'
      : 'type-title-3 h-(--action-sheet-row-height) px-4',
    destructive ? 'text-destructive' : 'text-primary',
    className,
  )
  return presentation === 'popover' ? (
    <PopoverPrimitive.Close data-slot="action-sheet-action" data-destructive={destructive || undefined} className={actionClassName} {...(props as PopoverPrimitive.Close.Props)} />
  ) : (
    <DrawerPrimitive.Close data-slot="action-sheet-action" data-destructive={destructive || undefined} className={actionClassName} {...props} />
  )
}

function ActionSheetCancel({ className, ...props }: DrawerPrimitive.Close.Props) {
  const presentation = useActionSheetPresentation()
  if (presentation === 'popover') return null
  return (
    <DrawerPrimitive.Close
      data-slot="action-sheet-cancel"
      className={cn(
        'type-title-3 flex h-(--action-sheet-row-height) w-full items-center justify-center px-4 font-semibold text-primary outline-none select-none focus-visible:bg-fill-4 active:bg-fill-3',
        className,
      )}
      {...props}
    />
  )
}

export { ActionSheet, ActionSheetAction, ActionSheetCancel, ActionSheetContent, ActionSheetTrigger, useActionSheetPresentation }
export type { ActionSheetActionProps, ActionSheetContentProps }

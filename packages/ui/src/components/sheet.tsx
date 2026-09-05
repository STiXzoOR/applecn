'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { cn } from 'cn'
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'

import { useIsDesktop } from '../hooks/use-media-query.ts'
import { dialogBackdropClassName, dialogPopupClassName } from './dialog.tsx'

/**
 * Sheets (HIG › Sheets). Below the `sm` breakpoint a sheet rises from the bottom on the sheet
 * radius with a grabber, resting at the `large` detent or, with `detent="medium"`, at half
 * height as an inset card with all corners rounded (iOS 26). From `sm` up the same children
 * render as a centred card. `SheetToolbar` places Cancel leading, the title centred and Done
 * trailing, the way iOS sheets do.
 */
type Presentation = 'sheet' | 'dialog'

const PresentationContext = createContext<Presentation>('sheet')

type SheetProps = Pick<DialogPrimitive.Root.Props, 'open' | 'defaultOpen' | 'onOpenChange' | 'modal' | 'children'>

function Sheet(props: SheetProps) {
  const desktop = useIsDesktop()
  const presentation: Presentation = desktop ? 'dialog' : 'sheet'
  return (
    <PresentationContext.Provider value={presentation}>
      {desktop ? (
        <DialogPrimitive.Root data-slot="sheet" {...props} />
      ) : (
        <DrawerPrimitive.Root data-slot="sheet" swipeDirection="down" {...(props as DrawerPrimitive.Root.Props)} />
      )}
    </PresentationContext.Provider>
  )
}

function useSheetPresentation() {
  return useContext(PresentationContext)
}

function SheetTrigger(props: DialogPrimitive.Trigger.Props) {
  const presentation = useSheetPresentation()
  return presentation === 'dialog' ? (
    <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
  ) : (
    <DrawerPrimitive.Trigger data-slot="sheet-trigger" {...(props as DrawerPrimitive.Trigger.Props)} />
  )
}

function SheetClose({ className, ...props }: DialogPrimitive.Close.Props) {
  const presentation = useSheetPresentation()
  const closeClassName = cn('type-body text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-60', className)
  return presentation === 'dialog' ? (
    <DialogPrimitive.Close data-slot="sheet-close" className={closeClassName} {...props} />
  ) : (
    <DrawerPrimitive.Close data-slot="sheet-close" className={closeClassName} {...(props as DrawerPrimitive.Close.Props)} />
  )
}

type SheetContentProps = DialogPrimitive.Popup.Props & {
  /** Where the sheet rests on a phone: the full `large` height, or `medium` at half height. */
  detent?: 'medium' | 'large'
}

function SheetContent({ className, children, detent = 'large', ...props }: SheetContentProps) {
  const presentation = useSheetPresentation()

  if (presentation === 'dialog') {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop data-slot="sheet-backdrop" className={dialogBackdropClassName} />
        <DialogPrimitive.Popup
          data-slot="sheet-content"
          data-presentation="dialog"
          data-elevated=""
          className={cn(dialogPopupClassName, 'gap-0 p-0', className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    )
  }

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="sheet-backdrop"
        className="fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-(--duration-sheet) ease-(--ease-sheet) data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:duration-0"
      />
      <DrawerPrimitive.Viewport data-slot="sheet-viewport" className="fixed inset-0 z-50">
        <DrawerPrimitive.Popup
          data-slot="sheet-content"
          data-presentation="sheet"
          data-detent={detent}
          data-elevated=""
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col bg-popover text-label shadow-window outline-none transition-transform duration-(--duration-sheet) ease-(--ease-sheet) will-change-transform [translate:0_var(--drawer-swipe-movement-y)] data-starting-style:translate-y-full data-ending-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-none',
            detent === 'medium'
              ? 'mx-2 mb-[max(0.5rem,env(safe-area-inset-bottom))] h-[50dvh] rounded-sheet'
              : 'max-h-[calc(100dvh-var(--nav-bar-height))] rounded-t-sheet pb-[env(safe-area-inset-bottom)]',
            className,
          )}
          {...(props as DrawerPrimitive.Popup.Props)}
        >
          <div data-slot="sheet-grabber" aria-hidden="true" className="mx-auto mt-[5px] h-(--sheet-grabber-height) w-(--sheet-grabber-width) shrink-0 rounded-full bg-fill-2" />
          <DrawerPrimitive.Content data-slot="sheet-body" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  const presentation = useSheetPresentation()
  const titleClassName = cn('type-headline truncate text-center text-label', className)
  return presentation === 'dialog' ? (
    <DialogPrimitive.Title data-slot="sheet-title" className={titleClassName} {...props} />
  ) : (
    <DrawerPrimitive.Title data-slot="sheet-title" className={titleClassName} {...(props as DrawerPrimitive.Title.Props)} />
  )
}

function SheetDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  const presentation = useSheetPresentation()
  const descriptionClassName = cn('type-subheadline text-label-2', className)
  return presentation === 'dialog' ? (
    <DialogPrimitive.Description data-slot="sheet-description" className={descriptionClassName} {...props} />
  ) : (
    <DrawerPrimitive.Description data-slot="sheet-description" className={descriptionClassName} {...(props as DrawerPrimitive.Description.Props)} />
  )
}

type SheetToolbarProps = ComponentProps<'div'> & {
  /** Leading item: Cancel, Close or Back. */
  cancel?: ReactNode
  /** Trailing item: Done, Add, Save. */
  done?: ReactNode
}

function SheetToolbar({ className, cancel, done, children, ...props }: SheetToolbarProps) {
  return (
    <div
      data-slot="sheet-toolbar"
      className={cn('grid h-(--nav-bar-height) shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4', className)}
      {...props}
    >
      <div data-slot="sheet-toolbar-leading" className="flex justify-self-start">
        {cancel}
      </div>
      <div data-slot="sheet-toolbar-title" className="min-w-0">
        {children}
      </div>
      <div data-slot="sheet-toolbar-trailing" className="flex justify-self-end font-semibold">
        {done}
      </div>
    </div>
  )
}

function SheetSection({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-section" className={cn('flex flex-col gap-4 px-4 py-4', className)} {...props} />
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetSection, SheetTitle, SheetToolbar, SheetTrigger, useSheetPresentation }
export type { SheetContentProps, SheetProps, SheetToolbarProps }

'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/**
 * A modal card: the macOS sheet and the iPad form sheet. A title, an optional description, the
 * content, and a footer with the primary button at the trailing edge. `Sheet` chooses between
 * this and a bottom sheet by viewport.
 */
function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

const dialogBackdropClassName =
  'fixed inset-0 z-50 [background-color:rgb(0_0_0/var(--sheet-scrim))] duration-(--duration-overlay) data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none'

const dialogPopupClassName =
  'fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-(--dialog-width) -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-4xl bg-popover p-6 text-label shadow-window outline-none duration-(--duration-overlay) ease-(--ease-standard) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none'

function DialogContent({ className, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop data-slot="dialog-backdrop" className={dialogBackdropClassName} />
      <DialogPrimitive.Popup data-slot="dialog-content" data-elevated="" className={cn(dialogPopupClassName, className)} {...props} />
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1', className)} {...props} />
}

function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('flex flex-row-reverse flex-wrap items-center gap-2', className)} {...props} />
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('type-title-3 font-semibold text-label', className)} {...props} />
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn('type-subheadline text-label-2', className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogBackdropClassName,
  dialogPopupClassName,
}

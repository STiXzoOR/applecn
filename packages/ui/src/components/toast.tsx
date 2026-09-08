"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "../lib/utils"
import type { ReactNode } from "react"

import { Icon } from "./icon"

/**
 * Notifications (HIG › Notifications): the banner that drops in from the top of the screen —
 * a Liquid Glass card on the platform's card corner with an app icon, a semibold title and a
 * message, swiped up to dismiss on iOS, tucked into the top trailing corner on macOS and the
 * web. `Toaster` provides the stack and renders it; `useToast().add({ title, description })`
 * posts one, and returns its id for `update` and `close`.
 *
 * `Toaster` is the whole thing assembled, and every part it assembles is exported, so a caller
 * who wants a different stack writes shadcn's composition instead —
 * `ToastProvider` → `ToastPortal` → `ToastViewport` → `Toast` — and gets the same banner.
 */
const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

/** Where the stack sits: top trailing on macOS and the web, dropping in from the top on iOS. */
function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed top-(--toast-top) right-(--toast-right) left-(--toast-left) z-50 flex w-(--toast-width) max-w-[420px] translate-x-(--toast-translate-x) flex-col gap-2 outline-none",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      swipeDirection={["up", "right"]}
      className={cn(
        "group/toast relative flex w-full [transform:translateY(var(--toast-swipe-movement-y))_translateX(var(--toast-swipe-movement-x))] items-start gap-3 rounded-card glass p-3 text-label shadow-dialog transition-[transform,opacity] duration-(--duration-overlay) ease-(--ease-standard) data-ending-style:-translate-y-4 data-ending-style:opacity-0 data-expanded:shadow-dialog data-starting-style:-translate-y-4 data-starting-style:opacity-0 motion-reduce:transition-none",
        "data-[swipe-direction=right]:data-ending-style:translate-x-full data-[swipe-direction=up]:data-ending-style:-translate-y-full",
        className
      )}
      {...props}
    />
  )
}

/** The app's rounded-rect icon beside the text, as Notification Center draws it. */
function ToastIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="toast-icon"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[22.37%] bg-primary text-white [&_svg]:size-6",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5 pe-6", className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "truncate type-subheadline font-semibold text-label",
        className
      )}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("type-subheadline text-label-2", className)}
      {...props}
    />
  )
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "shrink-0 self-center rounded-full bg-fill-3 px-3 py-1.5 type-footnote font-semibold text-primary outline-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      className={cn(
        "absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-fill-3 text-label-2 opacity-0 transition-opacity duration-(--duration-press) outline-none group-hover/toast:opacity-100 hover:text-label focus-visible:opacity-100 focus-visible:ring-4 focus-visible:ring-ring/60",
        className
      )}
      {...props}
    >
      {children ?? <Icon icon={Cancel01Icon} weight="bold" scale="small" />}
    </ToastPrimitive.Close>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      {item.data && "icon" in item.data ? (
        <ToastIcon>{(item.data as { icon?: ReactNode }).icon}</ToastIcon>
      ) : null}
      <ToastContent>
        <ToastTitle />
        <ToastDescription />
      </ToastContent>
      {item.actionProps ? <ToastAction /> : null}
      <ToastClose />
    </Toast>
  ))
}

function Toaster({
  children,
  timeout = 5000,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider timeout={timeout} toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

/** `add`, `update`, `close` and `promise`, from Base UI's toast manager. */
const useToastManager = ToastPrimitive.useToastManager

/** The name applecn shipped with; shadcn calls the same hook `useToastManager`. */
const useToast = useToastManager

/** A manager for posting toasts from outside React (pass it to `ToastProvider`'s `toastManager`). */
const createToastManager = ToastPrimitive.createToastManager

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  Toaster,
  ToastViewport,
  createToastManager,
  toast,
  useToast,
  useToastManager,
}

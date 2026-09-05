"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import type { ReactNode } from "react"

import { Icon } from "./icon"

/**
 * Notifications (HIG › Notifications): the banner that drops in from the top of the screen —
 * a Liquid Glass card on the platform's card corner with an app icon, a semibold title and a
 * message, swiped up to dismiss on iOS, tucked into the top trailing corner on macOS and the
 * web. `Toaster` provides the stack and renders it; `useToast().add({ title, description })`
 * posts one, and returns its id for `update` and `close`.
 */
function Toaster({ children }: { children: ReactNode }) {
  return (
    <ToastPrimitive.Provider timeout={5000}>
      {children}
      <ToastList />
    </ToastPrimitive.Provider>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        className="fixed top-[max(0.5rem,env(safe-area-inset-top))] z-50 flex w-[calc(100%-1rem)] max-w-[420px] flex-col gap-2 outline-none ios:left-1/2 ios:-translate-x-1/2 macos:top-5 macos:right-5 macos:w-[360px] web:top-5 web:right-5 web:w-[360px]"
      >
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            toast={toast}
            data-slot="toast"
            swipeDirection={["up", "right"]}
            className={cn(
              "group/toast relative flex w-full [transform:translateY(var(--toast-swipe-movement-y))_translateX(var(--toast-swipe-movement-x))] items-start gap-3 rounded-card glass p-3 text-label shadow-dialog transition-[transform,opacity] duration-(--duration-overlay) ease-(--ease-standard) data-ending-style:-translate-y-4 data-ending-style:opacity-0 data-expanded:shadow-dialog data-starting-style:-translate-y-4 data-starting-style:opacity-0 motion-reduce:transition-none",
              "data-[swipe-direction=right]:data-ending-style:translate-x-full data-[swipe-direction=up]:data-ending-style:-translate-y-full"
            )}
          >
            {toast.data && "icon" in toast.data ? (
              <span
                data-slot="toast-icon"
                className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[22.37%] bg-primary text-white [&_svg]:size-6"
              >
                {(toast.data as { icon?: ReactNode }).icon}
              </span>
            ) : null}
            <ToastPrimitive.Content
              data-slot="toast-content"
              className="flex min-w-0 flex-1 flex-col gap-0.5 pe-6"
            >
              <ToastPrimitive.Title
                data-slot="toast-title"
                className="truncate type-subheadline font-semibold text-label"
              />
              <ToastPrimitive.Description
                data-slot="toast-description"
                className="type-subheadline text-label-2"
              />
            </ToastPrimitive.Content>
            {toast.actionProps ? (
              <ToastPrimitive.Action
                data-slot="toast-action"
                className="shrink-0 self-center rounded-full bg-fill-3 px-3 py-1.5 type-footnote font-semibold text-primary outline-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60"
              />
            ) : null}
            <ToastPrimitive.Close
              data-slot="toast-close"
              aria-label="Close"
              className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-fill-3 text-label-2 opacity-0 transition-opacity duration-(--duration-press) outline-none group-hover/toast:opacity-100 hover:text-label focus-visible:opacity-100 focus-visible:ring-4 focus-visible:ring-ring/60"
            >
              <Icon icon={Cancel01Icon} weight="bold" scale="small" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

/** `add`, `update`, `close` and `promise`, from Base UI's toast manager. */
const useToast = ToastPrimitive.useToastManager

/** A manager for posting toasts from outside React (pass it to `ToastPrimitive.Provider`'s `toastManager`). */
const createToastManager = ToastPrimitive.createToastManager

export { Toaster, createToastManager, useToast }

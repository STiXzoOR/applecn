"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { ArrowDown01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "../lib/utils"
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"

import { Button } from "./button"
import { Icon } from "./icon"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetToolbar,
} from "./sheet"

interface SidebarState {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarState | null>(null)

/**
 * Holds the state a collapsible `Sidebar` shares with its `SidebarTrigger`. Wrap the screen —
 * the trigger usually lives in the navigation bar, far from the sidebar itself.
 */
function SidebarProvider({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const value = useMemo(() => ({ open, setOpen }), [open])
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

function useSidebar(): SidebarState {
  const state = useContext(SidebarContext)
  if (!state)
    throw new Error("useSidebar must be used inside a <SidebarProvider>.")
  return state
}

/** The button that presents a collapsible sidebar; it steps aside once the sidebar fits. */
function SidebarTrigger({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const { setOpen } = useSidebar()
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="gray"
      shape="circle"
      size="small"
      aria-label="Menu"
      className={cn("lg:hidden", className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      <Icon icon={Menu01Icon} />
    </Button>
  )
}

const sidebarClassName =
  "flex h-full w-(--sidebar-width) shrink-0 flex-col gap-4 overflow-y-auto material-regular p-3 text-label"

type SidebarProps = ComponentProps<"nav"> & {
  /**
   * Below `lg` the sidebar steps out of the layout and presents as a sheet instead, opened by
   * a `SidebarTrigger`. Both need a `SidebarProvider` above them.
   */
  collapsible?: boolean
  /** The sheet's title while the sidebar is presented. */
  title?: ReactNode
}

/**
 * Sidebars (HIG › Sidebars): a navigation list on the regular material along the leading edge,
 * with labelled, optionally collapsible groups, tinted symbols and the current item filled.
 * Width, row height, corner and text size follow the platform (320/44/10 on iPad, AppKit's
 * 240/28/6 on macOS 26, Music's 260/34/8 on the web). A narrow window has no room for a
 * standing sidebar, so `collapsible` presents the same rows in a sheet — the sidebar owns
 * that, callers never rebuild it.
 */
function Sidebar({
  className,
  collapsible = false,
  title = "Menu",
  children,
  ...props
}: SidebarProps) {
  if (!collapsible)
    return (
      <nav
        data-slot="sidebar"
        className={cn(sidebarClassName, className)}
        {...props}
      >
        {children}
      </nav>
    )
  return (
    <CollapsibleSidebar title={title} className={className} {...props}>
      {children}
    </CollapsibleSidebar>
  )
}

function CollapsibleSidebar({
  className,
  title,
  // The rows are rendered twice, standing and in the sheet; only one may hold the id.
  id,
  children,
  ...props
}: ComponentProps<"nav"> & { title: ReactNode }) {
  const { open, setOpen } = useSidebar()
  return (
    <>
      <nav
        id={id}
        data-slot="sidebar"
        className={cn(sidebarClassName, "hidden lg:flex", className)}
        {...props}
      >
        {children}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetToolbar cancel={<SheetClose>Close</SheetClose>}>
            <SheetTitle>{title}</SheetTitle>
          </SheetToolbar>
          <nav
            data-slot="sidebar"
            className={cn(
              sidebarClassName,
              "h-auto w-full [background-color:transparent] bg-transparent [backdrop-filter:none]"
            )}
            {...props}
          >
            {children}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("px-2 py-1 type-title-2 font-bold text-label", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-1", className)}
      {...props}
    />
  )
}

type SidebarGroupProps = ComponentProps<"div"> & {
  label?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

const groupLabelClassName =
  "flex w-full items-center justify-between px-2 pb-1 type-caption-1 font-semibold text-(--sidebar-group-label-text)"

function SidebarGroup({
  className,
  label,
  collapsible = false,
  defaultOpen = true,
  children,
  ...props
}: SidebarGroupProps) {
  if (collapsible) {
    return (
      <CollapsiblePrimitive.Root
        defaultOpen={defaultOpen}
        data-slot="sidebar-group"
        className={cn("group/sidebar-group flex flex-col", className)}
      >
        <CollapsiblePrimitive.Trigger
          data-slot="sidebar-group-label"
          className={cn(
            groupLabelClassName,
            "rounded-md outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
          )}
        >
          {label}
          <Icon
            icon={ArrowDown01Icon}
            weight="semibold"
            className="transition-transform duration-(--duration-press) group-data-open/sidebar-group:rotate-180 motion-reduce:transition-none"
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Panel
          data-slot="sidebar-group-items"
          className="flex flex-col gap-0.5"
        >
          {children}
        </CollapsiblePrimitive.Panel>
      </CollapsiblePrimitive.Root>
    )
  }
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label ? (
        <div data-slot="sidebar-group-label" className={groupLabelClassName}>
          {label}
        </div>
      ) : null}
      <div data-slot="sidebar-group-items" className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  )
}

type SidebarItemProps = Omit<ComponentProps<"button">, "type"> &
  Pick<ComponentProps<"a">, "target" | "rel" | "download"> & {
    icon?: IconSvgElement
    /** Renders the row as a link rather than a button. */
    href?: string
    current?: boolean
  }

function SidebarItem({
  className,
  icon,
  href,
  current = false,
  children,
  ...props
}: SidebarItemProps) {
  const itemClassName = cn(
    "flex h-(--sidebar-row-height) w-full items-center gap-(--sidebar-item-gap) rounded-sidebar px-2 text-start text-[length:var(--sidebar-font)] leading-none text-label outline-none select-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 aria-[current=page]:bg-fill-3 aria-[current=page]:font-medium aria-[current=true]:bg-fill-3 aria-[current=true]:font-medium",
    className
  )
  const content = (
    <>
      {icon ? (
        <Icon
          icon={icon}
          data-slot="sidebar-item-icon"
          className="text-primary"
        />
      ) : null}
      <span className="truncate">{children}</span>
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        data-slot="sidebar-item"
        aria-current={current ? "page" : undefined}
        className={itemClassName}
        {...(props as ComponentProps<"a">)}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      data-slot="sidebar-item"
      aria-current={current ? "true" : undefined}
      className={itemClassName}
      {...props}
    >
      {content}
    </button>
  )
}

export {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
export type { SidebarGroupProps, SidebarItemProps, SidebarProps }

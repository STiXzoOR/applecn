"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ArrowDown01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "../lib/utils"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"

import { useMediaQuery } from "../hooks/use-media-query"

import { Button } from "./button"
import { Icon } from "./icon"
import { Input } from "./input"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerToolbar,
} from "./drawer"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
/**
 * The width at which a sidebar can stand in the layout. It is `lg`, the breakpoint the standing
 * sidebar's own `hidden lg:flex` already uses — the two must agree, or the trigger would toggle
 * the standing sidebar while the sheet is the thing on screen.
 */
const SIDEBAR_STANDING_QUERY = "(min-width: 1024px)"

interface SidebarState {
  /** `expanded` or `collapsed`, mirrored onto `Sidebar` as `data-state` for CSS to key off. */
  readonly state: "expanded" | "collapsed"
  /** Whether the standing sidebar is expanded. */
  readonly open: boolean
  readonly setOpen: (open: boolean) => void
  /** Whether the presented sheet is open — the narrow-window sidebar. */
  readonly openMobile: boolean
  readonly setOpenMobile: (open: boolean) => void
  readonly isMobile: boolean
  /** Toggles whichever of the two is on screen. */
  readonly toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarState | null>(null)

/**
 * Holds the state a collapsible `Sidebar` shares with its `SidebarTrigger` and `SidebarRail`.
 * Wrap the screen — the trigger usually lives in the navigation bar, far from the sidebar itself.
 *
 * The two words mean what they mean in shadcn: `open` is the standing sidebar, expanded or
 * collapsed and remembered in a cookie, and `openMobile` is the sheet a narrow window presents
 * instead. Before Task 15c applecn had one `open` and it meant the sheet.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = !useMediaQuery(SIDEBAR_STANDING_QUERY)
  const [openMobile, setOpenMobile] = useState(false)
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const open = openProp ?? uncontrolled

  const setOpen = useCallback(
    (value: boolean) => {
      if (setOpenProp) setOpenProp(value)
      else setUncontrolled(value)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp]
  )

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile(!openMobile)
    else setOpen(!open)
  }, [isMobile, open, openMobile, setOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleSidebar])

  const value = useMemo<SidebarState>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={
          // `--sidebar-width` is a measured token and is left to the idiom; only the collapsed
          // rail's width is set here, because no measurement covers a mode applecn had not built.
          {
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as CSSProperties
        }
        className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
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
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-slot="sidebar-trigger"
      data-sidebar="trigger"
      variant="gray"
      shape="circle"
      size="small"
      aria-label="Menu"
      className={cn("lg:hidden", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <Icon icon={Menu01Icon} />
    </Button>
  )
}

/** The hit target along the sidebar's edge that collapses and expands it. */
function SidebarRail({ className, ...props }: ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-px hover:after:bg-separator sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        className
      )}
      {...props}
    />
  )
}

/** The pane beside the sidebar — shadcn's name for the rest of the screen. */
function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("relative flex w-full flex-1 flex-col", className)}
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto", className)}
      {...props}
    />
  )
}

const sidebarClassName =
  "flex h-full w-(--sidebar-width) shrink-0 flex-col gap-4 overflow-y-auto material-regular p-3 text-label"

type SidebarProps = ComponentProps<"nav"> & {
  /**
   * `false` (the default) stands in the layout, which is shadcn's `"none"`. `true` is Apple's:
   * below `lg` the sidebar steps out of the layout and presents as a sheet, opened by a
   * `SidebarTrigger`. `"offcanvas"` and `"icon"` are shadcn's own collapsing modes, which render
   * its spacer-and-fixed-container structure. Every mode but `false`/`"none"` needs a
   * `SidebarProvider` above it.
   */
  collapsible?: boolean | "offcanvas" | "icon" | "none"
  /** Which edge the sidebar sits on, in shadcn's collapsing modes. */
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  /** The sheet's title while an Apple-collapsible sidebar is presented. */
  title?: ReactNode
}

/**
 * Sidebars (HIG › Sidebars): a navigation list on the regular material along the leading edge,
 * with labelled, optionally collapsible groups, tinted symbols and the current item filled.
 * Width, row height, corner and text size follow the platform (320/44/10 on iPad, AppKit's
 * 240/28/6 on macOS 26, Music's 260/34/8 on the web).
 *
 * Three layouts, and `collapsible` picks between them. applecn's sidebar stands in the layout —
 * it is placed by a grid, which is how macOS's split view works — and that is shadcn's
 * `collapsible="none"` exactly. A narrow window has no room for a standing sidebar, so
 * `collapsible` (the boolean) presents the same rows in a sheet; the sidebar owns that, callers
 * never rebuild it. `"offcanvas"` and `"icon"` are shadcn's own, and render its structure: a
 * spacer holding the space, a fixed container sliding in and out of it, and the nav inside.
 */
function Sidebar({
  className,
  collapsible = false,
  side = "left",
  variant = "sidebar",
  title = "Menu",
  children,
  ...props
}: SidebarProps) {
  if (collapsible === true)
    return (
      <CollapsibleSidebar title={title} className={className} {...props}>
        {children}
      </CollapsibleSidebar>
    )

  if (collapsible === false || collapsible === "none")
    return (
      <nav
        data-slot="sidebar"
        data-sidebar="sidebar"
        className={cn(sidebarClassName, className)}
        {...props}
      >
        {children}
      </nav>
    )

  return (
    <OffcanvasSidebar
      collapsible={collapsible}
      side={side}
      variant={variant}
      className={className}
      {...props}
    >
      {children}
    </OffcanvasSidebar>
  )
}

/** shadcn's collapsing structure, styled as Apple: `sidebar-gap`, `sidebar-container`, the nav. */
function OffcanvasSidebar({
  className,
  collapsible,
  side,
  variant,
  children,
  ...props
}: ComponentProps<"nav"> & {
  collapsible: "offcanvas" | "icon"
  side: "left" | "right"
  variant: "sidebar" | "floating" | "inset"
}) {
  const { state } = useSidebar()
  const padded = variant === "floating" || variant === "inset"
  return (
    <div
      className="group peer hidden text-label lg:block"
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-(--duration-nav) ease-(--ease-nav) group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
          padded
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-(--duration-nav) ease-(--ease-nav) data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] lg:flex",
          padded
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          className
        )}
      >
        <nav
          data-slot="sidebar-inner"
          data-sidebar="sidebar"
          className={cn(sidebarClassName, "size-full")}
          {...props}
        >
          {children}
        </nav>
      </div>
    </div>
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
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <>
      <nav
        id={id}
        data-slot="sidebar"
        data-sidebar="sidebar"
        className={cn(sidebarClassName, "hidden lg:flex", className)}
        {...props}
      >
        {children}
      </nav>
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent>
          <DrawerToolbar cancel={<DrawerClose>Close</DrawerClose>}>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerToolbar>
          <nav
            data-slot="sidebar"
            data-sidebar="sidebar"
            className={cn(
              sidebarClassName,
              "h-auto w-full [background-color:transparent] bg-transparent [backdrop-filter:none]"
            )}
            {...props}
          >
            {children}
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("px-2 py-1 type-title-2 font-bold text-label", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("mt-auto flex flex-col gap-1", className)}
      {...props}
    />
  )
}

/** The scrolling middle of a sidebar, between its header and its footer. */
function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
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

/**
 * A run of rows under a heading. shadcn's `SidebarGroup` is a bare column and the heading is its
 * own `SidebarGroupLabel`; applecn's takes the heading as a `label` prop and can disclose the
 * group, which is the Apple behaviour. Both markups work: with no `label`, this is shadcn's
 * column, and `SidebarGroupLabel`/`SidebarGroupContent` are written out inside it.
 */
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
        data-sidebar="group"
        className={cn("group/sidebar-group flex flex-col", className)}
      >
        <CollapsiblePrimitive.Trigger
          data-slot="sidebar-group-label"
          data-sidebar="group-label"
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
          render={<SidebarGroupContent className="flex flex-col gap-0.5" />}
        >
          {children}
        </CollapsiblePrimitive.Panel>
      </CollapsiblePrimitive.Root>
    )
  }
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col", className)}
      {...props}
    >
      {label ? (
        <SidebarGroupLabel className={groupLabelClassName}>
          {label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent className="flex flex-col gap-0.5">
        {children}
      </SidebarGroupContent>
    </div>
  )
}

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn(groupLabelClassName, className) },
      props
    ),
    render,
    state: { slot: "sidebar-group-label", sidebar: "group-label" },
  })
}

/** The button beside a group's heading — "add a playlist", and its like. */
function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute end-1 top-0 flex aspect-square w-5 items-center justify-center rounded-md text-label-2 outline-none group-data-[collapsible=icon]:hidden hover:bg-fill-4 hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "sidebar-group-action", sidebar: "group-action" },
  })
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "flex w-full min-w-0 list-none flex-col gap-0.5",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

/**
 * The row itself, and the one measurement in this file: `--sidebar-row-height`,
 * `--sidebar-item-gap`, `--sidebar-font` and `rounded-sidebar` are the platform's, and Apple's
 * `SidebarItem` and shadcn's `SidebarMenuButton` are the same row wearing two APIs.
 */
const sidebarRowClassName =
  "flex h-(--sidebar-row-height) w-full items-center gap-(--sidebar-item-gap) overflow-hidden rounded-sidebar px-2 text-start text-[length:var(--sidebar-font)] leading-none text-label outline-none select-none hover:bg-fill-4 focus-visible:ring-4 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&>span:last-child]:truncate"

function SidebarMenuButton({
  className,
  render,
  isActive = false,
  tooltip,
  ...props
}: useRender.ComponentProps<"button"> & {
  isActive?: boolean
  tooltip?: string | ComponentProps<typeof TooltipContent>
}) {
  const { state, isMobile } = useSidebar()
  const button = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          sidebarRowClassName,
          "data-active:bg-fill-3 data-active:font-medium",
          className
        ),
      },
      props
    ),
    render: tooltip ? <TooltipTrigger render={render} /> : render,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      active: isActive,
    },
  })

  if (!tooltip) return button

  return (
    <Tooltip>
      {button}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)}
      />
    </Tooltip>
  )
}

/** The button that appears on a row on hover — a row's own menu, rename, remove. */
function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> & { showOnHover?: boolean }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute end-1 top-1/2 flex aspect-square w-5 -translate-y-1/2 items-center justify-center rounded-md text-label-2 outline-none group-data-[collapsible=icon]:hidden hover:bg-fill-4 hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60",
          showOnHover &&
            "opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "sidebar-menu-action", sidebar: "menu-action" },
  })
}

/** The count at the end of a row — Mail's unread badge. */
function SidebarMenuBadge({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute end-2 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full px-1.5 type-caption-1 text-label-2 tabular-nums select-none group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/** A row that has not loaded yet. */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: ComponentProps<"div"> & { showIcon?: boolean }) {
  // A little variety, so a column of them does not read as a table.
  const [width] = useState(() => `${Math.floor(Math.random() * 40) + 50}%`)
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-(--sidebar-row-height) items-center gap-(--sidebar-item-gap) rounded-sidebar px-2",
        className
      )}
      {...props}
    >
      {showIcon ? (
        <Skeleton
          data-sidebar="menu-skeleton-icon"
          className="size-4 rounded-md"
        />
      ) : null}
      <Skeleton
        data-sidebar="menu-skeleton-text"
        className="h-4 max-w-(--skeleton-width) flex-1"
        style={{ "--skeleton-width": width } as CSSProperties}
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "ms-4 flex min-w-0 list-none flex-col gap-0.5 border-s-[0.5px] border-separator ps-2 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  className,
  render,
  size = "md",
  isActive = false,
  ...props
}: useRender.ComponentProps<"a"> & {
  size?: "sm" | "md"
  isActive?: boolean
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          sidebarRowClassName,
          "h-auto min-h-7 py-1 data-[size=sm]:type-caption-1 data-active:bg-fill-3 data-active:font-medium",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

type SidebarItemProps = Omit<ComponentProps<"button">, "type"> &
  Pick<ComponentProps<"a">, "target" | "rel" | "download"> & {
    icon?: IconSvgElement
    /** Renders the row as a link rather than a button. */
    href?: string
    current?: boolean
  }

/**
 * Apple's row: the same measured row as `SidebarMenuButton`, with the tinted symbol and the
 * `current` flag the HIG asks for, and no `SidebarMenuItem` around it.
 */
function SidebarItem({
  className,
  icon,
  href,
  current = false,
  children,
  ...props
}: SidebarItemProps) {
  const itemClassName = cn(
    sidebarRowClassName,
    "aria-[current=page]:bg-fill-3 aria-[current=page]:font-medium aria-[current=true]:bg-fill-3 aria-[current=true]:font-medium",
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
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarItem,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
export type { SidebarGroupProps, SidebarItemProps, SidebarProps }

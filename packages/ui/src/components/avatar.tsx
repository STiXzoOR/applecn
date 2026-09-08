"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import type { ComponentProps } from "react"

/** A person's picture, or their monogram on gray until it loads (Contacts, Messages). */
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 overflow-hidden rounded-full bg-gray-2 select-none",
  {
    variants: {
      size: {
        small: "size-7",
        medium: "size-10",
        large: "size-16",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
)

function Avatar({
  className,
  size = "medium",
  ...props
}: AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center type-subheadline font-semibold text-white uppercase group-data-[size=large]/avatar:type-title-2 group-data-[size=small]/avatar:type-caption-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * The status dot in the trailing bottom corner — Messages' online marker, Contacts' badges.
 * It carries no colour of its own: pass one (`bg-system-green`, `bg-system-red`) or a symbol.
 * shadcn sizes its badge off `group-data-[size=…]/avatar`; this does the same against
 * applecn's own `small`/`medium`/`large`.
 */
function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 ring-background select-none",
        "group-data-[size=small]/avatar:size-2.5 group-data-[size=small]/avatar:[&>svg]:hidden",
        "group-data-[size=medium]/avatar:size-3 group-data-[size=medium]/avatar:[&>svg]:size-2",
        "group-data-[size=large]/avatar:size-4 group-data-[size=large]/avatar:[&>svg]:size-2.5",
        className
      )}
      {...props}
    />
  )
}

/** A stack of overlapping avatars, each ringed in the page background (Messages, Shared Albums). */
function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

/**
 * The "+3" circle that closes a group. It is not an `Avatar`, so it takes its own `size` and
 * borrows `avatarVariants` to sit at exactly the same diameter as the faces beside it.
 */
function AvatarGroupCount({
  className,
  size = "medium",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof avatarVariants>) {
  return (
    <div
      data-slot="avatar-group-count"
      data-size={size}
      className={cn(
        avatarVariants({ size }),
        "items-center justify-center bg-fill-3 type-subheadline font-semibold text-label-2 ring-2 ring-background data-[size=large]:type-title-2 data-[size=small]:type-caption-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarVariants,
}

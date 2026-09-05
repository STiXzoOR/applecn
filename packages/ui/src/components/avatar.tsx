"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

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

export { Avatar, AvatarFallback, AvatarImage, avatarVariants }

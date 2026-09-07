import NextLink from "next/link"

import { linkVariants } from "@applecn/ui/components/link"
import { Text } from "@applecn/ui/components/text"

import { CopyCommand } from "@/components/landing/copy-command"

/**
 * The opening statement, in apple.com's grammar: the headline ladder, a 17/25 subhead, a pill
 * and a chevron link, and the one install command. Rises in on load; stays put under
 * reduced motion.
 */
export function Hero() {
  return (
    <header
      data-slot="hero"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-20 pb-12 text-center motion-safe:animate-in motion-safe:duration-700 motion-safe:ease-(--ease-standard) motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 sm:pt-28"
    >
      <Text
        as="h1"
        variant="large-title"
        emphasized
        className="max-w-3xl text-balance"
      >
        Apple’s design system, as shadcn components.
      </Text>
      <Text variant="callout" color="label-2" className="max-w-2xl text-pretty">
        iOS 26, macOS 26 and apple.com: every switch, corner and type size
        measured from the real thing, then rebuilt on Base UI with Hugeicons.
        Three idioms, one stylesheet. Copy, paste, own the code.
      </Text>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <NextLink href="/docs" className={linkVariants({ variant: "button" })}>
          Get started
        </NextLink>
        <NextLink href="/components/button" className={linkVariants()}>
          Browse components
          <span aria-hidden="true" className="ms-0.5">
            ›
          </span>
        </NextLink>
      </div>
      <CopyCommand command="npx shadcn@latest add @applecn/apple" />
    </header>
  )
}

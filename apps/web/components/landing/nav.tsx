import NextLink from "next/link"

import { AppearanceMenu } from "@/components/appearance-controls"
import { GITHUB_URL } from "@/lib/site"

const links = [
  { title: "Docs", href: "/docs" },
  { title: "Foundations", href: "/foundations/color" },
  { title: "Components", href: "/components/button" },
  { title: "GitHub", href: GITHUB_URL },
]

/** apple.com's global nav, 44 pt on the regular material, with the wordmark at the leading edge. */
export function LandingNav() {
  return (
    <nav
      aria-label="Site"
      data-slot="landing-nav"
      className="sticky top-0 z-40 flex h-(--nav-bar-height) w-full items-center material-regular hairline-b"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
        <NextLink
          href="/"
          className="type-callout font-semibold tracking-tight text-label outline-none focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          applecn
        </NextLink>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <NextLink
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 type-caption-1 text-label/80 transition-[color,background-color] duration-(--duration-nav) outline-none hover:bg-fill-4 hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.title}
            </NextLink>
          ))}
          <AppearanceMenu />
        </div>
      </div>
    </nav>
  )
}

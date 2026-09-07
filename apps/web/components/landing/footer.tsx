import NextLink from "next/link"

import { Text } from "@applecn/ui/components/text"

import { GITHUB_URL } from "@/lib/site"

const columns = [
  {
    title: "Foundations",
    links: [
      ["Color", "/foundations/color"],
      ["Typography", "/foundations/typography"],
      ["Layout", "/foundations/layout"],
      ["Materials", "/foundations/materials"],
      ["Platforms", "/foundations/platforms"],
    ],
  },
  {
    title: "Components",
    links: [
      ["Button", "/components/button"],
      ["Switch", "/components/switch"],
      ["List", "/components/list"],
      ["Alert", "/components/alert-dialog"],
      ["Tab bar", "/components/tab-bar"],
    ],
  },
  {
    title: "Project",
    links: [
      ["Docs", "/docs"],
      ["GitHub", GITHUB_URL],
      ["Contributing", `${GITHUB_URL}/blob/main/CONTRIBUTING.md`],
      [
        "Research",
        `${GITHUB_URL}/blob/main/docs/research/apple-design-system-reference.md`,
      ],
    ],
  },
]

/** apple.com's footer: small link columns on the secondary background, a legal line at the bottom. */
export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="bg-background-2 px-6 py-10 hairline-t"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-2">
              <Text variant="caption-1" className="font-semibold">
                {column.title}
              </Text>
              <ul className="flex flex-col gap-1.5">
                {column.links.map(([title, href]) => (
                  <li key={href}>
                    <NextLink
                      href={href!}
                      className="type-caption-1 text-label-2 underline-offset-4 outline-none hover:text-label hover:underline focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-ring/60"
                      {...(href!.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {title}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 pt-4 hairline-t">
          <Text variant="caption-1" color="label-3">
            applecn is an independent open-source project and is not affiliated
            with or endorsed by Apple Inc. Apple, iOS, macOS, the Human
            Interface Guidelines and Liquid Glass are trademarks of Apple Inc.
          </Text>
          <Text variant="caption-1" color="label-3">
            MIT licensed. Built on Base UI and Hugeicons.
          </Text>
        </div>
      </div>
    </footer>
  )
}

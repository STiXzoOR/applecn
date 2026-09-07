import NextLink from "next/link"

import { linkVariants } from "@applecn/ui/components/link"
import { Text } from "@applecn/ui/components/text"
import { systemColors } from "@applecn/ui/tokens/colors"
import { iosTextStyles } from "@applecn/ui/tokens/typography"

import { CopyCommand } from "@/components/landing/copy-command"
import { GITHUB_URL } from "@/lib/site"

const styles = iosTextStyles.filter((s) =>
  [
    "large-title",
    "title-1",
    "title-2",
    "headline",
    "body",
    "footnote",
  ].includes(s.name)
)

const label = (name: string) =>
  name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

/** The foundations, shown rather than described: the twelve colours, the type ladder, the materials. */
export function Foundations() {
  return (
    <section
      data-slot="foundations"
      aria-labelledby="foundations-title"
      className="bg-background-2 px-6 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <Text
            as="h2"
            id="foundations-title"
            variant="title-1"
            emphasized
            className="text-balance"
          >
            Tokens first. The stylesheet is generated.
          </Text>
          <Text variant="callout" color="label-2" className="text-pretty">
            Colour, type, geometry, shape, motion, elevation and materials live
            as typed data. A build renders them to CSS; a test fails when the
            file drifts from the data.
          </Text>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <NextLink
              href="/foundations/color"
              className={linkVariants({ variant: "quiet" })}
            >
              <Text as="span" variant="headline">
                Colour
              </Text>
            </NextLink>
            <ul className="grid grid-cols-6 gap-2 sm:grid-cols-12">
              {systemColors.map((c) => (
                <li key={c.name} className="flex flex-col items-center gap-1.5">
                  <span
                    className="block aspect-square w-full rounded-lg hairline"
                    style={{ backgroundColor: `var(--system-${c.name})` }}
                    title={c.name}
                  />
                  <Text
                    variant="caption-2"
                    color="label-3"
                    className="capitalize"
                  >
                    {c.name}
                  </Text>
                </li>
              ))}
            </ul>
            <Text variant="footnote" color="label-2">
              The twelve system colours in light, dark and accessible variants,
              the six grays, and every semantic role from label to separator.
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            <NextLink
              href="/foundations/typography"
              className={linkVariants({ variant: "quiet" })}
            >
              <Text as="span" variant="headline">
                Typography
              </Text>
            </NextLink>
            <ul className="flex flex-col gap-1">
              {styles.map((s) => (
                <li
                  key={s.name}
                  className="flex items-baseline justify-between gap-4"
                >
                  <Text as="span" variant={s.name} className="truncate">
                    {label(s.name)}
                  </Text>
                  <Text
                    as="span"
                    variant="caption-1"
                    color="label-3"
                    className="shrink-0 tabular-nums"
                  >
                    {s.size}/{s.leading}
                  </Text>
                </li>
              ))}
            </ul>
            <Text variant="footnote" color="label-2">
              Eleven text styles at every Dynamic Type size, the macOS scale,
              and apple.com’s ladder with its tracking.
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-card bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Text variant="headline">Add it to any shadcn project.</Text>
            <Text
              variant="footnote"
              color="label-2"
              className="max-w-md text-pretty"
            >
              The theme item carries every token; components install with their
              dependencies. Works with the shadcn CLI and with coding agents.
            </Text>
          </div>
          <div className="flex flex-col items-start gap-3">
            <CopyCommand command="npx shadcn@latest add @applecn/apple" />
            <a
              href={GITHUB_URL}
              className={linkVariants()}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
              <span aria-hidden="true" className="ms-0.5">
                ›
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

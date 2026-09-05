import Link from "next/link"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@apple-ds/ui/components/card"
import { Text } from "@apple-ds/ui/components/text"

import { CodeBlock } from "@/components/doc/code-block"
import { PageHeader } from "@/components/doc/page-header"
import { Section } from "@/components/doc/section"
import { foundationPages } from "@/lib/nav"
import { componentDocs, componentGroups } from "@/registry/index"

const groupTitles = {
  foundation: "Primitives",
  controls: "Controls",
  forms: "Form controls",
  overlays: "Overlays",
  navigation: "Navigation",
  content: "Content",
}

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Apple Design System"
        description="Apple’s Human Interface Guidelines — the iOS 26 idiom with macOS as a switch — as a shadcn design system: tokens generated from Apple’s published values, components on Base UI, icons from Hugeicons."
      />
      <Section
        title="Foundations"
        description="Every number traces to a source. The tables on these pages are rendered from the same token data the stylesheet is generated from."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {foundationPages.map((page) => (
            <Link
              key={page.slug}
              href={`/foundations/${page.slug}`}
              className="group rounded-4xl outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
            >
              <Card className="h-full transition-[background-color] duration-(--duration-hover) group-hover:bg-fill-3">
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
      <Section
        title="Components"
        description={`${componentDocs.length} components, each documented with its Apple counterpart, the Base UI primitive underneath, and live examples.`}
      >
        <div className="flex flex-col gap-6">
          {componentGroups.map((group) => (
            <div key={group} className="flex flex-col gap-2">
              <Text variant="headline">{groupTitles[group]}</Text>
              <div className="flex flex-wrap gap-2">
                {componentDocs
                  .filter((d) => d.group === group)
                  .map((d) => (
                    <Link
                      key={d.name}
                      href={`/components/${d.name}`}
                      className="rounded-full bg-fill-3 px-3 py-1.5 type-subheadline font-medium text-primary outline-none hover:bg-fill-2 focus-visible:ring-4 focus-visible:ring-ring/60"
                    >
                      {d.title}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Use it in a project"
        description="The site publishes a shadcn registry. Point the CLI at any component and it installs with its dependencies; add the style item once to get every token."
      >
        <CodeBlock
          lang="bash"
          code={`npx shadcn@latest add https://<your-host>/r/apple.json\nnpx shadcn@latest add https://<your-host>/r/button.json https://<your-host>/r/list.json`}
        />
      </Section>
    </>
  )
}

import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { notFound } from "next/navigation"

import { Badge } from "@apple-ds/ui/components/badge"
import { Text } from "@apple-ds/ui/components/text"

import { CodeBlock } from "@/components/doc/code-block"
import { PageHeader } from "@/components/doc/page-header"
import { Preview } from "@/components/doc/preview"
import { Section } from "@/components/doc/section"
import { examples } from "@/registry/examples.generated"
import { componentDocs } from "@/registry/index"

export function generateStaticParams() {
  return componentDocs.map((d) => ({ name: d.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const doc = componentDocs.find((d) => d.name === name)
  return { title: doc?.title ?? "Components", description: doc?.description }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const doc = componentDocs.find((d) => d.name === name)
  if (!doc) notFound()

  const source = await readFile(
    join(process.cwd(), "../../packages/ui/src/components", `${doc.name}.tsx`),
    "utf8"
  )

  return (
    <>
      <PageHeader title={doc.title} description={doc.description}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="tag">{doc.group}</Badge>
          <Text variant="footnote" color="label-2">
            Apple:{" "}
            {doc.apple.hig ? (
              <a
                href={doc.apple.hig}
                className="text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {doc.apple.name}
              </a>
            ) : (
              doc.apple.name
            )}
          </Text>
          <Text variant="footnote" color="label-2">
            · Base UI: {doc.primitive}
          </Text>
        </div>
      </PageHeader>

      {await Promise.all(
        doc.examples.map(async (example) => {
          const key = `${doc.name}/${example.name}`
          const loader = examples[key]
          if (!loader) return null
          const [{ default: Example }, code] = await Promise.all([
            loader(),
            readFile(
              join(process.cwd(), "registry/examples", `${key}.tsx`),
              "utf8"
            ),
          ])
          return (
            <Section
              key={key}
              id={example.name}
              title={example.title}
              description={example.description}
            >
              <Preview>
                <Example />
              </Preview>
              <CodeBlock code={code} />
            </Section>
          )
        })
      )}

      <Section
        title="Install"
        description="From the registry this site publishes, with dependencies resolved by the CLI."
      >
        <CodeBlock
          lang="bash"
          code={`npx shadcn@latest add https://<your-host>/r/${doc.name}.json`}
        />
      </Section>

      <Section
        title="Source"
        description={`packages/ui/src/components/${doc.name}.tsx`}
      >
        <CodeBlock code={source} />
      </Section>
    </>
  )
}

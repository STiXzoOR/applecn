import type { ReactNode } from "react"

import { Text } from "@apple-ds/ui/components/text"

export function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-slot="doc-section"
      className="flex scroll-mt-20 flex-col gap-4 py-6"
    >
      <div className="flex flex-col gap-1">
        <Text as="h2" variant="title-2" emphasized>
          {title}
        </Text>
        {description ? (
          <Text color="label-2" className="max-w-2xl text-pretty">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  )
}

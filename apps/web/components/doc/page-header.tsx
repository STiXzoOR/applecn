import type { ReactNode } from "react"

import { Text } from "@apple-ds/ui/components/text"

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <header data-slot="page-header" className="flex flex-col gap-3 pb-8">
      <Text as="h1" variant="large-title" emphasized>
        {title}
      </Text>
      <Text variant="title-3" color="label-2" className="max-w-2xl text-pretty">
        {description}
      </Text>
      {children}
    </header>
  )
}

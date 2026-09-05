import { notFound } from 'next/navigation'

import { foundations } from '@/components/foundations/pages'
import { foundationPages } from '@/lib/nav'

export function generateStaticParams() {
  return foundationPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = foundationPages.find((p) => p.slug === slug)
  return { title: page?.title ?? 'Foundations', description: page?.description }
}

export default async function FoundationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const Page = foundations[slug]
  if (!Page) notFound()
  return <Page />
}

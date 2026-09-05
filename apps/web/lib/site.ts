/**
 * The one place the site knows its own address. Vercel sets `NEXT_PUBLIC_SITE_URL` for a
 * custom domain; the default is the project's Vercel URL. Read by the registry generator
 * (the `homepage` field), the docs' Install blocks and the root layout's `metadataBase`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://applecn.vercel.app"
).replace(/\/$/, "")

export const REGISTRY_URL = `${SITE_URL}/r`

export const GITHUB_URL = "https://github.com/STiXzoOR/applecn"

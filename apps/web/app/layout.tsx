import type { Metadata, Viewport } from 'next'

import '@apple-ds/ui/globals.css'
import './docs.css'

import { AppearanceProvider } from '@/components/appearance'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: { default: 'Apple Design System', template: '%s · Apple Design System' },
  description: 'Apple’s Human Interface Guidelines as a shadcn design system on Base UI and Hugeicons.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'rgb(242 242 247)' },
    { media: '(prefers-color-scheme: dark)', color: 'rgb(0 0 0)' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>
          <AppearanceProvider>{children}</AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

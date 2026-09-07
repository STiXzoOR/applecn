import { PlatformProvider } from "@applecn/ui/lib/platform"

import { Evidence } from "@/components/landing/evidence"
import { Footer } from "@/components/landing/footer"
import { Foundations } from "@/components/landing/foundations"
import { Hero } from "@/components/landing/hero"
import { Mosaic } from "@/components/landing/mosaic"
import { LandingNav } from "@/components/landing/nav"
import { Showcase } from "@/components/landing/showcase"

/**
 * The landing page, under Apple's web idiom so it reads like an apple.com product page; the
 * showcase and the mosaic switch to the idiom they demonstrate.
 */
export default function LandingPage() {
  return (
    <PlatformProvider platform="web">
      <div className="flex min-h-dvh flex-col bg-background text-label">
        <LandingNav />
        <main className="flex flex-1 flex-col">
          <Hero />
          <PlatformProvider platform="ios">
            <Showcase />
          </PlatformProvider>
          <Evidence />
          <PlatformProvider platform="ios">
            <Mosaic />
          </PlatformProvider>
          <Foundations />
        </main>
        <Footer />
      </div>
    </PlatformProvider>
  )
}

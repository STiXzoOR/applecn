import type { Platform } from "./platform"

interface Environment {
  readonly userAgent: string
  /** `navigator.maxTouchPoints`; an iPad in desktop mode reports a Mac user agent but has touch. */
  readonly maxTouchPoints?: number
}

/**
 * Picks the idiom for the visitor's device: iPhone and iPad (including an iPad that presents
 * itself as a Mac) get `ios`, a Mac gets `macos`, and everything else — Windows, Android,
 * Linux, and the server, where there is no navigator — gets Apple's web idiom.
 */
function detectPlatform(env?: Environment): Platform {
  const environment =
    env ??
    (typeof navigator === "undefined"
      ? { userAgent: "" }
      : {
          userAgent: navigator.userAgent,
          maxTouchPoints: navigator.maxTouchPoints,
        })
  const ua = environment.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return "ios"
  if (/Macintosh|Mac OS X/.test(ua)) {
    return (environment.maxTouchPoints ?? 0) > 1 ? "ios" : "macos"
  }
  return "web"
}

export { detectPlatform }
export type { Environment as PlatformEnvironment }

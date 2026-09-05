import { resolve } from "node:path"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@apple-ds/ui"],
  turbopack: {
    root: resolve(import.meta.dirname, "../.."),
  },
}

export default nextConfig

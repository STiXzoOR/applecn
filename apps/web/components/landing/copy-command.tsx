"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { useState } from "react"

import { Icon } from "@applecn/ui/components/icon"

/** The install command as a pill with a copy button; reports what it did for a moment. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div
      data-slot="copy-command"
      className="inline-flex max-w-full items-center gap-2 rounded-full bg-fill-3 py-1.5 ps-4 pe-1.5 font-mono type-footnote text-label"
    >
      <code className="truncate">{command}</code>
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy command"}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-label-2 shadow-segment transition-[color,transform] duration-(--duration-press) outline-none hover:text-label focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-95"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(command)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          } catch {
            // clipboard unavailable
          }
        }}
      >
        <Icon
          icon={copied ? Tick02Icon : Copy01Icon}
          weight="semibold"
          scale="small"
          className={copied ? "text-system-green" : undefined}
        />
      </button>
    </div>
  )
}

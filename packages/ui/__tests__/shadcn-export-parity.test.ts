import { describe, expect, test } from "vitest"

/**
 * The sub-components shadcn exports, per primitive. Sourced from ui.shadcn.com on 2026-09-07.
 * applecn may export more (the Apple additions — `AlertDialogActions`, `SheetToolbar` and the
 * rest); it may never export fewer, or a shadcn user's copy-pasted markup breaks (spec §3, §5.1).
 */
const SHADCN_EXPORTS: Record<string, string[]> = {
  dialog: [
    "Dialog",
    "DialogClose",
    "DialogContent",
    "DialogDescription",
    "DialogFooter",
    "DialogHeader",
    "DialogTitle",
    "DialogTrigger",
  ],
  "alert-dialog": [
    "AlertDialog",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogHeader",
    "AlertDialogOverlay",
    "AlertDialogPortal",
    "AlertDialogTitle",
    "AlertDialogTrigger",
  ],
  // Today's `sheet` is shadcn's Drawer, and Task 15 renames it. When it does, this key becomes
  // `drawer` with the Drawer* names, and a fresh `sheet` entry is added to PENDING for the edge
  // panel Task 19 builds — otherwise this test silently checks the wrong component (ruling R18).
  sheet: [
    "Sheet",
    "SheetClose",
    "SheetContent",
    "SheetDescription",
    "SheetFooter",
    "SheetHeader",
    "SheetTitle",
    "SheetTrigger",
  ],
  item: [
    "Item",
    "ItemActions",
    "ItemContent",
    "ItemDescription",
    "ItemFooter",
    "ItemGroup",
    "ItemHeader",
    "ItemMedia",
    "ItemSeparator",
    "ItemTitle",
  ],
  "input-group": [
    "InputGroup",
    "InputGroupAddon",
    "InputGroupButton",
    "InputGroupInput",
    "InputGroupText",
    "InputGroupTextarea",
  ],
}

/**
 * Primitives the catalogue has not built yet, and the task that builds each. Committed skipped
 * rather than failing: `pnpm check` is green at the end of every task, and a red test parked in
 * the tree stops being read as a signal. Deleting the skip is part of the task named here.
 */
const PENDING: Record<string, string> = {
  item: "Task 17",
  "input-group": "Task 18",
}

describe("export parity with shadcn", () => {
  for (const [name, expected] of Object.entries(SHADCN_EXPORTS)) {
    const pending = PENDING[name]
    const builtBy = pending ? ` (built by ${pending})` : ""
    test.skipIf(Boolean(pending))(
      `${name} exports everything shadcn does${builtBy}`,
      async () => {
        // The extension is part of the static prefix on purpose: without it Vite cannot build the
        // glob for a dynamic import and warns on every run.
        const mod = (await import(`../src/components/${name}.tsx`)) as Record<
          string,
          unknown
        >
        for (const symbol of expected)
          expect(Object.keys(mod), `${name}.${symbol}`).toContain(symbol)
      }
    )
  }
})

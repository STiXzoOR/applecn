/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Declaration merging must repeat vitest's type parameters exactly, hence the disabled rules.
import "vitest"
import type { AxeMatchers } from "vitest-axe/matchers"

declare module "vitest" {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, beforeEach, expect } from "vitest"
import * as axeMatchers from "vitest-axe/matchers"

import { installMatchMedia, setViewport } from "./helpers/viewport"

expect.extend(axeMatchers)
installMatchMedia()
beforeEach(() => setViewport("phone"))
afterEach(() => cleanup())

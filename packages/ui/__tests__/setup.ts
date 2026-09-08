import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, beforeEach, expect } from "vitest"
import * as axeMatchers from "vitest-axe/matchers"

import { installResizeObserver } from "./helpers/resize-observer"
import { installScrollIntoView } from "./helpers/scroll-into-view"
import { installMatchMedia, setViewport } from "./helpers/viewport"

expect.extend(axeMatchers)
installMatchMedia()
installResizeObserver()
installScrollIntoView()
beforeEach(() => setViewport("phone"))
afterEach(() => cleanup())

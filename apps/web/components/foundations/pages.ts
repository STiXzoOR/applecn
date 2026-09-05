import type { ComponentType } from "react"

import { ColorPage } from "./color"
import { IconsPage } from "./icons"
import { LayoutPage } from "./layout"
import { MaterialsPage } from "./materials"
import { MotionPage } from "./motion"
import { PlatformsPage } from "./platforms"
import { ShapesPage } from "./shapes"
import { TypographyPage } from "./typography"

export const foundations: Record<string, ComponentType> = {
  color: ColorPage,
  typography: TypographyPage,
  layout: LayoutPage,
  materials: MaterialsPage,
  shapes: ShapesPage,
  motion: MotionPage,
  icons: IconsPage,
  platforms: PlatformsPage,
}

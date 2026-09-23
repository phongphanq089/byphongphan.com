import type { ComponentVariant } from "@/features/component-ui/types"

import PPMarkIsometricBlueprint from "./pp-mark-isometric/pp-mark-isometric-blueprint"
import PPMarkIsometricWireframe from "./pp-mark-isometric/pp-mark-isometric-wireframe"

export const PP_MARK_ISOMETRIC_VARIANTS: ComponentVariant[] = [
  {
    id: "pp-mark-isometric-wireframe",
    title: "Minimalist Wireframe Monogram",
    description:
      "Stripped-back architectural wireframe monogram on deep obsidian canvas with sound feedback.",
    component: PPMarkIsometricWireframe,
  },
  {
    id: "pp-mark-isometric-blueprint",
    title: "Cyan Engineering Blueprint",
    description:
      "Technical blueprint aesthetics with 20px vector grid underlay and azure wireframe strokes.",
    component: PPMarkIsometricBlueprint,
  },
]

export { PPMarkIsometricBlueprint, PPMarkIsometricWireframe }

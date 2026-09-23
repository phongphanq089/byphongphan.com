import type { ComponentVariant } from "@/features/component-ui/types"

import PhongPhanIsometricFull from "./phong-phan-isometric/phong-phan-isometric-full"
import PhongPhanIsometricPadded from "./phong-phan-isometric/phong-phan-isometric-padded"

export const PHONG_PHAN_ISOMETRIC_VARIANTS: ComponentVariant[] = [
  {
    id: "phong-phan-isometric-full",
    title: "Edge-to-Edge Typography",
    description:
      "Full bleed 100% horizontal alignment without lateral buffer padding.",
    component: PhongPhanIsometricFull,
  },
  {
    id: "phong-phan-isometric-padded",
    title: "Padded Blueprint Layout",
    description:
      "Framed horizontal layout with lateral whitespace and extended construction gridlines.",
    component: PhongPhanIsometricPadded,
  },
]

export { PhongPhanIsometricFull, PhongPhanIsometricPadded }

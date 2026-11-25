import type { ComponentVariant } from "@/features/component-ui/types"

import Letter3DSwapCard from "./letter-3d-swap/letter-3d-swap-card"
import Letter3DSwapStagger from "./letter-3d-swap/letter-3d-swap-stagger"

export const LETTER_3D_SWAP_VARIANTS: ComponentVariant[] = [
  {
    id: "letter-3d-swap-stagger",
    title: "Stagger Physics",
    description:
      "Stagger delays comparing center burst vs random character order.",
    component: Letter3DSwapStagger,
  },
  {
    id: "letter-3d-swap-card",
    title: "Feature Card",
    description:
      "Interactive product card with 3D rolling typography titles and actions.",
    component: Letter3DSwapCard,
  },
]

export { Letter3DSwapCard, Letter3DSwapStagger }

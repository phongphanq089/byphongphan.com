import type { ComponentApiDoc } from "../types"

export const GLOW_CARD_API_REFERENCE: ComponentApiDoc[] = [
  {
    componentName: "CardCanvas",
    description:
      "Interactive mouse-tracking wrapper establishing bounding dimensions and local CSS variables (--mouse-x, --mouse-y).",
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Child elements and GlowCard instances sharing the mouse tracking context.",
      },
      {
        name: "className?",
        type: "string",
        description:
          "Custom CSS styles applied to the outer tracking container.",
      },
    ],
  },
  {
    componentName: "GlowCard",
    description:
      "Specular gradient border card with dynamic hover glow and architectural reticle crosshairs.",
    props: [
      {
        name: "showCrosshairs?",
        type: "boolean",
        default: "true",
        description:
          "When enabled, displays technical blueprint reticle crosshairs at each corner that expand on hover.",
      },
      {
        name: "className?",
        type: "string",
        description:
          "Custom container styles including width, height, or border override rules.",
      },
      {
        name: "contentClassName?",
        type: "string",
        description:
          "Custom inner content styling separate from the radial specular border.",
      },
    ],
  },
]

export const GLOW_CARD_USAGE = {
  importCode: `import { CardCanvas, GlowCard } from "@/components/animated-glow-card"`,
  exampleCode: `<CardCanvas className="p-4">
  <GlowCard className="w-full max-w-sm" showCrosshairs={true}>
    <h3 className="font-semibold">Interactive Card</h3>
    <p className="text-xs text-muted-foreground">Specular highlight card</p>
  </GlowCard>
</CardCanvas>`,
}

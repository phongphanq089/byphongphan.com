import type { ComponentApiDoc } from "../types"

export const UNBOXING_BUCKET_API_REFERENCE: ComponentApiDoc[] = [
  {
    componentName: "UnboxingBucket",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    props: [
      {
        name: "chips?",
        type: "UnboxingChipItem[]",
        default: "DEFAULT_CHIPS",
        description:
          "Array of chip items defining icon, title, description, and key id to cycle through the box cavity.",
      },
      {
        name: "intervalMs?",
        type: "number",
        default: "2600",
        description:
          "Auto-rotation interval in milliseconds between unboxing transitions.",
      },
      {
        name: "className?",
        type: "string",
        description: "Custom CSS classes applied to the container wrapper.",
      },
    ],
  },
  {
    componentName: "UnboxingChipItem",
    description: "Data structure for an individual emerging chip item.",
    props: [
      {
        name: "id",
        type: "number | string",
        description: "Unique identifier for React key and animation tracking.",
      },
      {
        name: "title",
        type: "string",
        description: "Main bold title displayed on the chip.",
      },
      {
        name: "description",
        type: "string",
        description: "Subtext caption displayed below the title.",
      },
      {
        name: "icon",
        type: "React.ComponentType<{ className?: string }>",
        description:
          "Lucide or custom icon component rendered inside the chip avatar badge.",
      },
    ],
  },
]

export const UNBOXING_BUCKET_USAGE = {
  importCode: `import { UnboxingBucket } from "@/components/unboxing-bucket"`,
  exampleCode: `<UnboxingBucket
  intervalMs={2600}
  className="py-12"
/>`,
}

import type { ComponentVariant } from "@/features/component-ui/types"

import { MiddleTruncationFileName } from "./middle-truncation/middle-truncation-file-name"
import { MiddleTruncationHash } from "./middle-truncation/middle-truncation-hash"
import { MiddleTruncationMinEnd } from "./middle-truncation/middle-truncation-min-end"
import { MiddleTruncationResizable } from "./middle-truncation/middle-truncation-resizable"

export const MIDDLE_TRUNCATION_VARIANTS: ComponentVariant[] = [
  {
    id: "middle-truncation-resizable",
    title: "Resizable Card Sandbox",
    description:
      "Interactive horizontally resizable panel demonstrating real-time middle truncation with a draggable handle.",
    component: MiddleTruncationResizable,
  },
  {
    id: "middle-truncation-file-name",
    title: "File Extension Truncation",
    description:
      "Preserves the end characters of a file path (e.g. extension and file suffix) using fixed end prop.",
    component: MiddleTruncationFileName,
  },
  {
    id: "middle-truncation-hash",
    title: "Crypto Address / Hash Truncation",
    description:
      "Truncates wallet addresses or cryptographic hashes with custom ellipsis and minimum preserved end characters.",
    component: MiddleTruncationHash,
  },
  {
    id: "middle-truncation-min-end",
    title: "Balanced Split with Min End",
    description:
      "Evenly splits text from the middle while guaranteeing at least a minimum number of characters at the end.",
    component: MiddleTruncationMinEnd,
  },
]

export {
  MiddleTruncationFileName,
  MiddleTruncationHash,
  MiddleTruncationMinEnd,
  MiddleTruncationResizable,
}

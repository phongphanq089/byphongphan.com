import type { ComponentVariant } from "@/features/component-ui/types"

import { CollapsibleCodeBlock } from "./code-block/collapsible-code-block"
import { DiagnosticsCodeBlock } from "./code-block/diagnostics-code-block"
import { DiffCodeBlock } from "./code-block/diff-code-block"
import { ToolbarCodeBlock } from "./code-block/toolbar-code-block"

export const CODE_BLOCK_VARIANTS: ComponentVariant[] = [
  {
    id: "diff-code-block",
    title: "Git Diff & Patch Review",
    description:
      "Visual addition and deletion diff gutters for pull request patch reviews.",
    component: DiffCodeBlock,
  },
  {
    id: "diagnostics-code-block",
    title: "Diagnostic Severity Levels",
    description:
      "Inline compiler and linter diagnostics with error, warning, and info levels.",
    component: DiagnosticsCodeBlock,
  },
  {
    id: "collapsible-code-block",
    title: "Collapsible with Max Lines",
    description:
      "Clamped height with floating expand button and smooth gradient fade.",
    component: CollapsibleCodeBlock,
  },
  {
    id: "toolbar-code-block",
    title: "Action Toolbar with Wrap & Download",
    description:
      "Full header toolbar with soft-wrap toggle, file download, and copy actions.",
    component: ToolbarCodeBlock,
  },
]

export {
  CollapsibleCodeBlock,
  DiagnosticsCodeBlock,
  DiffCodeBlock,
  ToolbarCodeBlock,
}

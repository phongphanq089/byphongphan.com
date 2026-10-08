import type { RegistryItem } from "./schema"
import {
  BackgroundGradientCursorSchematic,
  CardSchematic,
  CodeBlockSchematic,
  FlipClockSchematic,
  LineNavSchematic,
  MapSchematic,
  MiddleTruncationSchematic,
  PhongPhanIsometricSchematic,
  PPMarkIsometricSchematic,
  SelectSchematic,
  TextHoverEffectSchematic,
  UnboxingBucketSchematic,
} from "./schematics"

export const REGISTRY_ITEMS: RegistryItem[] = [
  {
    name: "line-nav",
    title: "Line Nav",
    description:
      "Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants.",
    type: "registry:component",
    category: "animations",
    schematic: LineNavSchematic,
    schematicType: "line-nav",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/line-nav.tsx",
        type: "registry:component",
        target: "components/line-nav.tsx",
      },
    ],
  },
  {
    name: "middle-truncation",
    title: "Middle Truncation",
    description:
      "Canvas-measured binary search text truncation preserving the start and end of strings with responsive resize sync.",
    type: "registry:ui",
    category: "primitives",
    schematic: MiddleTruncationSchematic,
    schematicType: "middle-truncation",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "ui/middle-truncation.tsx",
        type: "registry:ui",
        target: "components/ui/middle-truncation.tsx",
      },
    ],
  },
  {
    name: "select",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    type: "registry:ui",
    category: "primitives",
    schematic: SelectSchematic,
    schematicType: "select",
    isNew: true,
    dependencies: ["radix-ui", "lucide-react"],
    registryDependencies: [],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
        target: "components/ui/select.tsx",
      },
    ],
  },
  {
    name: "card",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    type: "registry:ui",
    category: "primitives",
    schematic: CardSchematic,
    schematicType: "card",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
        target: "components/ui/card.tsx",
      },
    ],
  },
  {
    name: "unboxing-bucket",
    title: "Unboxing Bucket",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    type: "registry:component",
    category: "animations",
    schematic: UnboxingBucketSchematic,
    schematicType: "unboxing-bucket",
    dependencies: ["motion", "lucide-react"],
    registryDependencies: ["use-media-query"],
    files: [
      {
        path: "animated/unboxing-bucket.tsx",
        type: "registry:component",
        target: "components/unboxing-bucket.tsx",
      },
    ],
  },
  {
    name: "flip-clock",
    title: "Flip Clock",
    description:
      "Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes.",
    type: "registry:component",
    category: "animations",
    schematic: FlipClockSchematic,
    schematicType: "flip-clock",
    isNew: true,
    dependencies: ["motion", "@rexa-developer/tiks"],
    registryDependencies: [],
    files: [
      {
        path: "animated/flip-clock.tsx",
        type: "registry:component",
        target: "components/flip-clock.tsx",
      },
    ],
  },
  {
    name: "use-media-query",
    title: "useMediaQuery",
    description:
      "React hook for responsive design and media query listening with SSR support.",
    type: "registry:hook",
    category: "foundations",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
        target: "hooks/use-media-query.ts",
      },
    ],
  },
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    type: "registry:ui",
    category: "primitives",
    schematic: CodeBlockSchematic,
    schematicType: "code-block",
    dependencies: ["shiki", "lucide-react"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/code-block/code-block.tsx",
        type: "registry:ui",
        target: "components/ui/code-block/code-block.tsx",
      },
      {
        path: "ui/code-block/code-block-highlight.tsx",
        type: "registry:ui",
        target: "components/ui/code-block/code-block-highlight.tsx",
      },
      {
        path: "ui/code-block/index.ts",
        type: "registry:ui",
        target: "components/ui/code-block/index.ts",
      },
    ],
  },
  {
    name: "map",
    title: "Map",
    description:
      "High-performance interactive vector map powered by MapLibre GL with dark/light themes, custom markers, popups, controls, routes, arcs, GeoJSON, and clustering.",
    type: "registry:ui",
    category: "primitives",
    schematic: MapSchematic,
    schematicType: "map",
    isNew: true,
    dependencies: ["maplibre-gl", "lucide-react"],
    registryDependencies: [],
    files: [
      {
        path: "ui/map.tsx",
        type: "registry:ui",
        target: "components/ui/map.tsx",
      },
    ],
  },
  {
    name: "text-hover-effect",
    title: "Text Hover Effect",
    description:
      "Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement.",
    type: "registry:component",
    category: "animations",
    schematic: TextHoverEffectSchematic,
    schematicType: "text-hover-effect",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/text-hover-effect.tsx",
        type: "registry:component",
        target: "components/text-hover-effect.tsx",
      },
    ],
  },
  {
    name: "background-gradient-cursor",
    title: "Background Gradient Cursor",
    description:
      "Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients.",
    type: "registry:component",
    category: "animations",
    schematic: BackgroundGradientCursorSchematic,
    schematicType: "background-gradient-cursor",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "animated/background-gradient-cursor.tsx",
        type: "registry:component",
        target: "components/background-gradient-cursor.tsx",
      },
    ],
  },
  {
    name: "pp-mark-isometric",
    title: "Isometric Monogram Mark",
    description:
      "Interactive 3D voxel isometric monogram mark featuring procedural diagonal hatching, wireframe edges, cursor-tracking radial flashlight, and spring press physics with audio feedback.",
    type: "registry:component",
    category: "animations",
    schematic: PPMarkIsometricSchematic,
    schematicType: "pp-mark-isometric",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/pp-mark-isometric.tsx",
        type: "registry:component",
        target: "components/pp-mark-isometric.tsx",
      },
    ],
  },
  {
    name: "phong-phan-isometric",
    title: "Isometric Block Typography",
    description:
      "Horizontal 3D block typography extruded along an isometric blueprint grid, equipped with interactive dynamic lighting, sound feedback, and edge-to-edge/padded layout variants.",
    type: "registry:component",
    category: "animations",
    schematic: PhongPhanIsometricSchematic,
    schematicType: "phong-phan-isometric",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/phong-phan-isometric.tsx",
        type: "registry:component",
        target: "components/phong-phan-isometric.tsx",
      },
    ],
  },
  {
    name: "not-found-01",
    title: "Not Found 01",
    description: "A 404 page with a playable brick breaker game.",
    type: "registry:block",
    category: "application",
    isNew: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["button"],
    files: [
      {
        path: "block/not-found-01/app/not-found.tsx",
        type: "registry:block",
        target: "app/not-found.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/index.tsx",
        type: "registry:block",
        target: "components/daikanoid/index.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/component.tsx",
        type: "registry:block",
        target: "components/daikanoid/component.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/ball.ts",
        type: "registry:block",
        target: "components/daikanoid/ball.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/brick.ts",
        type: "registry:block",
        target: "components/daikanoid/brick.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/paddle.ts",
        type: "registry:block",
        target: "components/daikanoid/paddle.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/constants.ts",
        type: "registry:block",
        target: "components/daikanoid/constants.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/colors.ts",
        type: "registry:block",
        target: "components/daikanoid/colors.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/types.ts",
        type: "registry:block",
        target: "components/daikanoid/types.ts",
      },
    ],
  },
  {
    name: "not-found-02",
    title: "Not Found Gravity",
    description:
      "Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.",
    type: "registry:block",
    category: "application",
    isNew: true,
    dependencies: [
      "matter-js",
      "poly-decomp",
      "svg-path-commander",
      "lucide-react",
    ],
    registryDependencies: ["button"],
    files: [
      {
        path: "block/not-found-02/app/not-found.tsx",
        type: "registry:block",
        target: "app/not-found.tsx",
      },
      {
        path: "block/not-found-02/components/gravity.tsx",
        type: "registry:block",
        target: "components/gravity.tsx",
      },
    ],
  },
  {
    name: "editor",
    title: "Rich Text Editor",
    description:
      "Modern Lexical rich text editor featuring top toolbar, floating bubble menu, slash commands, markdown shortcuts, and interactive widgets.",
    type: "registry:block",
    category: "application",
    isNew: true,
    dependencies: [
      "@lexical/clipboard",
      "@lexical/code",
      "@lexical/code-prism",
      "@lexical/extension",
      "@lexical/file",
      "@lexical/hashtag",
      "@lexical/history",
      "@lexical/html",
      "@lexical/link",
      "@lexical/list",
      "@lexical/mark",
      "@lexical/markdown",
      "@lexical/overflow",
      "@lexical/plain-text",
      "@lexical/react",
      "@lexical/rich-text",
      "@lexical/selection",
      "@lexical/table",
      "@lexical/utils",
      "lexical",
      "lucide-react",
      "katex",
    ],
    registryDependencies: [
      "button",
      "dialog",
      "dropdown-menu",
      "popover",
      "tooltip",
      "separator",
    ],
    files: [
      {
        path: "block/editor/app/page.tsx",
        type: "registry:block",
        target: "app/page.tsx",
      },
      {
        path: "block/editor/components/block-with-alignable-contents.tsx",
        type: "registry:block",
        target: "components/block-with-alignable-contents.tsx",
      },
      {
        path: "block/editor/components/editor-footer.tsx",
        type: "registry:block",
        target: "components/editor-footer.tsx",
      },
      {
        path: "block/editor/components/floating-action-dock.tsx",
        type: "registry:block",
        target: "components/floating-action-dock.tsx",
      },
      {
        path: "block/editor/components/inspector-dialog.tsx",
        type: "registry:block",
        target: "components/inspector-dialog.tsx",
      },
      {
        path: "block/editor/components/ui/button.tsx",
        type: "registry:block",
        target: "components/ui/button.tsx",
      },
      {
        path: "block/editor/components/ui/dialog.tsx",
        type: "registry:block",
        target: "components/ui/dialog.tsx",
      },
      {
        path: "block/editor/components/ui/dropdown-menu.tsx",
        type: "registry:block",
        target: "components/ui/dropdown-menu.tsx",
      },
      {
        path: "block/editor/components/ui/flash-message.tsx",
        type: "registry:block",
        target: "components/ui/flash-message.tsx",
      },
      {
        path: "block/editor/components/ui/modal.tsx",
        type: "registry:block",
        target: "components/ui/modal.tsx",
      },
      {
        path: "block/editor/components/ui/popover.tsx",
        type: "registry:block",
        target: "components/ui/popover.tsx",
      },
      {
        path: "block/editor/components/ui/separator.tsx",
        type: "registry:block",
        target: "components/ui/separator.tsx",
      },
      {
        path: "block/editor/components/ui/tooltip.tsx",
        type: "registry:block",
        target: "components/ui/tooltip.tsx",
      },
      {
        path: "block/editor/core/context/flash-message-context.tsx",
        type: "registry:block",
        target: "core/context/flash-message-context.tsx",
      },
      {
        path: "block/editor/core/context/setting-context.tsx",
        type: "registry:block",
        target: "core/context/setting-context.tsx",
      },
      {
        path: "block/editor/core/context/toolbar-context.tsx",
        type: "registry:block",
        target: "core/context/toolbar-context.tsx",
      },
      {
        path: "block/editor/core/page-setup/index.ts",
        type: "registry:block",
        target: "core/page-setup/index.ts",
      },
      {
        path: "block/editor/core/page-setup/page-setup-context.tsx",
        type: "registry:block",
        target: "core/page-setup/page-setup-context.tsx",
      },
      {
        path: "block/editor/core/page-setup/page-setup-dialog.tsx",
        type: "registry:block",
        target: "core/page-setup/page-setup-dialog.tsx",
      },
      {
        path: "block/editor/core/page-setup/page-setup-plugin.tsx",
        type: "registry:block",
        target: "core/page-setup/page-setup-plugin.tsx",
      },
      {
        path: "block/editor/core/page-setup/types.ts",
        type: "registry:block",
        target: "core/page-setup/types.ts",
      },
      {
        path: "block/editor/core/themes/comment-editor-theme.ts",
        type: "registry:block",
        target: "core/themes/comment-editor-theme.ts",
      },
      {
        path: "block/editor/core/themes/editor-theme.ts",
        type: "registry:block",
        target: "core/themes/editor-theme.ts",
      },
      {
        path: "block/editor/core/themes/index.ts",
        type: "registry:block",
        target: "core/themes/index.ts",
      },
      {
        path: "block/editor/core/themes/playground-editor-theme.ts",
        type: "registry:block",
        target: "core/themes/playground-editor-theme.ts",
      },
      {
        path: "block/editor/core/themes/sticky-editor-theme.ts",
        type: "registry:block",
        target: "core/themes/sticky-editor-theme.ts",
      },
      {
        path: "block/editor/core/ui/modal.tsx",
        type: "registry:block",
        target: "core/ui/modal.tsx",
      },
      {
        path: "block/editor/editor.tsx",
        type: "registry:block",
        target: "editor.tsx",
      },
      {
        path: "block/editor/hooks/use-flash-message.tsx",
        type: "registry:block",
        target: "hooks/use-flash-message.tsx",
      },
      {
        path: "block/editor/hooks/use-modal.tsx",
        type: "registry:block",
        target: "hooks/use-modal.tsx",
      },
      {
        path: "block/editor/hooks/use-report.ts",
        type: "registry:block",
        target: "hooks/use-report.ts",
      },
      {
        path: "block/editor/index.ts",
        type: "registry:block",
        target: "index.ts",
      },
      {
        path: "block/editor/nodes/collapsible-nodes.ts",
        type: "registry:block",
        target: "nodes/collapsible-nodes.ts",
      },
      {
        path: "block/editor/nodes/equation-node.tsx",
        type: "registry:block",
        target: "nodes/equation-node.tsx",
      },
      {
        path: "block/editor/nodes/excalidraw/excalidraw-component.tsx",
        type: "registry:block",
        target: "nodes/excalidraw/excalidraw-component.tsx",
      },
      {
        path: "block/editor/nodes/excalidraw/excalidraw-image.tsx",
        type: "registry:block",
        target: "nodes/excalidraw/excalidraw-image.tsx",
      },
      {
        path: "block/editor/nodes/excalidraw/excalidraw-modal.tsx",
        type: "registry:block",
        target: "nodes/excalidraw/excalidraw-modal.tsx",
      },
      {
        path: "block/editor/nodes/excalidraw/types.ts",
        type: "registry:block",
        target: "nodes/excalidraw/types.ts",
      },
      {
        path: "block/editor/nodes/excalidraw-node.tsx",
        type: "registry:block",
        target: "nodes/excalidraw-node.tsx",
      },
      {
        path: "block/editor/nodes/figma-node.tsx",
        type: "registry:block",
        target: "nodes/figma-node.tsx",
      },
      {
        path: "block/editor/nodes/image-node.tsx",
        type: "registry:block",
        target: "nodes/image-node.tsx",
      },
      {
        path: "block/editor/nodes/index.ts",
        type: "registry:block",
        target: "nodes/index.ts",
      },
      {
        path: "block/editor/nodes/layout-nodes.ts",
        type: "registry:block",
        target: "nodes/layout-nodes.ts",
      },
      {
        path: "block/editor/nodes/mention-node.ts",
        type: "registry:block",
        target: "nodes/mention-node.ts",
      },
      {
        path: "block/editor/nodes/page-break-node.tsx",
        type: "registry:block",
        target: "nodes/page-break-node.tsx",
      },
      {
        path: "block/editor/nodes/poll-node.tsx",
        type: "registry:block",
        target: "nodes/poll-node.tsx",
      },
      {
        path: "block/editor/nodes/sticky-node.tsx",
        type: "registry:block",
        target: "nodes/sticky-node.tsx",
      },
      {
        path: "block/editor/nodes/tweet-node.tsx",
        type: "registry:block",
        target: "nodes/tweet-node.tsx",
      },
      {
        path: "block/editor/nodes/youtube-node.tsx",
        type: "registry:block",
        target: "nodes/youtube-node.tsx",
      },
      {
        path: "block/editor/plugins/auto-embed/index.tsx",
        type: "registry:block",
        target: "plugins/auto-embed/index.tsx",
      },
      {
        path: "block/editor/plugins/auto-link/index.tsx",
        type: "registry:block",
        target: "plugins/auto-link/index.tsx",
      },
      {
        path: "block/editor/plugins/basic-toolbar/index.tsx",
        type: "registry:block",
        target: "plugins/basic-toolbar/index.tsx",
      },
      {
        path: "block/editor/plugins/code-action-menu/index.tsx",
        type: "registry:block",
        target: "plugins/code-action-menu/index.tsx",
      },
      {
        path: "block/editor/plugins/code-highlight/index.tsx",
        type: "registry:block",
        target: "plugins/code-highlight/index.tsx",
      },
      {
        path: "block/editor/plugins/collapsible/index.tsx",
        type: "registry:block",
        target: "plugins/collapsible/index.tsx",
      },
      {
        path: "block/editor/plugins/draggable-block/index.tsx",
        type: "registry:block",
        target: "plugins/draggable-block/index.tsx",
      },
      {
        path: "block/editor/plugins/emojis/index.tsx",
        type: "registry:block",
        target: "plugins/emojis/index.tsx",
      },
      {
        path: "block/editor/plugins/equations/index.tsx",
        type: "registry:block",
        target: "plugins/equations/index.tsx",
      },
      {
        path: "block/editor/plugins/excalidraw/index.tsx",
        type: "registry:block",
        target: "plugins/excalidraw/index.tsx",
      },
      {
        path: "block/editor/plugins/floating-link-editor/index.tsx",
        type: "registry:block",
        target: "plugins/floating-link-editor/index.tsx",
      },
      {
        path: "block/editor/plugins/floating-toolbar/index.tsx",
        type: "registry:block",
        target: "plugins/floating-toolbar/index.tsx",
      },
      {
        path: "block/editor/plugins/images/index.tsx",
        type: "registry:block",
        target: "plugins/images/index.tsx",
      },
      {
        path: "block/editor/plugins/images/insert-image-dialog.tsx",
        type: "registry:block",
        target: "plugins/images/insert-image-dialog.tsx",
      },
      {
        path: "block/editor/plugins/layout/index.tsx",
        type: "registry:block",
        target: "plugins/layout/index.tsx",
      },
      {
        path: "block/editor/plugins/layout/insert-layout-dialog.tsx",
        type: "registry:block",
        target: "plugins/layout/insert-layout-dialog.tsx",
      },
      {
        path: "block/editor/plugins/layout/layout-action-menu.tsx",
        type: "registry:block",
        target: "plugins/layout/layout-action-menu.tsx",
      },
      {
        path: "block/editor/plugins/mentions/index.tsx",
        type: "registry:block",
        target: "plugins/mentions/index.tsx",
      },
      {
        path: "block/editor/plugins/mobile-toolbar/index.tsx",
        type: "registry:block",
        target: "plugins/mobile-toolbar/index.tsx",
      },
      {
        path: "block/editor/plugins/on-change/index.tsx",
        type: "registry:block",
        target: "plugins/on-change/index.tsx",
      },
      {
        path: "block/editor/plugins/page-break/index.tsx",
        type: "registry:block",
        target: "plugins/page-break/index.tsx",
      },
      {
        path: "block/editor/plugins/poll/index.tsx",
        type: "registry:block",
        target: "plugins/poll/index.tsx",
      },
      {
        path: "block/editor/plugins/shortcuts/index.tsx",
        type: "registry:block",
        target: "plugins/shortcuts/index.tsx",
      },
      {
        path: "block/editor/plugins/shortcuts/shortcuts-data.ts",
        type: "registry:block",
        target: "plugins/shortcuts/shortcuts-data.ts",
      },
      {
        path: "block/editor/plugins/shortcuts/shortcuts-dialog.tsx",
        type: "registry:block",
        target: "plugins/shortcuts/shortcuts-dialog.tsx",
      },
      {
        path: "block/editor/plugins/sidebar-insert/drag-drop-plugin.tsx",
        type: "registry:block",
        target: "plugins/sidebar-insert/drag-drop-plugin.tsx",
      },
      {
        path: "block/editor/plugins/sidebar-insert/index.ts",
        type: "registry:block",
        target: "plugins/sidebar-insert/index.ts",
      },
      {
        path: "block/editor/plugins/sidebar-insert/insert-helpers.ts",
        type: "registry:block",
        target: "plugins/sidebar-insert/insert-helpers.ts",
      },
      {
        path: "block/editor/plugins/sidebar-insert/sidebar-panel.tsx",
        type: "registry:block",
        target: "plugins/sidebar-insert/sidebar-panel.tsx",
      },
      {
        path: "block/editor/plugins/sidebar-insert/types.ts",
        type: "registry:block",
        target: "plugins/sidebar-insert/types.ts",
      },
      {
        path: "block/editor/plugins/slash-command/index.tsx",
        type: "registry:block",
        target: "plugins/slash-command/index.tsx",
      },
      {
        path: "block/editor/plugins/speech-to-text/index.tsx",
        type: "registry:block",
        target: "plugins/speech-to-text/index.tsx",
      },
      {
        path: "block/editor/plugins/sticky/index.tsx",
        type: "registry:block",
        target: "plugins/sticky/index.tsx",
      },
      {
        path: "block/editor/plugins/table-action-menu/index.tsx",
        type: "registry:block",
        target: "plugins/table-action-menu/index.tsx",
      },
      {
        path: "block/editor/plugins/table-cell-resizer/index.tsx",
        type: "registry:block",
        target: "plugins/table-cell-resizer/index.tsx",
      },
      {
        path: "block/editor/plugins/table-hover-actions/index.tsx",
        type: "registry:block",
        target: "plugins/table-hover-actions/index.tsx",
      },
      {
        path: "block/editor/plugins/table-of-contents/index.tsx",
        type: "registry:block",
        target: "plugins/table-of-contents/index.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/align-dropdown.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/align-dropdown.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/block-format-dropdown.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/block-format-dropdown.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/code-language-dropdown.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/code-language-dropdown.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/color-picker.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/color-picker.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/font-size-control.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/font-size-control.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/insert-dropdown.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/insert-dropdown.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/components/page-setup-dropdown.tsx",
        type: "registry:block",
        target: "plugins/toolbar/components/page-setup-dropdown.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/index.tsx",
        type: "registry:block",
        target: "plugins/toolbar/index.tsx",
      },
      {
        path: "block/editor/plugins/toolbar/utils.ts",
        type: "registry:block",
        target: "plugins/toolbar/utils.ts",
      },
      {
        path: "block/editor/setting/app-settings.ts",
        type: "registry:block",
        target: "setting/app-settings.ts",
      },
      {
        path: "block/editor/styles/editor.css",
        type: "registry:block",
        target: "styles/editor.css",
      },
      {
        path: "block/editor/types.ts",
        type: "registry:block",
        target: "types.ts",
      },
      {
        path: "block/editor/utils/code-languages.ts",
        type: "registry:block",
        target: "utils/code-languages.ts",
      },
      {
        path: "block/editor/utils/cn.ts",
        type: "registry:block",
        target: "utils/cn.ts",
      },
      {
        path: "block/editor/utils/export-html.ts",
        type: "registry:block",
        target: "utils/export-html.ts",
      },
      {
        path: "block/editor/utils/get-selected-node.ts",
        type: "registry:block",
        target: "utils/get-selected-node.ts",
      },
      {
        path: "block/editor/utils/url.ts",
        type: "registry:block",
        target: "utils/url.ts",
      },
    ],
  },
]

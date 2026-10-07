import {
  CHECK_LIST,
  TRANSFORMERS,
  type ElementTransformer,
  type TextMatchTransformer,
  type Transformer,
} from "@lexical/markdown"

import {
  $createEquationNode,
  $isEquationNode,
  EquationNode,
} from "../nodes/equation-node"
import { $createImageNode, $isImageNode, ImageNode } from "../nodes/image-node"

/**
 * Image Markdown Transformer
 * Supports:
 * - ![alt text](url)
 * - ![alt text](url "caption")
 */
export const IMAGE_TRANSFORMER: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) return null
    const caption = node.__caption ? ` "${node.__caption}"` : ""
    return `![${node.getAltText()}](${node.getSrc()}${caption})`
  },
  importRegExp: /!(?:\[([^\]]*)\])(?:\(([^\s)]+)(?:\s+"([^"]*)")?\))/,
  regExp: /!(?:\[([^\]]*)\])(?:\(([^\s)]+)(?:\s+"([^"]*)")?\))$/,
  replace: (textNode, match) => {
    const [, altText, src, caption] = match
    const imageNode = $createImageNode({
      altText: altText || "Image",
      src,
      caption,
    })
    textNode.replace(imageNode)
  },
  trigger: ")",
  type: "text-match",
}

/**
 * LaTeX Equation Markdown Transformer
 * Supports:
 * - $inline math$
 * - $$block formula$$
 */
export const EQUATION_TRANSFORMER: TextMatchTransformer = {
  dependencies: [EquationNode],
  export: (node) => {
    if (!$isEquationNode(node)) return null
    return node.__inline ? `$${node.__equation}$` : `$$${node.__equation}$$`
  },
  importRegExp: /\$([^$]+)\$/,
  regExp: /\$([^$]+)\$$/,
  replace: (textNode, match) => {
    const [, equation] = match
    const equationNode = $createEquationNode(equation, true)
    textNode.replace(equationNode)
  },
  trigger: "$",
  type: "text-match",
}

/**
 * Unified Markdown Transformer Suite for Universal Editor
 * Includes custom Decorator Nodes (Images, Equations) and standard GFM/Lexical transformers.
 */
export const EDITOR_TRANSFORMERS: Transformer[] = [
  IMAGE_TRANSFORMER,
  EQUATION_TRANSFORMER,
  CHECK_LIST,
  ...TRANSFORMERS,
]

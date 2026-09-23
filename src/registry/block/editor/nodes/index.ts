import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import type { Klass, LexicalNode } from "lexical"

import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
} from "./collapsible-nodes"
import { EquationNode } from "./equation-node"
import { ExcalidrawNode } from "./excalidraw-node"
import { FigmaNode } from "./figma-node"
import { ImageNode } from "./image-node"
import { LayoutContainerNode, LayoutItemNode } from "./layout-nodes"
import { MentionNode } from "./mention-node"
import { PageBreakNode } from "./page-break-node"
import { PollNode } from "./poll-node"
import { StickyNode } from "./sticky-node"
import { TweetNode } from "./tweet-node"
import { YouTubeNode } from "./youtube-node"

export const DEFAULT_NODES: Array<Klass<LexicalNode>> = [
  StickyNode,
  MentionNode,
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
  // New Playground Nodes
  ImageNode,
  YouTubeNode,
  FigmaNode,
  TweetNode,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  LayoutContainerNode,
  LayoutItemNode,
  PollNode,
  EquationNode,
  PageBreakNode,
  ExcalidrawNode,
]

export {
  AutoLinkNode,
  CodeHighlightNode,
  CodeNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  EquationNode,
  ExcalidrawNode,
  FigmaNode,
  HeadingNode,
  HorizontalRuleNode,
  ImageNode,
  LayoutContainerNode,
  LayoutItemNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MentionNode,
  PageBreakNode,
  PollNode,
  QuoteNode,
  StickyNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  TweetNode,
  YouTubeNode,
}

export * from "./collapsible-nodes"
export * from "./equation-node"
export * from "./excalidraw-node"
export * from "./figma-node"
export * from "./image-node"
export * from "./layout-nodes"
export * from "./mention-node"
export * from "./page-break-node"
export * from "./poll-node"
export * from "./sticky-node"
export * from "./tweet-node"
export * from "./youtube-node"

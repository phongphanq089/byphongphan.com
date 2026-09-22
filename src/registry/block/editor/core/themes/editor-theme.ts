import "../../styles/editor.css"

import type { EditorThemeClasses } from "lexical"

/**
 * Editor Theme — Editorial Precision Design System
 *
 * Aesthetic: "Refined Tool" — crisp hierarchy, deliberate color, zero decoration without intent.
 * Differentiation: Headings have progressive weight/tracking contrast (not just size bumps).
 *   H1: display weight + tight tracking → editorial authority
 *   H2: slightly looser → section clarity
 *   H3+: functional, not decorative
 */
export const editorTheme: EditorThemeClasses = {
  autocomplete: "text-muted-foreground/50 italic",
  blockCursor: "editor-block-cursor",
  characterLimit: "bg-destructive/15 text-destructive",

  /* Code: strong background contrast, left accent stripe via CSS class */
  code: "editor-code-block bg-muted/60 dark:bg-muted/40 block px-4 py-3.5 rounded-r-lg font-mono text-[0.82rem] my-4 overflow-x-auto border border-border/50 dark:border-border/30 text-foreground leading-[1.65]",

  codeHighlight: {
    atrule: "text-blue-500 dark:text-blue-400",
    attr: "text-cyan-600 dark:text-cyan-300",
    boolean: "text-violet-500 dark:text-violet-400 font-medium",
    builtin: "text-teal-600 dark:text-teal-400",
    cdata: "text-muted-foreground/60 italic",
    char: "text-teal-600 dark:text-teal-400",
    class: "text-indigo-600 dark:text-indigo-400 font-semibold",
    "class-name": "text-indigo-600 dark:text-indigo-400 font-semibold",
    comment: "text-muted-foreground/55 italic",
    constant: "text-amber-600 dark:text-amber-400",
    deleted: "bg-red-500/15 text-red-600 dark:text-red-400",
    doctype: "text-muted-foreground/55 italic",
    entity: "text-amber-600 dark:text-amber-400",
    function: "text-indigo-600 dark:text-sky-300 font-medium",
    important: "text-orange-600 dark:text-orange-400 font-bold",
    inserted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    keyword: "text-rose-500 dark:text-rose-400 font-semibold",
    namespace: "text-orange-600 dark:text-orange-400",
    number: "text-emerald-600 dark:text-emerald-400",
    operator: "text-foreground/80",
    prolog: "text-muted-foreground/55 italic",
    property: "text-violet-600 dark:text-violet-400",
    punctuation: "text-muted-foreground/60",
    regex: "text-orange-600 dark:text-orange-400",
    selector: "text-teal-600 dark:text-teal-400",
    string: "text-emerald-600 dark:text-emerald-300",
    symbol: "text-amber-600 dark:text-amber-400",
    tag: "text-rose-500 dark:text-rose-400",
    url: "text-blue-600 dark:text-blue-400 underline underline-offset-2",
    variable: "text-orange-600 dark:text-orange-400",
  },

  embedBlock: {
    /* Embed blocks: no generic ring — use a subtle shadow on selection */
    base: "select-none my-5 rounded-lg",
    focus:
      "ring-2 ring-primary/40 ring-offset-1 ring-offset-background shadow-lg",
  },

  hashtag:
    "text-primary/90 bg-primary/8 px-1.5 py-0.5 rounded-md text-[0.8em] font-medium tracking-tight",

  heading: {
    /* H1 — editorial authority: heavy weight, ultra-tight tracking, meaningful top margin */
    h1: "text-[1.875rem] font-bold tracking-[-0.04em] mt-8 mb-3 text-foreground leading-[1.15]",
    /* H2 — section marker: strong but breathable */
    h2: "text-[1.35rem] font-semibold tracking-[-0.025em] mt-7 mb-2.5 text-foreground leading-[1.25]",
    /* H3 — subsection: clean, purposeful */
    h3: "text-[1.1rem] font-semibold tracking-[-0.015em] mt-5 mb-2 text-foreground leading-[1.35]",
    /* H4–H6 — functional, not decorative */
    h4: "text-[0.975rem] font-semibold tracking-[-0.01em] mt-4 mb-1.5 text-foreground",
    h5: "text-[0.9rem] font-medium mt-3 mb-1 text-foreground",
    h6: "text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground mt-2.5 mb-1",
  },

  hr: "my-8 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent",
  hrSelected: "my-8 border-none h-px bg-primary/40",

  image: "editor-image max-w-full my-5 cursor-pointer",

  indent: "pl-8",

  /* Layout: cleaner gap with visible but soft divider */
  layoutContainer: "grid gap-4 my-5",
  layoutItem:
    "border border-dashed border-border/50 p-3.5 rounded-lg min-w-0 max-w-full transition-colors hover:border-border",

  link: "text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary transition-all duration-100 cursor-pointer",

  list: {
    checklist: "space-y-2 my-3",
    listitem: "leading-relaxed pl-1",
    listitemChecked: "editor-checklist-item-checked",
    listitemUnchecked: "editor-checklist-item",
    nested: {
      listitem: "list-none pl-4",
    },
    ol: "list-decimal list-outside ml-6 my-3 space-y-1.5 text-foreground",
    olDepth: [
      "list-decimal",
      "list-[upper-alpha]",
      "list-[lower-alpha]",
      "list-[upper-roman]",
      "list-[lower-roman]",
    ],
    ul: "list-disc list-outside ml-6 my-3 space-y-1.5 text-foreground",
  },

  mark: "bg-amber-200/60 dark:bg-amber-900/50 dark:text-amber-100 rounded-[3px] px-0.5",
  markOverlap:
    "bg-amber-300/80 dark:bg-amber-800/70 dark:text-amber-50 rounded-[3px] px-0.5",

  /* Paragraph: generous line-height for reading comfort, controlled bottom margin */
  paragraph: "relative mb-2.5 leading-[1.72] text-foreground text-[0.9375rem]",

  /* Quote: Left bar becomes the design element, not background fill */
  quote:
    "border-l-[3px] border-primary/50 pl-4 italic my-5 text-muted-foreground py-1 leading-relaxed",

  /* Table: clean lines, no heavy borders */
  table:
    "border-collapse border border-border/60 my-5 w-full text-[0.875rem] rounded-lg overflow-hidden",
  tableAddColumns:
    "bg-muted/50 hover:bg-muted text-muted-foreground transition-colors",
  tableAddRows:
    "bg-muted/50 hover:bg-muted text-muted-foreground transition-colors",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell:
    "border border-border/50 px-3 py-2 align-top relative min-w-[80px] text-foreground text-[0.875rem]",
  tableCellActionButton:
    "size-5 rounded-full bg-muted/80 text-foreground hover:bg-muted transition-colors",
  tableCellActionButtonContainer: "absolute right-1 top-1 z-10",
  tableCellHeader:
    "border border-border/50 px-3 py-2.5 font-semibold bg-muted/40 text-left text-foreground text-[0.8rem] uppercase tracking-wide",
  tableCellResizer: "editor-table-resizer",
  tableCellSelected: "bg-primary/8",
  tableRowStriping: "even:bg-muted/20",
  tableScrollableWrapper: "overflow-x-auto my-5",
  tableSelected: "ring-2 ring-primary/50",

  text: {
    bold: "font-semibold",
    capitalize: "capitalize",
    /* Inline code: primary tint, clear mono contrast */
    code: "bg-muted/70 dark:bg-muted/50 px-1.5 py-0.5 rounded-[4px] font-mono text-[0.8em] text-primary font-medium border border-border/40",
    highlight:
      "bg-amber-200/60 dark:bg-amber-900/50 dark:text-amber-100 rounded-[3px] px-0.5",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through",
    subscript: "align-sub text-[0.75em]",
    superscript: "align-super text-[0.75em]",
    underline: "underline underline-offset-[3px]",
    underlineStrikethrough: "underline underline-offset-[3px] line-through",
    uppercase: "uppercase",
  },
}

export default editorTheme

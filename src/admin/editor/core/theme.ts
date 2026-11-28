import type { EditorThemeClasses } from "lexical"

/**
 * Maps Lexical's internal node/format keys to Tailwind CSS utility classes.
 * Lexical applies these classes directly to the DOM elements it renders.
 */
export const lexicalTheme: EditorThemeClasses = {
  paragraph: "mb-2.5 leading-7 last:mb-0",
  quote: "my-3 border-l-2 border-primary/50 pl-4 italic text-muted-foreground",
  heading: {
    h1: "mt-5 mb-2.5 text-2xl font-bold tracking-tight text-foreground first:mt-0",
    h2: "mt-4 mb-2 text-xl font-semibold tracking-tight text-foreground first:mt-0",
    h3: "mt-3.5 mb-1.5 text-lg font-semibold text-foreground first:mt-0",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "my-2.5 ml-5 list-decimal space-y-1",
    ul: "my-2.5 ml-5 list-disc space-y-1",
    listitem: "leading-7",
  },
  link: "font-medium text-primary underline underline-offset-4 hover:opacity-80",
  code: "my-3 block overflow-x-auto rounded-lg border border-border/70 bg-muted/50 px-4 py-3 font-mono text-xs leading-relaxed text-foreground",
  text: {
    bold: "font-semibold text-foreground",
    italic: "italic",
    underline: "underline underline-offset-2",
    strikethrough: "line-through text-muted-foreground",
    underlineStrikethrough: "underline line-through",
    code: "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
  },
}

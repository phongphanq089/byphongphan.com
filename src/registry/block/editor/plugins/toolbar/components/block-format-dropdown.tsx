import type { LexicalEditor } from "lexical"
import {
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Pilcrow,
  Quote,
} from "lucide-react"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from "../utils"

const BLOCK_CONFIGS = {
  paragraph: { label: "Normal", icon: Pilcrow },
  h1: { label: "Heading 1", icon: Heading1 },
  h2: { label: "Heading 2", icon: Heading2 },
  h3: { label: "Heading 3", icon: Heading3 },
  bullet: { label: "Bullet List", icon: List },
  number: { label: "Numbered List", icon: ListOrdered },
  check: { label: "Check List", icon: ListTodo },
  quote: { label: "Quote", icon: Quote },
  code: { label: "Code Block", icon: Code2 },
} as const

type BlockKey = keyof typeof BLOCK_CONFIGS

export function BlockFormatDropdown({
  editor,
  blockType,
  disabled = false,
}: {
  editor: LexicalEditor
  blockType: string
  disabled?: boolean
}) {
  const currentConfig =
    BLOCK_CONFIGS[blockType as BlockKey] || BLOCK_CONFIGS.paragraph
  const Icon = currentConfig.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-7 gap-1.5 rounded-md px-2 text-[11px] font-medium hover:bg-background/80"
        >
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="max-w-[80px] truncate text-foreground/80">
            {currentConfig.label}
          </span>
          <ChevronDown className="ml-0.5 h-3 w-3 opacity-40" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem
          onClick={() => formatParagraph(editor)}
          className={
            blockType === "paragraph"
              ? "bg-primary/8 font-medium text-primary"
              : ""
          }
        >
          <Pilcrow className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Normal</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatHeading(editor, blockType, "h1")}
          className={
            blockType === "h1" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <Heading1 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Heading 1</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatHeading(editor, blockType, "h2")}
          className={
            blockType === "h2" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <Heading2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Heading 2</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatHeading(editor, blockType, "h3")}
          className={
            blockType === "h3" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <Heading3 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Heading 3</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatBulletList(editor, blockType)}
          className={
            blockType === "bullet"
              ? "bg-primary/8 font-medium text-primary"
              : ""
          }
        >
          <List className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Bullet List</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatNumberedList(editor, blockType)}
          className={
            blockType === "number"
              ? "bg-primary/8 font-medium text-primary"
              : ""
          }
        >
          <ListOrdered className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Numbered List</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatCheckList(editor, blockType)}
          className={
            blockType === "check" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <ListTodo className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Check List</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatQuote(editor, blockType)}
          className={
            blockType === "quote" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <Quote className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Quote</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => formatCode(editor, blockType)}
          className={
            blockType === "code" ? "bg-primary/8 font-medium text-primary" : ""
          }
        >
          <Code2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Code Block</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

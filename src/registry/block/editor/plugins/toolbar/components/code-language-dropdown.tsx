// @ts-nocheck
import {
  $isCodeNode,
  CodeNode,
  getCodeLanguageOptions,
  getLanguageFriendlyName,
} from "@lexical/code"
import { $getNearestNodeOfType } from "@lexical/utils"
import type { LexicalEditor } from "lexical"
import { $getNodeByKey, $getSelection, $isRangeSelection } from "lexical"
import { Check, ChevronDown } from "lucide-react"
import * as React from "react"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { cn } from "../../../utils/cn"

export interface CodeLanguageDropdownProps {
  editor: LexicalEditor
  codeLanguage: string
  codeNodeKey?: string | null
  disabled?: boolean
}

export function CodeLanguageDropdown({
  editor,
  codeLanguage,
  codeNodeKey,
  disabled = false,
}: CodeLanguageDropdownProps) {
  const codeLanguageOptions = React.useMemo(() => getCodeLanguageOptions(), [])

  const displayLabel = React.useMemo(() => {
    if (!codeLanguage) return "(No language)"
    return getLanguageFriendlyName(codeLanguage) || codeLanguage
  }, [codeLanguage])

  const handleSelectLanguage = React.useCallback(
    (newLang: string) => {
      editor.update(() => {
        let targetCodeNode: CodeNode | null = null

        if (codeNodeKey) {
          const node = $getNodeByKey(codeNodeKey)
          if ($isCodeNode(node)) {
            targetCodeNode = node
          }
        }

        if (!targetCodeNode) {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode()
            const parent = anchorNode.getParent()
            const candidate = $isCodeNode(anchorNode)
              ? anchorNode
              : $getNearestNodeOfType(anchorNode, CodeNode) ||
                ($isCodeNode(parent) ? parent : null)
            if ($isCodeNode(candidate)) {
              targetCodeNode = candidate
            }
          }
        }

        if (targetCodeNode) {
          targetCodeNode.setLanguage(newLang)
        }
      })
    },
    [editor, codeNodeKey]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-7 gap-1.5 rounded-md px-2 text-[11px] font-medium hover:bg-background/80"
          title="Select code language"
        >
          <span className="max-w-[100px] truncate text-foreground/80">
            {displayLabel}
          </span>
          <ChevronDown className="ml-0.5 h-3 w-3 opacity-40" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 w-44 scrollbar-thin overflow-y-auto"
      >
        <DropdownMenuItem
          onClick={() => handleSelectLanguage("")}
          className={cn(
            "cursor-pointer text-xs",
            !codeLanguage && "bg-primary/8 font-medium text-primary"
          )}
        >
          <span className="flex-1">(No language)</span>
          {!codeLanguage && (
            <Check className="ml-auto h-3.5 w-3.5 text-primary" />
          )}
        </DropdownMenuItem>

        {codeLanguageOptions.map(([langKey, friendlyName]) => {
          const isSelected =
            codeLanguage === langKey ||
            (langKey === "js" && codeLanguage === "javascript") ||
            (langKey === "ts" && codeLanguage === "typescript") ||
            (langKey === "py" && codeLanguage === "python")

          return (
            <DropdownMenuItem
              key={langKey}
              onClick={() => handleSelectLanguage(langKey)}
              className={cn(
                "cursor-pointer text-xs",
                isSelected && "bg-primary/8 font-medium text-primary"
              )}
            >
              <span className="flex-1">{friendlyName}</span>
              {isSelected && (
                <Check className="ml-auto h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

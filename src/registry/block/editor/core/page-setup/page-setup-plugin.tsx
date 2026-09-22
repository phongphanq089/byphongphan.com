import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_EDITOR, createCommand } from "lexical"
import * as React from "react"

import { PageSetupDialog } from "./page-setup-dialog"

export const OPEN_PAGE_SETUP_COMMAND = createCommand<void>(
  "OPEN_PAGE_SETUP_COMMAND"
)

export function PageSetupPlugin(): React.JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    return editor.registerCommand(
      OPEN_PAGE_SETUP_COMMAND,
      () => {
        setDialogOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return <PageSetupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
}

export default PageSetupPlugin

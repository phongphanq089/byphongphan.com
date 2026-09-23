import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils"
import {
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  DROP_COMMAND,
  PASTE_COMMAND,
} from "lexical"
import * as React from "react"

import type { ImagePayload } from "../../nodes/image-node"
import {
  $createImageNode,
  INSERT_IMAGE_COMMAND,
  OPEN_IMAGE_DIALOG_COMMAND,
} from "../../nodes/image-node"
import { InsertImageDialog } from "./insert-image-dialog"

export function ImagesPlugin({
  onUploadImage,
}: {
  onUploadImage?: (file: File) => Promise<string>
}): React.JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    return mergeRegister(
      editor.registerCommand<void>(
        OPEN_IMAGE_DIALOG_COMMAND,
        () => {
          setIsDialogOpen(true)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<ImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          editor.update(() => {
            const imageNode = $createImageNode(payload)
            $insertNodeToNearestRoot(imageNode)
          })
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          const files = event.dataTransfer?.files
          if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith("image/")) {
              event.preventDefault()
              if (onUploadImage) {
                onUploadImage(file).then((url) => {
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    src: url,
                    altText: file.name,
                  })
                })
              } else {
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                      src: reader.result,
                      altText: file.name,
                    })
                  }
                }
                reader.readAsDataURL(file)
              }
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          const clipboardData =
            "clipboardData" in event ? event.clipboardData : null
          const files = clipboardData?.files
          if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith("image/")) {
              event.preventDefault()
              if (onUploadImage) {
                onUploadImage(file).then((url) => {
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    src: url,
                    altText: file.name,
                  })
                })
              } else {
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                      src: reader.result,
                      altText: file.name,
                    })
                  }
                }
                reader.readAsDataURL(file)
              }
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, onUploadImage])

  return (
    <InsertImageDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      editor={editor}
      onUploadImage={onUploadImage}
    />
  )
}

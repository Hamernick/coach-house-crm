"use client"

import { useState, useCallback, useEffect } from "react"
import { Editor as TiptapEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import VariableExtension from "tiptap-extension-variable"
import ImageUploadExtension from "tiptap-extension-image-upload"

export function EmailComposer() {
  const [editor] = useState(() =>
    new TiptapEditor({
      extensions: [StarterKit, VariableExtension, ImageUploadExtension],
      content: "",
    }),
  )

  const handleUpdate = useCallback(() => {
    // handle editor updates
  }, [editor])

  useEffect(() => {
    editor.on("update", handleUpdate)
    return () => {
      editor.off("update", handleUpdate)
    }
  }, [editor, handleUpdate])

  return (
    <div className="rounded-2xl border bg-background p-4">
      <EditorContent editor={editor} />
    </div>
  )
}

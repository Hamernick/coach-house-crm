"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"

interface DropzoneProps {
  files?: File[]
  onFiles?: (files: File[]) => void
}

export function Dropzone({ files = [], onFiles }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles = Array.from(fileList)
    const updated = [...files, ...newFiles]
    onFiles?.(updated)
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center text-sm cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
    >
      <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
      <p className="text-muted-foreground">Drag files here or click to upload</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {files.length > 0 && (
        <ul className="mt-4 w-full text-left text-xs">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}


"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"

interface DropzoneProps {
  files?: File[]
  onFiles?: (files: File[]) => void
}

export function Dropzone({ files = [], onFiles }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const MAX_SIZE = 12 * 1024 * 1024 // 12MB
    const accepted = Array.from(fileList).filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop()
      const isValidExt = ext === "pdf" || ext === "csv"
      const isValidSize = file.size <= MAX_SIZE
      return isValidExt && isValidSize
    })
    const updated = [...files, ...accepted]
    onFiles?.(updated)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
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
        accept=".pdf,.csv,application/pdf,text/csv"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {files.length > 0 && (
        <ul className="mt-4 w-full space-y-2 text-left text-xs">
          {files.map((file, index) => (
            <li
              key={file.name}
              className="flex items-center justify-between rounded border px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                className="ml-2 rounded p-1 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


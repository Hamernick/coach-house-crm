"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      className="flex min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center text-sm cursor-pointer"
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
        <ul className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {files.map((file, index) => (
            <li key={file.name} onClick={(e) => e.stopPropagation()}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-40 w-full object-cover"
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex flex-col items-start">
                    <CardTitle className="text-sm">{file.name}</CardTitle>
                    <CardDescription>{Math.round(file.size / 1024)} KB</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


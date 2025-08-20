"use client"

import * as React from "react"
import { UploadCloud, Trash, File as FileIcon } from "lucide-react"
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
    <div>
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
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium">Files</h4>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {files.map((file, index) => (
              <li key={file.name} onClick={(e) => e.stopPropagation()}>
                <Card className="relative aspect-square overflow-hidden">
                  <div className="absolute right-1 top-1 z-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="absolute bottom-0 left-0 right-0 flex flex-col items-start bg-gradient-to-t from-background/90 p-2">
                    <CardTitle
                      className="w-full truncate text-sm"
                      title={file.name}
                    >
                      {file.name}
                    </CardTitle>
                    <CardDescription>{Math.round(file.size / 1024)} KB</CardDescription>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface GetHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GetHelpDialog({ open, onOpenChange }: GetHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Help</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">Help content coming soon.</div>
      </DialogContent>
    </Dialog>
  )
}


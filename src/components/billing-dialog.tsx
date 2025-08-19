"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillingDialog({ open, onOpenChange }: BillingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Billing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="card">Card number</Label>
            <Input id="card" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiry date</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Save billing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


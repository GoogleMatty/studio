
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteVendorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirmDelete: () => void;
  vendorName?: string;
  isDeleting?: boolean;
}

export function DeleteVendorDialog({
  isOpen,
  onOpenChange,
  onConfirmDelete,
  vendorName,
  isDeleting = false,
}: DeleteVendorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if(!isDeleting) onOpenChange(open)}}>
      <AlertDialogContent className="shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the vendor
            {vendorName ? <strong className="text-foreground"> {vendorName}</strong> : ''} and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => { onConfirmDelete(); }} disabled={isDeleting}>
               {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, delete vendor
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

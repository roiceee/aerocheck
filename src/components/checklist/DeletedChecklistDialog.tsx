import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DeletedChecklistDialog({
  showDeletedDialog,
  setShowDeletedDialog,
}: {
  showDeletedDialog: boolean;
  setShowDeletedDialog: (show: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    <Dialog
      open={showDeletedDialog}
      onOpenChange={() => {
        setShowDeletedDialog(false);
        navigate("/");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checklist Deleted</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This checklist has been deleted by the co-checker. You will be
          redirected to the home page.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => {
              setShowDeletedDialog(false);
              navigate("/");
            }}
          >
            Go to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

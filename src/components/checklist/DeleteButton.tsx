import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChecklist } from "@/lib/checklistQueries";
import { useNavigate } from "react-router-dom";

export default function DeleteButton({ checklistId, disabled }: { checklistId: string, disabled: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: ["deleteChecklist", checklistId],
    mutationFn: (checklistId: string) => {
      return deleteChecklist(checklistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      navigate("/");
    },
  });

  return (
    <>
      <Button
        variant={"outline"}
        className="[&_svg]:size-5"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
      >
        <Trash2 color="red" />
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the checklist?
            <span className="font-bold block">
              Note: This will also make the checklist unavailable to the
              co-checker.
            </span>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteMutation.mutate(checklistId);
                setDialogOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

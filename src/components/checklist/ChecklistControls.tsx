import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";

interface Props {
  onPreviousPageClick: () => void;
  onNextPageClick: () => void;
  currentPage: number;
  totalPages: number;
  isMechanicCheckboxDisabled: boolean;
  isMechanicCheckboxChecked: boolean;
  mechanicCheckboxOnChange: (checkedState: boolean) => void;
  isPilotCheckboxDisabled: boolean;
  isPilotCheckboxChecked: boolean;
  pilotCheckboxOnChange: (checkedState: boolean) => void;
  onSaveAndSubmitClick: () => void;
  onSaveClick: () => void;
  submittedAt: string | null;
  isSaveChecklistMutationPending: boolean;
}

export default function ChecklistControls({
  onPreviousPageClick,
  onNextPageClick,
  currentPage,
  totalPages,
  isMechanicCheckboxDisabled,
  isMechanicCheckboxChecked,
  mechanicCheckboxOnChange,
  isPilotCheckboxDisabled,
  isPilotCheckboxChecked,
  pilotCheckboxOnChange,
  onSaveAndSubmitClick,
  onSaveClick,
  submittedAt,
  isSaveChecklistMutationPending,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-50 shadow-md p-4 border-t-2">
      <div className="flex gap-2 items-center mb-2 justify-between">
        <Button
          onClick={onPreviousPageClick}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded disabled:opacity-50"
          variant={"outline"}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant={"outline"}
          onClick={onNextPageClick}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
      <div className="flex gap-4 justify-end items-center">
        <div>
          <div className="flex items-center gap-1">
            <Checkbox
              disabled={isMechanicCheckboxDisabled}
              className="w-5 h-5"
              checked={isMechanicCheckboxChecked}
              onCheckedChange={mechanicCheckboxOnChange}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Mechanic Approve
            </label>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Checkbox
              className="w-5 h-5"
              disabled={isPilotCheckboxDisabled}
              checked={isPilotCheckboxChecked}
              onCheckedChange={pilotCheckboxOnChange}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Pilot Approve
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            disabled={submittedAt !== null}
            onClick={() => setDialogOpen(true)}
          >
            {submittedAt ? "Submitted" : "Save & Submit"}
          </Button>
          <Button onClick={onSaveClick}>
            {isSaveChecklistMutationPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to save and submit the checklist?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSaveAndSubmitClick();
                setDialogOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

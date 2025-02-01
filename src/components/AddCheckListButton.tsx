import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function AddCheckListButton({
  className,
}: {
  className?: string;
}) {
  return (
    <Button className={className}>
      <PlusIcon /> New Check
    </Button>
  );
}

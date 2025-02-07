import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function AddCheckListButton({
  className,
}: {
  className?: string;
}) {

    const router = useNavigate();


    



  return (
    <Button className={className} onClick={() => {router("/check/add")}}>
      <PlusIcon /> New Check
    </Button>
  );
}

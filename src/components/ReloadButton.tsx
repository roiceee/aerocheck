import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onClick?: () => void;
  className?: string;
}

export default function ReloadButton({ onClick, className }: Props) {
  return (
    <Button className={cn(className)} onClick={onClick} variant={"outline"} size={"sm"}>
      <RefreshCcw />
    </Button>
  );
}

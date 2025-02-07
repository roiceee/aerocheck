import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate("..");
      }}
      className={className}
      variant={"outline"}
    >
      <ArrowLeft />
    </Button>
  );
}

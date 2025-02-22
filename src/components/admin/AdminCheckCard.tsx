import { Database } from "@/types/supabase";
import { UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

interface Props {
  checklist: Database["public"]["Tables"]["checklists"]["Row"];
  aircraftModel: string | undefined | null;
}
export default function AdminCheckCard({
  checklist,
  aircraftModel,
}: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="mb-4 cursor-pointer"
      onClick={() => navigate(`/admin/checklist/${checklist.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">
          {aircraftModel || "Unknown Aircraft"}
        </CardTitle>
        <CardDescription className="text-sm">
          <span className="block">
            <span className="font-bold">Checklist ID: </span>
            {checklist.id}
          </span>
          <span>
            <span className="font-bold">Created At: </span>
            {new Date(checklist.created_at).toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-col gap-2 w-fit">
            {checklist.submitted_at && (
              <Badge
                className="text-sm"
                variant={
                  checklist.approved_by_superadmin ? "success" : "warning"
                }
              >
                <UserCheck className="mr-1" />
                Approval:{" "}
                {checklist.approved_by_superadmin ? "Approved" : "Pending"}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-md mt-4">
          {checklist.submitted_at ? (
            <span className="flex items-center gap-1 italic">
              Submitted{" "}
              {new Date(checklist.submitted_at as string).toLocaleString()}
            </span>
          ) : (
            <span>Not Submitted</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

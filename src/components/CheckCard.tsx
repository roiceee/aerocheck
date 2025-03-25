import { Wrench, PlaneTakeoff, UserCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Database } from "@/types/supabase";

interface Props {
  checklist: Database["public"]["Tables"]["checklists"]["Row"];
  aircraftModel: string | undefined | null;
  userRole: string;
}

export default function CheckCard({ checklist, aircraftModel, userRole }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      className="mb-4 cursor-pointer"
      onClick={() => navigate(`/checklist/${checklist.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">
          {aircraftModel || "Unknown Aircraft"}
        </CardTitle>
        <CardDescription className="text-sm">
          <span className="block">
            <span className="font-bold">RPC Number: </span>
            {checklist.rpc_number ?? "---"}
          </span>
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
            <Badge
              className="text-sm"
              variant={
                checklist.approved_by_mechanic
                  ? "success"
                  : userRole === "mechanic"
                  ? "warning"
                  : "secondary"
              }
            >
              <Wrench className="mr-1" />
              Mechanic:{" "}
              {checklist.approved_by_mechanic ? "Approved" : "Pending"}
            </Badge>
            <Badge
              className="text-sm"
              variant={
                checklist.approved_by_pilot
                  ? "success"
                  : userRole === "pilot"
                  ? "warning"
                  : "secondary"
              }
            >
              <PlaneTakeoff className="mr-1" />
              Pilot: {checklist.approved_by_pilot ? "Approved" : "Pending"}
            </Badge>
            {checklist.submitted_at && (
              <Badge
                className="text-sm"
                variant={
                  checklist.approved_by_superadmin ? "success" : "secondary"
                }
              >
                <UserCheck className="mr-1" />
                Superadmin:{" "}
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

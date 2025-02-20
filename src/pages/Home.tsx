import AddCheckListButton from "@/components/AddCheckListButton";
import { QueryFilter } from "@/components/QueryFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthContext from "@/context/AuthContext";
import { checklistQuery } from "@/lib/checklistQueries";
import { useQuery } from "@tanstack/react-query";
import { PlaneTakeoff, UserCheck, Wrench, X } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [filters, setFilters] = useState<{
    checklistId: string;
    startDate: Date | null;
    endDate: Date | null;
    showPending: boolean;
  }>({
    checklistId: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    showPending: false,
  });

  const {
    data: queryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "checklists",
      currentPage,
      filters.checklistId,
      filters.startDate,
      filters.endDate,
      filters.showPending,
    ], // Include currentPage in the queryKey
    queryFn: () => {
      return checklistQuery(
        currentPage,
        itemsPerPage,
        user.role as string,
        user.user!.id,
        filters
      );
    },
  });

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Recent Checks</h1>
        {/* query filter here */}
        <QueryFilter
          userRole={user.role}
          onFilterChange={setFilters}
          filters={filters}
        />
        {/* show applied filters */}
      </div>
      <div className="space-x-2 my-4">
        {/* remove filter button if there is any filter applied */}

        {Object.values(filters).some((value) =>
          typeof value === "string" ? value.length : value
        ) && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() =>
              setFilters({
                checklistId: "",
                startDate: null,
                endDate: null,
                showPending: false,
              })
            }
          >
            <X /> Clear
          </Button>
        )}
        {filters.checklistId && (
          <Badge variant="outline">Checklist ID: {filters.checklistId}</Badge>
        )}
        {filters.startDate && (
          <Badge variant="outline">
            Start Date: {filters.startDate.toLocaleDateString()}
          </Badge>
        )}
        {filters.endDate && (
          <Badge variant="outline">
            End Date: {filters.endDate.toLocaleDateString()}
          </Badge>
        )}
        {filters.showPending && <Badge variant="outline">Show Pending</Badge>}
      </div>
      <div className="my-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : queryData && queryData.length ? (
          <>
            <ul>
              {queryData.map((checklist) => (
                <li key={checklist.id}>
                  <Card
                    className="mb-4 cursor-pointer"
                    onClick={() => navigate(`/checklist/${checklist.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {checklist.aircraft_models?.name || "Unknown Aircraft"}
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
                          <Badge
                            className="text-sm"
                            variant={
                              checklist.approved_by_mechanic
                                ? "success"
                                : user.role === "mechanic"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            <Wrench className="mr-1" />
                            Mechanic:{" "}
                            {checklist.approved_by_mechanic
                              ? "Approved"
                              : "Pending"}
                          </Badge>
                          <Badge
                            className="text-sm"
                            variant={
                              checklist.approved_by_pilot
                                ? "success"
                                : user.role === "pilot"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            <PlaneTakeoff className="mr-1" />
                            Pilot:{" "}
                            {checklist.approved_by_pilot
                              ? "Approved"
                              : "Pending"}
                          </Badge>
                          {checklist.submitted_at && (
                            <Badge
                              className="text-sm"
                              variant={
                                checklist.approved_by_superadmin
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              <UserCheck className="mr-1" />
                              Superadmin:{" "}
                              {checklist.approved_by_superadmin
                                ? "Approved"
                                : "Pending"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-md mt-4">
                        {checklist.submitted_at ? (
                          <span className="flex items-center gap-1 italic">
                            Submitted{" "}
                            {new Date(
                              checklist.submitted_at as string
                            ).toLocaleString()}
                          </span>
                        ) : (
                          <span>Not Submitted</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1">Page {currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={queryData.length < itemsPerPage} // Disable if fewer items than itemsPerPage
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">No checklists found</p>
        )}
      </div>
      <AddCheckListButton className="fixed bottom-10 right-2" />
    </div>
  );
}

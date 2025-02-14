import { useState } from "react";
import AddCheckListButton from "@/components/AddCheckListButton";
import AuthContext from "@/context/AuthContext";
import supabase from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlaneTakeoff, UserCheck, Wrench } from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const {
    data: queryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checklists", currentPage], // Include currentPage in the queryKey
    queryFn: async () => {
      try {
        const rangeStart = (currentPage - 1) * itemsPerPage;
        const rangeEnd = rangeStart + itemsPerPage - 1;

        const { data, error } = await supabase
          .from("checklists")
          .select(
            `
          *,
          aircraft_models (*)
        `
          )
          .order("created_at", { ascending: false })
          .eq(user.role === "pilot" ? "pilot_id" : "mechanic_id", user.user!.id)
          .range(rangeStart, rangeEnd); // Add range for pagination

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    },
  });

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">My Recent Checks</h1>
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
                      <CardDescription className="text-md">
                        <span className="font-bold">Checklist ID: </span>
                        {checklist.id}
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
                            <Calendar/>{" "}
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

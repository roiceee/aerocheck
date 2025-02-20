import AddCheckListButton from "@/components/AddCheckListButton";
import CheckCard from "@/components/CheckCard";
import { QueryFilter } from "@/components/QueryFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import { checklistQuery } from "@/lib/checklistQueries";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useContext, useState } from "react";

export default function Home() {
  const { user } = useContext(AuthContext);
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
                  <CheckCard
                    checklist={checklist}
                    aircraftModel={checklist.aircraft_models.name}
                    userRole={user.role as string}
                    userId={user.user!.id}
                  />
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

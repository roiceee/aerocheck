import AddCheckListButton from "@/components/AddCheckListButton";
import AuthContext from "@/context/AuthContext";
import supabase from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    data: queryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checklists"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("checklists")
          .select(
            `
          *,
          aircraft_models (*)
        `
          )
          .eq(
            user.role === "pilot" ? "pilot_id" : "mechanic_id",
            user.user!.id
          );

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    },
  });
  

  return (
    <div>
      <h1 className="text-xl font-bold">My Recent Checks</h1>
      <div className="my-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : queryData && queryData.length ? (
          <ul>
            {queryData.map((checklist) => (
              <li key={checklist.id} className="border p-4 mb-2 rounded shadow" onClick={() => {
                navigate(`/checklist/${checklist.id}`)
              }}>
                <h3 className="text-lg font-semibold">
                  {checklist.aircraft_models?.name || "Unknown Aircraft"}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Approved by Mechanic:{" "}
                    {checklist.approved_by_mechanic ? "✅" : "❌"}
                  </p>
                  <p>
                    Approved by Pilot:{" "}
                    {checklist.approved_by_pilot ? "✅" : "❌"}
                  </p>
                  <p>
                    Approved by Superadmin:{" "}
                    {checklist.approved_by_superadmin ? "✅" : "❌"}
                  </p>
                  <p>
                    Submitted At: {checklist.submitted_at || "Not submitted"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No checklists found</p>
        )}
      </div>
      <AddCheckListButton
        className="fixed bottom-10 right-2"
      />
    </div>
  );
}

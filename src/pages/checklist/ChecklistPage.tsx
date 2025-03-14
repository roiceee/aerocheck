import BackButton from "@/components/BackButton";
import ChecklistControls from "@/components/checklist/ChecklistControls";
import DeleteButton from "@/components/checklist/DeleteButton";
import DeletedChecklistDialog from "@/components/checklist/DeletedChecklistDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";
import {
  approveChecklist,
  getChecklist,
  getMechanic,
  getPilot,
  saveOrSubmit,
  unapproveChecklist,
} from "@/lib/checklistQueries";
import supabase from "@/supabase-client";
import { AircraftChecklist } from "@/types/checklistTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChecklistPage() {
  const params = useParams();
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const sectionsPerPage = 15; // Number of sections per page

  const [checklistState, setChecklistState] =
    useState<AircraftChecklist | null>(null);

  const [isInspectionApproved, setIsInspectionApproved] = useState({
    mechanic: false,
    pilot: false,
  });
  const [submitted_at, setSubmittedAt] = useState<string | null>(null);
  const [showDeletedDialog, setShowDeletedDialog] = useState(false);

  // Fetch the checklist data
  const checklistQuery = useQuery({
    queryKey: ["checklist", params.id],
    queryFn: () => {
      return getChecklist(
        user.role as string,
        user.user!.id,
        params.id as string
      );
    },
    // dont cache data
    staleTime: 0,
  });

  supabase
    .channel("checklists")
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "checklists",
        filter: `id=eq.${params.id}`,
      },
      () => {
        setShowDeletedDialog(true);
      }
    )
    .subscribe();

  const mechanicQuery = useQuery({
    queryKey: [
      "mechanic",
      checklistQuery.data ? checklistQuery.data.mechanic_id : null,
    ],
    queryFn: () => {
      if (!checklistQuery.data) return null;
      return getMechanic(checklistQuery.data.mechanic_id as string);
    },
    enabled: checklistQuery.isSuccess,
  });

  const pilotQuery = useQuery({
    queryKey: [
      "pilot",
      checklistQuery.data ? checklistQuery.data.pilot_id : null,
    ],
    queryFn: async () => {
      if (!checklistQuery.data) return null;
      return getPilot(checklistQuery.data.pilot_id as string);
    },
    enabled: checklistQuery.isSuccess,
  });

  const saveChecklistMutation = useMutation({
    mutationFn: ({
      checklist,
      isInspectionApproved,
      submit,
      checklistId,
      userRole,
    }: {
      checklist: AircraftChecklist;
      isInspectionApproved: { mechanic: boolean; pilot: boolean };
      submit: boolean;
      checklistId: string;
      userRole: "mechanic" | "pilot" | "superadmin" | null;
    }) => {
      return saveOrSubmit({
        checklist,
        isInspectionApproved,
        submit,
        checklistId,
        userRole,
      });
    },
    onSettled: () => {
      // Refetch the data after the mutation is settled
      checklistQuery.refetch();
    },
  });

  const approveChecklistMutation = useMutation({
    mutationFn: async ({
      checklistId,
      adminId,
    }: {
      checklistId: string;
      adminId: string;
    }) => {
      return approveChecklist(checklistId, adminId);
    },
    onSettled: () => {
      checklistQuery.refetch();
    },
  });

  const unapproveChecklistMutation = useMutation({
    mutationFn: async ({
      checklistId,
    }: {
      checklistId: string;
      adminId: string;
    }) => {
      return unapproveChecklist(checklistId);
    },
    onSettled: () => {
      checklistQuery.refetch();
    },
  });

  // Paginate the sections
  const preFlightSections = checklistState?.preFlightCheck || [];
  const postFlightSections = checklistState?.postFlightCheck || [];
  const allSections = [...preFlightSections, ...postFlightSections];

  // Calculate the total number of pages
  const totalPages = Math.ceil(allSections.length / sectionsPerPage);

  // Get the sections for the current page
  const startIndex = (currentPage - 1) * sectionsPerPage;
  const endIndex = startIndex + sectionsPerPage;
  const currentSections = allSections.slice(startIndex, endIndex);

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (checklistQuery.data && checklistQuery.isSuccess) {
      setIsInspectionApproved({
        mechanic: checklistQuery.data.approved_by_mechanic,
        pilot: checklistQuery.data.approved_by_pilot,
      });
      setSubmittedAt(checklistQuery.data.submitted_at);
      setChecklistState(checklistQuery.data.list as AircraftChecklist);
    }
  }, [checklistQuery.data, checklistQuery.isSuccess, user.role]);

  return (
    <main className="mb-24">
      <div className="w-full flex justify-between">
        <BackButton />
        {checklistQuery.data && (
          <DeleteButton
            checklistId={checklistQuery.data.id}
            disabled={
              user.role !== "superadmin" &&
              checklistQuery.data.submitted_at !== null
            }
          />
        )}
      </div>
      {checklistQuery.data && (
        <div>
          <h1 className="mt-4 text-2xl font-bold">
            {checklistQuery.data.aircraft_models.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            RPC Number:{" "}
            <span className="text-primary">
              {checklistQuery.data.rpc_number}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Created at (mm/dd/yyyy):{" "}
            <span className="text-primary">
              {new Date(checklistQuery.data.created_at).toLocaleString()}
            </span>
          </p>
          {mechanicQuery.isSuccess && (
            <p className="text-sm text-muted-foreground">
              Mechanic:{" "}
              <span className="text-primary">
                {mechanicQuery.data?.name || "Unknown Mechanic"}
              </span>
            </p>
          )}
          {pilotQuery.isSuccess && (
            <p className="text-sm text-muted-foreground">
              Pilot:{" "}
              <span className="text-primary">
                {pilotQuery.data?.name || "Unknown Pilot"}
              </span>
            </p>
          )}
        </div>
      )}
      {/* Render the sections for the current page */}
      <h1 className="text-lg mt-6">Checklist</h1>
      {checklistQuery.isError ? (
        <p>Error: {checklistQuery.error.message}</p>
      ) : checklistQuery.isLoading ? (
        <p>Loading...</p>
      ) : !checklistQuery.data ? (
        <p>No data found</p>
      ) : null}
      {checklistQuery.data && (
        <div className="mt-4">
          {currentSections.map((section, index) => (
            <div
              key={index}
              className={`mb-6 ${
                section.isMainSection && "border-t-2 border-primary pt-4"
              }`}
            >
              <h2 className="text-lg font-semibold">
                {section.section}{" "}
                {section.isMainSection && (
                  <span className="text-sm text-muted-foreground">
                    (Main Section)
                  </span>
                )}
              </h2>
              <ul className="mt-2 space-y-2">
                {section.tasks.map((task, taskIndex) => (
                  <div key={taskIndex + "-task"} className="border-b py-2">
                    <li className="flex items-start space-x-2">
                      {task.inspection_required && (
                        <span className="text-sm text-muted-foreground">
                          ({task.inspection_required})
                        </span>
                      )}
                      <span
                        className={`${
                          task.type === "instruction" && "text-sm"
                        }`}
                      >
                        {task.description}
                      </span>
                    </li>
                    <div className="mt-5">
                      {task.type === "checkbox" ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="items-top flex space-x-2">
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                user.role === "superadmin" &&
                                !task.mechanic_response
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              Mechanic response
                            </label>
                            <Checkbox
                              disabled={
                                user.role !== "mechanic" ||
                                checklistQuery.data?.submitted_at !== null
                              }
                              checked={task.mechanic_response as boolean}
                              className="w-5 h-5"
                              onCheckedChange={(checkedState) => {
                                setChecklistState((prevState) => {
                                  if (!prevState) return prevState;
                                  const newChecklistState = { ...prevState };
                                  newChecklistState.preFlightCheck![
                                    index
                                  ].tasks[taskIndex].mechanic_response =
                                    checkedState;
                                  return newChecklistState;
                                });
                              }}
                            />
                          </div>
                          <div className="items-top flex space-x-2">
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                user.role === "superadmin" &&
                                !task.pilot_response
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              Pilot response
                            </label>
                            <Checkbox
                              disabled={
                                user.role !== "pilot" ||
                                checklistQuery.data?.submitted_at !== null
                              }
                              checked={task.pilot_response as boolean}
                              className="w-5 h-5"
                              onCheckedChange={(checkedState) => {
                                setChecklistState((prevState) => {
                                  if (!prevState) return prevState;
                                  const newChecklistState = { ...prevState };
                                  newChecklistState.preFlightCheck![
                                    index
                                  ].tasks[taskIndex].pilot_response =
                                    checkedState;
                                  return newChecklistState;
                                });
                              }}
                            />
                          </div>
                        </div>
                      ) : task.type === "input" ? (
                        <div>
                          <div className="flex items-center gap-2 justify-end">
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                user.role === "superadmin" &&
                                !task.mechanic_response
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              Mechanic Response
                            </label>
                            <Input
                              disabled={user.role !== "mechanic"}
                              type="text"
                              placeholder="Enter response"
                              className="w-[150px] px-2 py-1 border rounded"
                              value={task.mechanic_response?.toString()}
                              onChange={(e) => {
                                setChecklistState((prevState) => {
                                  if (!prevState) return prevState;
                                  const newChecklistState = { ...prevState };
                                  newChecklistState.preFlightCheck![
                                    index
                                  ].tasks[taskIndex].mechanic_response =
                                    e.target.value;
                                  return newChecklistState;
                                });
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2 justify-end mt-2">
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                user.role === "superadmin" &&
                                !task.pilot_response
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              Pilot Response
                            </label>
                            <Input
                              disabled={user.role !== "pilot"}
                              type="text"
                              placeholder="Enter response"
                              className="w-[150px] px-2 py-1 border rounded"
                              value={task.pilot_response?.toString()}
                              onChange={(e) => {
                                setChecklistState((prevState) => {
                                  if (!prevState) return prevState;
                                  const newChecklistState = { ...prevState };
                                  newChecklistState.preFlightCheck![
                                    index
                                  ].tasks[taskIndex].pilot_response =
                                    e.target.value;
                                  return newChecklistState;
                                });
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {checklistQuery.data && (
        <ChecklistControls
          userRole={user.role!}
          onPreviousPageClick={goToPreviousPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPageClick={goToNextPage}
          isMechanicCheckboxDisabled={
            user.role !== "mechanic" ||
            checklistQuery.data.submitted_at !== null
          }
          isMechanicCheckboxChecked={isInspectionApproved.mechanic}
          mechanicCheckboxOnChange={(checkedState: boolean) => {
            setIsInspectionApproved((prevState) => ({
              ...prevState,
              [user.role === "mechanic" ? "mechanic" : "pilot"]: checkedState,
            }));
          }}
          isPilotCheckboxDisabled={
            user.role !== "pilot" || checklistQuery.data.submitted_at !== null
          }
          isPilotCheckboxChecked={isInspectionApproved.pilot}
          pilotCheckboxOnChange={(checkedState: boolean) => {
            setIsInspectionApproved((prevState) => ({
              ...prevState,
              [user.role === "mechanic" ? "mechanic" : "pilot"]: checkedState,
            }));
          }}
          onSaveAndSubmitClick={() => {
            saveChecklistMutation.mutate({
              checklist: checklistState!,
              isInspectionApproved,
              submit: true,
              checklistId: params.id as string,
              userRole: user.role,
            });
          }}
          onSaveClick={() => {
            saveChecklistMutation.mutate({
              checklist: checklistState!,
              isInspectionApproved,
              submit: false,
              checklistId: params.id as string,
              userRole: user.role,
            });
          }}
          submittedAt={submitted_at}
          isSaveChecklistMutationPending={saveChecklistMutation.isPending}
          onChecklistApprove={
            user.role === "superadmin"
              ? () => {
                  approveChecklistMutation.mutate({
                    checklistId: params.id as string,
                    adminId: user.user!.id,
                  });
                }
              : () => {}
          }
          onChecklistUnapprove={
            user.role === "superadmin"
              ? () => {
                  unapproveChecklistMutation.mutate({
                    checklistId: params.id as string,
                    adminId: user.user!.id,
                  });
                }
              : () => {}
          }
          isChecklistApproved={checklistQuery.data.approved_by_superadmin}
          checklistId={params.id!}
        />
      )}{" "}
      <DeletedChecklistDialog
        showDeletedDialog={showDeletedDialog}
        setShowDeletedDialog={setShowDeletedDialog}
      />
    </main>
  );
}

import supabase from "@/supabase-client";
import { AircraftChecklist } from "@/types/checklistTemplate";

export async function checklistQuery(
  currentPage: number,
  itemsPerPage: number,
  userRole: string,
  userId: string,
  filters?: {
    checklistId: string;
    startDate: Date | null;
    endDate: Date | null;
    showPending: boolean;
  },
  sort?: {
    field: string;
    order: "asc" | "desc";
  }
) {
  try {
    const rangeStart = (currentPage - 1) * itemsPerPage;
    const rangeEnd = rangeStart + itemsPerPage - 1;

    let baseQuery = supabase
      .from("checklists")
      .select(
        `
          *,
          aircraft_models (*)
        `
      )
      .range(rangeStart, rangeEnd);

    if (userRole === "superadmin") {
      baseQuery = baseQuery.not("submitted_at", "is", null);
    } else {
      baseQuery = baseQuery.eq(
        userRole === "pilot" ? "pilot_id" : "mechanic_id",
        userId
      );
    }

    if (filters) {
      if (filters.checklistId) {
        baseQuery = baseQuery.eq("id", filters.checklistId);
      }
      if (filters.startDate) {
        baseQuery = baseQuery.gte(
          "created_at",
          filters.startDate.toISOString()
        );
      }
      if (filters.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        baseQuery = baseQuery.lte("created_at", endOfDay.toISOString());
      }
      if (filters.showPending) {
        baseQuery = baseQuery.eq(
          userRole === "pilot"
            ? "approved_by_pilot"
            : userRole === "mechanic"
            ? "approved_by_mechanic"
            : "approved_by_superadmin",
          false
        );
      }
    }

    if (sort) {
      baseQuery = baseQuery.order(sort.field, {
        ascending: sort.order === "asc",
      });
    } else {
      baseQuery = baseQuery.order("created_at", { ascending: false });
    }

    const { data, error } = await baseQuery;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function saveOrSubmit({
  checklist,
  isInspectionApproved,
  submit,
  checklistId,
  userRole,
}: {
  checklist: AircraftChecklist;
  isInspectionApproved: {
    mechanic: boolean;
    pilot: boolean;
  };
  submit: boolean;
  checklistId: string;
  userRole: "mechanic" | "pilot" | "superadmin" | null;
}) {
  try {
    // query the latest data, and overwrite the approved_by_mechanic and approved_by_pilot fields, also merge the checklist data. if user is mechanic, only overwrite the mechanic fields
    const { data: freshData, error: freshError } = await supabase
      .from("checklists")
      .select("*")
      .eq("id", checklistId)
      .single();

    if (freshError) throw freshError;

    const updatedChecklist: AircraftChecklist =
      freshData.list as AircraftChecklist;

    for (let i = 0; i < checklist.preFlightCheck.length; i++) {
      for (let j = 0; j < checklist.preFlightCheck[i].tasks.length; j++) {
        if (userRole === "mechanic") {
          updatedChecklist.preFlightCheck[i].tasks[j].mechanic_response =
            checklist.preFlightCheck[i].tasks[j].mechanic_response;
        } else {
          updatedChecklist.preFlightCheck[i].tasks[j].pilot_response =
            checklist.preFlightCheck[i].tasks[j].pilot_response;
        }
      }
    }

    for (let i = 0; i < checklist.postFlightCheck.length; i++) {
      for (let j = 0; j < checklist.postFlightCheck[i].tasks.length; j++) {
        if (userRole === "mechanic") {
          updatedChecklist.postFlightCheck[i].tasks[j].mechanic_response =
            checklist.postFlightCheck[i].tasks[j].mechanic_response;
        } else {
          updatedChecklist.postFlightCheck[i].tasks[j].pilot_response =
            checklist.postFlightCheck[i].tasks[j].pilot_response;
        }
      }
    }

    let updateData;

    if (userRole === "mechanic") {
      updateData = {
        approved_by_mechanic: isInspectionApproved.mechanic,
        list: updatedChecklist,
      };
    } else {
      updateData = {
        approved_by_pilot: isInspectionApproved.pilot,
        list: updatedChecklist,
      };
    }

    const freshApprovedByMechanic =
      userRole === "mechanic"
        ? isInspectionApproved.mechanic
        : freshData.approved_by_mechanic;
    const freshApprovedByPilot =
      userRole === "pilot"
        ? isInspectionApproved.pilot
        : freshData.approved_by_pilot;

    if (
      submit &&
      !freshData.submitted_at &&
      freshApprovedByMechanic &&
      freshApprovedByPilot
    ) {
      updateData = {
        ...updateData,
        submitted_at: new Date(Date.now()).toISOString(),
      };
    } else if (submit && !(freshApprovedByMechanic && freshApprovedByPilot)) {
      alert(
        "Both mechanic and pilot must approve the inspection before submitting"
      );
    }

    const { data, error } = await supabase
      .from("checklists")
      .update(updateData)
      .eq("id", checklistId as string)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving checklist:", error);
    return null;
  }
}

export async function getChecklist(
  userRole: string,
  userId: string,
  checklistId: string
) {
  try {
    let query = supabase
      .from("checklists")
      .select(
        `
          *,
          aircraft_models (*)
        `
      )
      .eq("id", checklistId);

    // Restrict access for pilots and mechanics
    if (userRole !== "superadmin") {
      query = query.eq(
        userRole === "pilot" ? "pilot_id" : "mechanic_id",
        userId
      );
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMechanic(mechanicId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", mechanicId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching mechanic:", error);
    return null;
  }
}

export async function getPilot(pilotId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", pilotId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching pilot:", error);
    return null;
  }
}

export async function deleteChecklist(checklistId: string) {
  try {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", checklistId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting checklist:", error);
    return false;
  }
}

export async function approveChecklist(checklistId: string, adminId: string) {
  try {
    const { data, error } = await supabase
      .from("checklists")
      .update({
        approved_by_superadmin: true,
        superadmin_id: adminId,
      })
      .eq("id", checklistId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error approving checklist:", error);
    return null;
  }
}

export async function unapproveChecklist(checklistId: string) {
  try {
    const { data, error } = await supabase
      .from("checklists")
      .update({
        approved_by_superadmin: false,
        superadmin_id: null,
      })
      .eq("id", checklistId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error unapproving checklist:", error);
    return null;
  }
}

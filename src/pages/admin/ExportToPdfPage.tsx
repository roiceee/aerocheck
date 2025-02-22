import AuthContext from "@/context/AuthContext";
import {
  getChecklist,
  getMechanic,
  getPilot
} from "@/lib/checklistQueries";
import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import PDFDocument from "./PDFDocument";

export default function ExportToPdfPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { data, isLoading } = useQuery({
    queryKey: ["checklist", "pdf", id],
    queryFn: async () => {
      return getChecklist(user.role as string, user.user!.id, id!);
    },
  });

  const mechanicQuery = useQuery({
    queryKey: ["mechanic", data ? data.mechanic_id : null],
    queryFn: () => {
      if (!data) return null;
      return getMechanic(data.mechanic_id as string);
    },
    enabled: data !== null || data !== undefined,
  });

  const pilotQuery = useQuery({
    queryKey: ["pilot", data ? data.pilot_id : null],
    queryFn: async () => {
      if (!data) return null;
      return getPilot(data.pilot_id as string);
    },
    enabled: data !== null || data !== undefined,
  });

  if (isLoading && pilotQuery.isLoading && mechanicQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (!data || !pilotQuery.data || !mechanicQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    >
      <PDFDocument
        data={data}
        pilotName={pilotQuery.data?.name as string}
        mechanicName={mechanicQuery.data?.name as string}
      />
    </PDFViewer>
  );
}

import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import { getChecklist, getMechanic, getPilot } from "@/lib/checklistQueries";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import PDFDocument from "./PDFDocument";

export default function ExportToPdfPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // iOS PWA detection
  const isIos = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isInStandaloneMode =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "standalone" in window.navigator && (window.navigator as any).standalone;
  const isIosPwa = isIos && isInStandaloneMode;

  const { data, isLoading } = useQuery({
    queryKey: ["checklist", "pdf", id],
    queryFn: async () => getChecklist(user.role as string, user.user!.id, id!),
  });

  const mechanicQuery = useQuery({
    queryKey: ["mechanic", data ? data.mechanic_id : null],
    queryFn: () => (data ? getMechanic(data.mechanic_id as string) : null),
    enabled: !!data,
  });

  const pilotQuery = useQuery({
    queryKey: ["pilot", data ? data.pilot_id : null],
    queryFn: async () => (data ? getPilot(data.pilot_id as string) : null),
    enabled: !!data,
  });

  if (isLoading || pilotQuery.isLoading || mechanicQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !pilotQuery.data || !mechanicQuery.data) {
    return <div>Loading...</div>;
  }

  const pdfTitle = `${data.aircraft_models.name} - ${new Date(
    data.created_at
  ).toLocaleString()}`;

  const pdfDocument = (
    <PDFDocument
      data={data}
      pilotName={pilotQuery.data?.name as string}
      mechanicName={mechanicQuery.data?.name as string}
      title={pdfTitle}
    />
  );

  // Handle iOS PWA limitation
  if (isIosPwa) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-4">
        <img src="/afes.png" className="h-[100px] w-auto mx-auto mb-4" />
        <p className="mb-2">
          PDF preview is not supported in iOS PWA mode. Please open this page in
          Safari or Chrome.
        </p>
        <Button
          size={"lg"}
          onClick={() => window.open(window.location.href, "_blank")}
        >
          Open in Browser
        </Button>
      </div>
    );
  }

  return isMobile ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <img src="/afes.png" className="h-[100px] w-auto mx-auto mb-4" />
      <p>
        Export PDF: <span className="font-semibold block">{pdfTitle}</span>
      </p>
      <Button size={"lg"}>
        <PDFDownloadLink document={pdfDocument} fileName={pdfTitle}>
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </Button>
    </div>
  ) : (
    <PDFViewer style={{ width: "100%", height: "100vh", border: "none" }}>
      {pdfDocument}
    </PDFViewer>
  );
}

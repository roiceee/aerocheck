import {
  AircraftChecklist,
  Section,
  Task
} from "@/types/checklistTemplate";
import { Database } from "@/types/supabase";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
export default function PDFDocument({
  data,
  pilotName,
  mechanicName,
}: {
  data: Database["public"]["Tables"]["checklists"]["Row"] & {
    aircraft_models: Database["public"]["Tables"]["aircraft_models"]["Row"];
  };

  pilotName: string;
  mechanicName: string;
}) {
  const preFlightCheck = (data?.list as AircraftChecklist).preFlightCheck || [];
  const postFlightCheck =
    (data?.list as AircraftChecklist).postFlightCheck || [];

  const styles = StyleSheet.create({
    page: {
      padding: 60,
      fontFamily: "Helvetica",
      fontSize: 11,
      width: "100%",
    },
    header: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
      fontWeight: "extrabold",
    },
    subHeader: {
      fontSize: 14,
      marginBottom: 10,
      textAlign: "center",
    },
    documentInfo: {
      fontSize: 12,
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 14,
      marginTop: 10,
      marginBottom: 5,
      fontWeight: "bold",
    },
    task: {
      marginBottom: 5,
      marginLeft: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%", // Ensure task takes full width
    },
    instruction: {
      marginBottom: 10,
      marginTop: 10,
      marginLeft: 10,
      fontStyle: "italic",
      width: "100%", // Ensure instruction takes full width
    },
    checkbox: {
      marginBottom: 5,
      marginLeft: 10,
      maxWidth: "350",
    },
    input: {
      marginBottom: 5,
      marginLeft: 10,
      maxWidth: "350",
    },
    response: {
      marginLeft: 20,
      marginTop: 2,
      color: "#555",
    },
    responseView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    mainSectionContainer: {
      borderTop: "1px solid black",
      width: "100%", // Ensure section takes full width
    },
  });

  const renderTasks = (tasks: Task[]) => {
    return tasks.map((task, index) => {
      if (task.type === "instruction") {
        return (
          <Text key={index} style={styles.instruction}>
            {task.description}
          </Text>
        );
      } else if (task.type === "checkbox") {
        return (
          <View key={index} style={styles.task}>
            <Text style={styles.checkbox}>☐ {task.description}</Text>
            <View style={styles.responseView}>
              <Text style={styles.response}>
                Mechanic: {task.mechanic_response ? "/" : "x"}
              </Text>
              <Text style={styles.response}>
                Pilot: {task.pilot_response ? "/" : "x"}
              </Text>
            </View>
          </View>
        );
      } else if (task.type === "input") {
        return (
          <View key={index} style={styles.task}>
            <Text style={styles.input}>
              {task.description}: ____________________
            </Text>
            <View style={styles.responseView}>
              <Text style={styles.response}>
                Mechanic: {task.mechanic_response || "N/A"}
              </Text>
              <Text style={styles.response}>
                Pilot: {task.pilot_response || "N/A"}
              </Text>
            </View>
          </View>
        );
      }
      return null;
    });
  };

  const renderSections = (sections: Section[]) => {
    return sections.map((section, index) => (
      <View
        key={index}
        style={section.isMainSection ? styles.mainSectionContainer : {}}
      >
        <Text style={styles.sectionTitle}>{section.section}</Text>
        {renderTasks(section.tasks)}
      </View>
    ));
  };

  const ChecklistDocument = () => (
    <Document
      title={`${data.aircraft_models.name} - ${new Date(
        data.created_at
      ).toLocaleString()}`}
    >
      <Page style={styles.page} size={"A4"}>
        <View>
          <View>
            <Text style={styles.header}>
              ADVENTURE FLIGHT EDUCATION & SPORTS, INC.
            </Text>
            <Text style={styles.subHeader}>
              PRE-FLIGHT INSPECTION CHECKLIST
            </Text>
            <Text style={styles.subHeader}>{data?.aircraft_models.name}</Text>
            <Text style={styles.documentInfo}>
              Created At: {new Date(data?.created_at).toLocaleString()}
            </Text>
            <Text style={styles.documentInfo}>
              Submitted At:{" "}
              {data?.submitted_at
                ? new Date(data?.submitted_at).toLocaleString()
                : "Not Submitted"}
            </Text>
            <Text style={styles.documentInfo}>
              Approval: {data?.approved_by_superadmin ? "Approved" : "Pending"}
            </Text>
            <Text style={styles.documentInfo}>Checklist ID: {data?.id}</Text>
            <Text style={styles.documentInfo}>
              Checking Mechanic: {mechanicName}
            </Text>
            <Text style={styles.documentInfo}>Checking Pilot: {pilotName}</Text>
          </View>
          <View>
            {preFlightCheck && (
              <View>
                <Text style={styles.sectionTitle}>Pre-Flight Check</Text>
                {renderSections(preFlightCheck)}
              </View>
            )}
            {postFlightCheck && (
              <View>
                <Text style={styles.sectionTitle}>Post-Flight Check</Text>
                {renderSections(postFlightCheck)}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );

  return <ChecklistDocument />;
}

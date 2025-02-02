
type Task = {
  description: string;
  type: "checkbox" | "instruction";
  inspection_required?:
    | "CHECK"
    | "INSPECT"
    | "PERFORM"
    | "SET"
    | "OFF"
    | "LOCKED"
    | string; // Allow specific values or any string
  mechanic_response?: boolean;
  pilot_response?: boolean;
};

type Section = {
  section: string;
  isMainSection: boolean;
  tasks: Task[];
};

type PreFlightCheck = Section[];
type PostFlightCheck = Section[];

type AircraftChecklist = {
  preFlightCheck: PreFlightCheck;
  postFlightCheck: PostFlightCheck;
};

export type {
  AircraftChecklist,
  PreFlightCheck,
  PostFlightCheck,
  Section,
  Task,
};

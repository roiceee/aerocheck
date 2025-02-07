
type Task = {
  description: string;
  type: "checkbox" | "instruction" | "input";
  inspection_required?:
    | "CHECK"
    | "INSPECT"
    | "PERFORM"
    | "SET"
    | "OFF"
    | "LOCKED"
    | string; // Allow specific values or any string
  mechanic_response?: boolean | string;
  pilot_response?: boolean | string;
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

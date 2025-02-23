import { User } from "@supabase/supabase-js";
import { createContext } from "react";

// Create an authentication context
const AuthContext = createContext<{
  user: { user: User | null; role: "mechanic" | "pilot" | "superadmin" | null };
  setUser: React.Dispatch<
    React.SetStateAction<{
      user: User | null;
      role: "mechanic" | "pilot" | "superadmin" | null;
    }>
  >;
  loadingState: "initial" | "loading" | "done";
}>({
  user: { user: null, role: null },
  setUser: () => null,
  loadingState: "initial",
});
export default AuthContext;

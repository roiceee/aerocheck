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
  loading: boolean;
}>({
  user: { user: null, role: null },
  setUser: () => null,
  loading: true,
});
export default AuthContext;

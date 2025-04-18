import supabase from "@/supabase-client";
import { User } from "@supabase/auth-js";
import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{
    user: User | null;
    role: "mechanic" | "pilot" | "superadmin" | null;
  }>({
    user: null,
    role: null,
  });
  const [loadingState, setLoadingState] = useState<
    "initial" | "loading" | "done"
  >("initial");

  const getUserRole = async (
    user: User
  ): Promise<"mechanic" | "pilot" | "superadmin" | null> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    return error ? null : data.role;
  };

  useEffect(() => {
    setLoadingState("loading");

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setTimeout(async () => {
          const user = session?.user ?? null;
          if (user) {
            if (event === "SIGNED_IN") {
              const { data: allowedUser, error: fetchError } = await supabase
                .from("allowed_users")
                .select("email")
                .eq("email", user.email!)
                .single();

              if (fetchError || !allowedUser) {
                await supabase.auth.signOut();
                toast("You are not allowed to access this app");
                setLoadingState("done");
              } else {
                const role = await getUserRole(user);

                if (!role) {
                  const { data } = await supabase
                    .from("allowed_users")
                    .select("*")
                    .eq("email", user.email!)
                    .single();

                  // for cases where the user is already in the database
                  if (data?.initial_role) {
                    const fetchedRole = data.initial_role as
                      | "mechanic"
                      | "pilot"
                      | "superadmin";
                    await supabase.from("user_roles").insert({
                      user_id: user.id,
                      role: fetchedRole,
                    } as {
                      user_id: string;
                      role: "mechanic" | "pilot" | "superadmin";
                    });
                    setUser({ user, role: fetchedRole });
                    setLoadingState("done");
                    return;
                  }
                }

                setUser({ user, role: role ?? null });
                setLoadingState("done");
              }
            }
          } else {
            setUser({ user: null, role: null });
            setLoadingState("done");
          }
        }, 0);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     if (data?.user) {
  //       const role = await getUserRole(data.user);
  //       console.log("this gets invoked");
  //       console.log(data.user);
  //       setUser({ user: data.user, role: role ?? null });
  //       setLoadingState("done");
  //     } else if (error) {
  //       console.log("error");
  //       setLoadingState("done");
  //     }
  //   };

  //   fetchUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingState }}>
      {children}
    </AuthContext.Provider>
  );
}

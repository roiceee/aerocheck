import supabase from "@/supabase-client";
import { User } from "@supabase/auth-js";
import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ user: User | null; role: string | null }>({
    user: null,
    role: null,
  });
  const [loading, setLoading] = useState(true);

  const getUserRole = async (user: User): Promise<string | null> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id);
    if (error) {
      return null;
    } else {
      return data[0].role;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const role = await getUserRole(data.user);
        setUser({ user: data.user, role });
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setTimeout(async () => {
          const user = session?.user ?? null;
          if (user) {
            const role = await getUserRole(user);
            setUser({ user, role });
          } else {
            setUser({ user: null, role: null });
          }
          setLoading(false);
        }, 0);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

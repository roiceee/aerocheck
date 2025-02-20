import supabase from "@/supabase-client";

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user", error);
    return null;
  }
}

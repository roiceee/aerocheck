import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AuthContext from "@/context/AuthContext";
import supabase from "@/supabase-client";
import _ from "lodash";
import { Menu } from "lucide-react";
import { useContext } from "react";

export default function AppSheet() {
  const { user } = useContext(AuthContext);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
    else window.location.href = "/login";
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row justify-center">
          <img src="/logo.png" className="h-10" />
          <SheetTitle>Aerocheck</SheetTitle>
        </SheetHeader>
        <SheetDescription></SheetDescription>

        <section className="text-center my-4">
          <img
            src={user.user?.user_metadata.avatar_url}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mx-auto"
          />
          <p>
            {user.user?.user_metadata.full_name ||
              user.user?.user_metadata.username}
          </p>
          <p className="text-gray-600 text-sm">{user.user?.email}</p>
          <p className="font-semibold my-2">{_.capitalize(user.role ? user.role : "")}</p>
        </section>
        <Button className="w-full" onClick={logout}>
          Logout
        </Button>
      </SheetContent>
    </Sheet>
  );
}

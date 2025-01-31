import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase-client";

export default function AppSheet() {
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
        <SheetHeader>
          <SheetTitle>Aerocheck</SheetTitle>
          <SheetDescription>
            <Button className="w-full" onClick={logout}>
              Logout
            </Button>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

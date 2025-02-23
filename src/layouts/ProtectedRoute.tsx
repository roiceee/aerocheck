import AuthContext from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loadingState } = useContext(AuthContext);

  useEffect(() => {
    if (loadingState !== "done") return; // Only run checks when loading is done

    const checkUser = async () => {
      if (!user.user) {
        await navigate("/login", { replace: true });
        return;
      }

      // If user is admin and tries to access pages not starting with /admin, redirect to /admin
      if (
        user.user &&
        user.role === "superadmin" &&
        !location.pathname.startsWith("/admin")
      ) {
        await navigate("/admin", { replace: true });
        return;
      }

      // If user is not admin and tries to access /admin, redirect to /
      if (
        user.user &&
        user.role !== "superadmin" &&
        location.pathname.startsWith("/admin")
      ) {
        await navigate("/", { replace: true });
        return;
      }
    };

    checkUser();
  }, [navigate, user, loadingState, location.pathname]);

  // Don't render anything until loadingState is "done"
  if (loadingState !== "done") return null;

  if (!user.user) return null;


  return children;
}

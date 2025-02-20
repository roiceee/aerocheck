import AuthContext from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation()
  const { user, loading } = useContext(AuthContext);



  useEffect(() => {
    const checkUser = async () => {
      if (!user.user) {
        navigate("/login", { replace: true });
      }

      
      //if user is admin and tries to access pages not starting with /admin, redirect to /admin
      if (user.user && user.role === "superadmin" && !location.pathname.startsWith("/admin")) {
        console.log(user.user);
        console.log("sheesh");
        navigate("/admin", { replace: true });
      }

      // if user is not admin and tries to access /admin, redirect to /
      if (user.user && user.role !== "superadmin" && location.pathname.startsWith("/admin")) {
        navigate("/", { replace: true });
      }

    };

    if (!loading) checkUser();
  }, [navigate, user, loading, location.pathname]);

  if (loading)
    return (
      //   <div className="flex justify-center items-center h-screen">
      //     <img src="/logo.png" height={100} width={100} />
      //   </div>
      <></>
    ); // Prevents flickering while checking auth

  return children;
}

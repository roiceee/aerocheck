import AuthContext from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    };

    if (!loading) checkUser();
  }, [navigate, user, loading]);

  if (loading)
    return (
      //   <div className="flex justify-center items-center h-screen">
      //     <img src="/logo.png" height={100} width={100} />
      //   </div>
      <></>
    ); // Prevents flickering while checking auth

  return children;
}

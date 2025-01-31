import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.data.user) {
        navigate("/login", { replace: true });
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (loading)
    return (
      //   <div className="flex justify-center items-center h-screen">
      //     <img src="/logo.png" height={100} width={100} />
      //   </div>
      <></>
    ); // Prevents flickering while checking auth

  return children;
}

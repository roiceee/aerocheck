import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import supabase from "./supabase-client";
import ProtectedRoute from "./layouts/ProtectedRoute";

function App() {
  // Check if the user is authenticated and redirect to the login page if not
  useEffect(() => {
    if (window.location.pathname === "/login") return;
    const checkUser = async () => {
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.data.user) {
        window.location.href = "/login";
      }
    };
    checkUser();
  }, []);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;

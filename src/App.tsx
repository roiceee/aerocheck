import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  // Check if the user is authenticated and redirect to the login page if not


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

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AddCheckPage from "./pages/AddCheckPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import ChecklistPage from "./pages/checklist/ChecklistPage";

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
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/check/add"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddCheckPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checklist/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ChecklistPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <h1>
                    Not Found. Go to
                    <a href="/" className="text-blue-500 ">
                      {" "}
                      Home.
                    </a>
                  </h1>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;

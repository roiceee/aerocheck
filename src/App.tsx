import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AddCheckPage from "./pages/AddCheckPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ChecklistPage from "./pages/checklist/ChecklistPage";
import Home from "./pages/Home";
import Login from "./pages/Login";

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/check/add", element: <AddCheckPage /> },
  { path: "/checklist/:id", element: <ChecklistPage /> },
  { path: "/admin", element: <AdminHomePage /> },
  { path: "/admin/checklist/:id", element: <ChecklistPage /> },
];

function App() {
  return (
    <main className="max-w-[900px] mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <MainLayout>{element}</MainLayout>
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <h1>
                    Not Found. Go to
                    <a href="/" className="text-blue-500">
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

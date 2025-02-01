import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContextProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

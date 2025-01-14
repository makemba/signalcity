import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Statistics from "./pages/Statistics";
import Supervision from "./pages/Supervision";
import ManagerDashboard from "./pages/ManagerDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <AdminDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/statistics"
              element={
                <AuthGuard>
                  <Statistics />
                </AuthGuard>
              }
            />
            <Route
              path="/supervision"
              element={
                <AuthGuard>
                  <Supervision />
                </AuthGuard>
              }
            />
            <Route
              path="/manager"
              element={
                <AuthGuard>
                  <ManagerDashboard />
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
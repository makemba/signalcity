import React, { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Statistics from "./pages/Statistics";
import Supervision from "./pages/Supervision";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReportIncident from "./pages/ReportIncident";
import NoiseAnalysis from "./pages/NoiseAnalysis";
import EmergencyContact from "./pages/EmergencyContact";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/signaler" element={<ReportIncident />} />
              <Route path="/analyse-sonore" element={<NoiseAnalysis />} />
              <Route path="/urgence" element={<EmergencyContact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profil" element={<UserProfile />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ReportIncident from '@/pages/ReportIncident';
import NoiseAnalysis from '@/pages/NoiseAnalysis';
import TicketDetails from '@/pages/TicketDetails';
import Statistics from '@/pages/Statistics';
import AdminDashboard from '@/pages/AdminDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import EmergencyContact from '@/pages/EmergencyContact';
import ReportAnalytics from '@/pages/ReportAnalytics';
import NotFound from '@/pages/NotFound';
import Support from '@/pages/Support';
import TeamSupervision from '@/pages/TeamSupervision';
import Supervision from '@/pages/Supervision';
import UserProfile from '@/pages/UserProfile';
import HotspotAnalysis from '@/pages/HotspotAnalysis';
import AuthGuard from '@/components/AuthGuard';
import EmergencyChatPage from '@/pages/EmergencyChat';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import IncidentFeedback from '@/pages/IncidentFeedback';
import SyncIncidents from '@/pages/SyncIncidents';
import OfflineBanner from '@/components/OfflineBanner';
import FAQ from '@/pages/FAQ';
import { NotificationsProvider } from '@/contexts/NotificationsContext';

import '@/App.css';

function App() {
  return (
    <NotificationsProvider>
      <Router>
        <OfflineBanner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          {/* Page d'accueil accessible sans authentification */}
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/report-incident"
            element={
              <AuthGuard>
                <ReportIncident />
              </AuthGuard>
            }
          />
          <Route
            path="/noise-analysis"
            element={
              <AuthGuard>
                <NoiseAnalysis />
              </AuthGuard>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <AuthGuard>
                <TicketDetails />
              </AuthGuard>
            }
          />
          <Route
            path="/incidents/:id/feedback"
            element={
              <AuthGuard>
                <IncidentFeedback />
              </AuthGuard>
            }
          />
          <Route
            path="/sync-incidents"
            element={
              <AuthGuard>
                <SyncIncidents />
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
            path="/admin-dashboard"
            element={
              <AuthGuard requiredRole="admin">
                <AdminDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              <AuthGuard requiredRole="moderator">
                <ManagerDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/super-admin-dashboard"
            element={
              <AuthGuard requiredRole="super_admin">
                <SuperAdminDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/emergency-contact"
            element={
              <AuthGuard>
                <EmergencyContact />
              </AuthGuard>
            }
          />
          <Route
            path="/emergency-chat"
            element={
              <AuthGuard>
                <EmergencyChatPage />
              </AuthGuard>
            }
          />
          <Route
            path="/report-analytics"
            element={
              <AuthGuard>
                <ReportAnalytics />
              </AuthGuard>
            }
          />
          <Route
            path="/support"
            element={
              <AuthGuard>
                <Support />
              </AuthGuard>
            }
          />
          <Route
            path="/team-supervision"
            element={
              <AuthGuard requiredRole="moderator">
                <TeamSupervision />
              </AuthGuard>
            }
          />
          <Route
            path="/supervision"
            element={
              <AuthGuard requiredRole="admin">
                <Supervision />
              </AuthGuard>
            }
          />
          <Route
            path="/user-profile"
            element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            }
          />
          <Route
            path="/hotspot-analysis"
            element={
              <AuthGuard>
                <HotspotAnalysis />
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </NotificationsProvider>
  );
}

export default App;

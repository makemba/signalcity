
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import ReportIncident from '@/pages/ReportIncident';
import NoiseAnalysis from '@/pages/NoiseAnalysis';
import AdvancedNoiseAnalysis from '@/pages/AdvancedNoiseAnalysis';
import Statistics from '@/pages/Statistics';
import HotspotAnalysis from '@/pages/HotspotAnalysis';
import ReportAnalytics from '@/pages/ReportAnalytics';
import UserProfile from '@/pages/UserProfile';
import Supervision from '@/pages/Supervision';
import TeamSupervision from '@/pages/TeamSupervision';
import Support from '@/pages/Support';
import TicketDetails from '@/pages/TicketDetails';
import SyncIncidents from '@/pages/SyncIncidents';
import InnovativeAnalytics from '@/pages/InnovativeAnalytics';
import EmergencyContact from '@/pages/EmergencyContact';
import EmergencyChat from '@/pages/EmergencyChat';
import IncidentFeedback from '@/pages/IncidentFeedback';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import FAQ from '@/pages/FAQ';
import { Toaster as SonnerToaster } from 'sonner';
import ServiceWorkerStatus from '@/components/ServiceWorkerStatus';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/report-incident" element={<ReportIncident />} />
        <Route path="/noise-analysis" element={<NoiseAnalysis />} />
        <Route path="/advanced-noise-analysis" element={<AdvancedNoiseAnalysis />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/hotspot-analysis" element={<HotspotAnalysis />} />
        <Route path="/report-analytics" element={<ReportAnalytics />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/supervision" element={<Supervision />} />
        <Route path="/team-supervision" element={<TeamSupervision />} />
        <Route path="/support" element={<Support />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
        <Route path="/sync-incidents" element={<SyncIncidents />} />
        <Route path="/innovative-analytics" element={<InnovativeAnalytics />} />
        <Route path="/emergency-contact" element={<EmergencyContact />} />
        <Route path="/emergency-chat/:id" element={<EmergencyChat />} />
        <Route path="/incident-feedback/:id" element={<IncidentFeedback />} />
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <SonnerToaster position="bottom-right" />
      <ServiceWorkerStatus />
    </Router>
  );
}

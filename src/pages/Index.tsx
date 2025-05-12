
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/index/HeroSection";
import { StatsSummarySection } from "@/components/index/StatsSummarySection";
import { ServicesSection } from "@/components/index/ServicesSection";
import { DataVisualizationSection } from "@/components/index/DataVisualizationSection";
import { MapAndIncidentsSection } from "@/components/index/MapAndIncidentsSection";
import { IncidentFormSection } from "@/components/index/IncidentFormSection";
import { EmergencyServicesSection } from "@/components/index/EmergencyServicesSection";
import { ImportantInfoSection } from "@/components/index/ImportantInfoSection";
import { SupportSection } from "@/components/index/SupportSection";
import { FAQSection } from "@/components/index/FAQSection";

export default function Index() {
  const { data: recentIncidents } = useQuery({
    queryKey: ["recent-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["incident-stats"],
    queryFn: async () => {
      const { count: total, error: totalError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact' });

      if (totalError) throw totalError;

      const { count: pending, error: pendingError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact' })
        .eq("status", "PENDING");

      if (pendingError) throw pendingError;
      
      return {
        total: total || 0,
        pending: pending || 0
      };
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <HeroSection />

      <main className="container mx-auto py-12 px-4">
        <StatsSummarySection stats={stats} />
        <ServicesSection />
        <DataVisualizationSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MapAndIncidentsSection />

          <div className="space-y-8">
            <IncidentFormSection />
            <EmergencyServicesSection />
            <ImportantInfoSection />
          </div>
        </div>

        <Testimonials />
        <Partners />
        <SupportSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
}
